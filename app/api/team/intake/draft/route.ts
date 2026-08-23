import { NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import type { IntakePillar } from '@/lib/types'
import { INTAKE_PILLARS } from '@/lib/intake/config'
import { gatherSourceText, generateArticulatedDraft } from '@/lib/intake/articulate'
import { isLlmConfigured } from '@/lib/llm/client'

/** Allow long Anthropic generations on Vercel (Pro). */
export const maxDuration = 300
export const runtime = 'nodejs'

const PILLAR_VALUES = new Set(INTAKE_PILLARS.map(p => p.value))

async function assertStaff() {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role, id').eq('id', user.id).single()
  if (!profile?.role || !isStaff(profile.role)) return null
  return { profile }
}

export async function POST(request: Request) {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const promptNotes = typeof body.prompt_notes === 'string' ? body.prompt_notes.trim() : ''
  const sourceBatchId = typeof body.source_batch_id === 'string' ? body.source_batch_id : null
  const sourceFileIds = Array.isArray(body.source_file_ids)
    ? body.source_file_ids.filter((id: unknown) => typeof id === 'string')
    : []
  const generate = body.generate !== false

  let pillar: IntakePillar | null = null
  if (typeof body.pillar === 'string' && PILLAR_VALUES.has(body.pillar as IntakePillar)) {
    pillar = body.pillar as IntakePillar
  }

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!sourceFileIds.length) {
    return NextResponse.json(
      { error: 'No source files were selected. Expand the submission and try again.' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
  }

  let bodyMarkdown: string | null = null

  if (generate) {
    if (!isLlmConfigured()) {
      return NextResponse.json(
        {
          error:
            'AI drafting is not available. Add ANTHROPIC_API_KEY (and LLM_MODEL if needed) in Vercel, then redeploy.',
        },
        { status: 503 }
      )
    }

    console.info('[intake-draft] extracting', { fileCount: sourceFileIds.length, title })
    const gathered = await gatherSourceText(sourceFileIds)
    if (!gathered.ok) {
      console.error('[intake-draft] extract failed', gathered.error)
      return NextResponse.json(
        { error: gathered.error || 'Could not read text from the uploaded file(s). Prefer PDF or Word (.docx).' },
        { status: 400 }
      )
    }

    console.info('[intake-draft] generating', {
      sources: gathered.sources.map(s => ({ name: s.fileName, chars: s.text.length })),
    })

    const drafted = await generateArticulatedDraft({
      title,
      pillar,
      promptNotes,
      sources: gathered.sources,
    })

    if (!drafted.ok) {
      console.error('[intake-draft] llm failed', drafted.error)
      return NextResponse.json({ error: drafted.error }, { status: 502 })
    }
    bodyMarkdown = drafted.body
  }

  const insertPayload = {
    title,
    pillar,
    prompt_notes: promptNotes || null,
    source_batch_id: sourceBatchId,
    source_file_ids: sourceFileIds,
    body_markdown: bodyMarkdown,
    status: 'draft',
    created_by: staff.profile.id,
  }

  const { data, error } = await admin.from('document_drafts').insert(insertPayload).select('*').single()

  if (error || !data) {
    console.error('[intake-draft] insert failed', error)
    // Common cause: preview/fake profile id failing FK — retry without created_by
    if (error?.code === '23503') {
      const retry = await admin
        .from('document_drafts')
        .insert({ ...insertPayload, created_by: null })
        .select('*')
        .single()
      if (retry.data) {
        if (sourceBatchId) {
          await admin
            .from('document_intake_batches')
            .update({
              status: 'ready_for_articulation',
              reviewed_at: new Date().toISOString(),
            })
            .eq('id', sourceBatchId)
        }
        return NextResponse.json({ draft: retry.data })
      }
    }
    return NextResponse.json(
      { error: error?.message ? `Could not save draft: ${error.message}` : 'Could not save draft' },
      { status: 500 }
    )
  }

  if (sourceBatchId) {
    const { error: batchError } = await admin
      .from('document_intake_batches')
      .update({
        status: 'ready_for_articulation',
        reviewed_by: staff.profile.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', sourceBatchId)
    if (batchError) {
      console.error('[intake-draft] batch status update failed', batchError)
    }
  }

  console.info('[intake-draft] ok', { draftId: data.id, bodyChars: bodyMarkdown?.length ?? 0 })
  return NextResponse.json({ draft: data })
}

export async function PATCH(request: Request) {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || typeof body.id !== 'string') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (typeof body.title === 'string') updates.title = body.title.trim()
  if (typeof body.body_markdown === 'string') updates.body_markdown = body.body_markdown
  if (typeof body.prompt_notes === 'string') updates.prompt_notes = body.prompt_notes.trim() || null
  if (typeof body.status === 'string') updates.status = body.status

  const { data, error } = await admin
    .from('document_drafts')
    .update(updates)
    .eq('id', body.id)
    .select('*')
    .single()

  if (error || !data) {
    console.error('[intake-draft] update failed', error)
    return NextResponse.json({ error: 'Could not update draft' }, { status: 500 })
  }

  return NextResponse.json({ draft: data })
}
