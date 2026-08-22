import { NextResponse } from 'next/server'
import { createAdminClient, hasServiceRoleEnv } from '@/lib/supabase/admin'
import {
  INTAKE_BUCKET,
  INTAKE_MAX_FILES_PER_BATCH,
  isValidIntakeToken,
  sanitizeStorageFileName,
} from '@/lib/intake/config'
import { isValidEmail, validateIntakeFile } from '@/lib/intake/validation'

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_MAX_BATCHES = 30
const rateMap = new Map<string, { count: number; reset: number }>

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_MAX_BATCHES) return false
  entry.count += 1
  return true
}

export async function POST(request: Request) {
  if (!hasServiceRoleEnv()) {
    return NextResponse.json({ error: 'Document intake is not configured on this server.' }, { status: 503 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 })
  }

  try {
    const form = await request.formData()
    const token = String(form.get('token') ?? '')
    if (!isValidIntakeToken(token)) {
      return NextResponse.json({ error: 'Invalid intake link.' }, { status: 403 })
    }

    const submitterName = String(form.get('submitter_name') ?? '').trim()
    const submitterEmail = String(form.get('submitter_email') ?? '').trim()
    const department = String(form.get('department') ?? '').trim()
    const notes = String(form.get('notes') ?? '').trim()

    if (!submitterName) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (!isValidEmail(submitterEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const fileEntries = form.getAll('files').filter((v): v is File => v instanceof File && v.size > 0)
    if (!fileEntries.length) {
      return NextResponse.json({ error: 'At least one file is required.' }, { status: 400 })
    }
    if (fileEntries.length > INTAKE_MAX_FILES_PER_BATCH) {
      return NextResponse.json(
        { error: `Maximum ${INTAKE_MAX_FILES_PER_BATCH} files per submission.` },
        { status: 400 }
      )
    }

    for (const file of fileEntries) {
      const problem = validateIntakeFile(file)
      if (problem) return NextResponse.json({ error: problem }, { status: 400 })
    }

    const admin = createAdminClient()
    if (!admin) {
      return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
    }

    const { data: batch, error: batchError } = await admin
      .from('document_intake_batches')
      .insert({
        submitter_name: submitterName,
        submitter_email: submitterEmail,
        department: department || null,
        notes: notes || null,
        status: 'new',
      })
      .select('id')
      .single()

    if (batchError || !batch) {
      console.error('intake batch insert', batchError)
      return NextResponse.json({ error: 'Could not create submission.' }, { status: 500 })
    }

    const uploaded: { id: string; file_name: string }[] = []

    for (const file of fileEntries) {
      const safeName = sanitizeStorageFileName(file.name)
      const storagePath = `${batch.id}/${Date.now()}-${safeName}`
      const buffer = Buffer.from(await file.arrayBuffer())

      const { error: storageError } = await admin.storage.from(INTAKE_BUCKET).upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

      if (storageError) {
        console.error('intake storage upload', storageError)
        return NextResponse.json(
          { error: `Failed to store ${file.name}. Please try again.` },
          { status: 500 }
        )
      }

      const { data: row, error: fileError } = await admin
        .from('document_intake_files')
        .insert({
          batch_id: batch.id,
          storage_path: storagePath,
          file_name: file.name,
          file_size_bytes: file.size,
          mime_type: file.type || null,
        })
        .select('id, file_name')
        .single()

      if (fileError || !row) {
        console.error('intake file insert', fileError)
        return NextResponse.json({ error: 'Failed to record file metadata.' }, { status: 500 })
      }

      uploaded.push(row)
    }

    return NextResponse.json({
      ok: true,
      batchId: batch.id,
      files: uploaded,
    })
  } catch (err) {
    console.error('intake upload', err)
    return NextResponse.json({ error: 'Unexpected error during upload.' }, { status: 500 })
  }
}
