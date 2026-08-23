import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, hasServiceRoleEnv } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import { DELIVERY_EVIDENCE_BUCKET } from '@/lib/delivery/config'
import {
  getServicePromiseById,
  insertPromiseEvidence,
} from '@/lib/delivery/db'
import { createDeliveryNotification } from '@/lib/delivery/notifications'
import { sanitizeDeliveryFileName, validateDeliveryEvidenceFile } from '@/lib/delivery/validation'

export async function POST(request: Request) {
  if (!hasServiceRoleEnv()) {
    return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
  }

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const form = await request.formData()
  const promiseId = String(form.get('promiseId') ?? '')
  const file = form.get('file')
  if (!promiseId || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'promiseId and file required' }, { status: 400 })
  }

  const problem = validateDeliveryEvidenceFile(file)
  if (problem) return NextResponse.json({ error: problem }, { status: 400 })

  const promise = await getServicePromiseById(promiseId)
  if (!promise) return NextResponse.json({ error: 'Promise not found' }, { status: 404 })

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const safeName = sanitizeDeliveryFileName(file.name)
  const storagePath = `${promise.school_id}/${promiseId}/${Date.now()}-${safeName}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: storageError } = await admin.storage.from(DELIVERY_EVIDENCE_BUCKET).upload(storagePath, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 })
  }

  const { evidence, error } = await insertPromiseEvidence({
    promise_id: promiseId,
    title: file.name,
    file_name: file.name,
    storage_path: storagePath,
    added_by: user.id,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })

  await createDeliveryNotification({
    school_id: promise.school_id,
    promise_id: promiseId,
    audience: 'school_partner',
    kind: 'evidence_added',
    title: `New evidence: ${promise.title}`,
    body: `${file.name} was attached to this promise.`,
    metadata: { evidence_id: evidence?.id },
  })

  return NextResponse.json({ evidence })
}
