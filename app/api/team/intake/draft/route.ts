import { NextResponse } from 'next/server'
import type { PostgrestError } from '@supabase/supabase-js'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import type { IntakePillar } from '@/lib/types'
import { INTAKE_PILLARS } from '@/lib/intake/config'
import { sanitizeDraftMarkdown } from '@/lib/intake/sanitize'
import { isLlmConfigured } from '@/lib/llm/client'

/** Allow long Anthropic generations on Vercel (Pro caps at 300s). */
export const maxDuration = 300
export const runtime = 'nodejs'

const PILLAR_VALUES = new Set(INTAKE_PILLARS.map(p => p.value))

type DraftInsert = {
  title: string
  pillar: IntakePillar | null
  prompt_notes: string | null
  source_batch_id: string | null
  source_file_ids: string[]
  body_markdown: string | null
  status: 'draft'
  created_by: string | null
}

function formatDbError(error: PostgrestError | null): string {
  if (!error) return 'Could not save draft'
  const parts = [error.message, error.details, error.hint].filter(Boolean)
  const joined = parts.join(' — ')
  if (error.code === '23503') {
    return joined || 'Database reference error while saving the draft.'
  }
  if (error.code === '23514') {
    return joined || 'Draft data did not pass validation. Check pillar and status values.'
  }
  if (error.code === '42P01') {
    return 'The document_drafts table is missing. Run migration 008_document_intake.sql in Supabase.'
  }
  return joined || 'Could not save draft'
}

async function insertDraftWithFallback(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  payload: DraftInsert
) {
  const attempts: DraftInsert[] = [
    payload,
    { ...payload, created_by: null },
    { ...payload, created_by: null, source_batch_id: null },
  ]

  let lastError: PostgrestError | null = null
  for (const attempt of attempts) {
    const { data, error } = await admin.from('document_drafts').insert(attempt).select('*').single()
    if (data && !error) {
      return { draft: data, error: null }
    }
    lastError = error
    if (error?.code !== '23503') break
  }

  return { draft: null, error: lastError }
}

async function markBatchReady(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  batchId: string,
  reviewedBy: string | null
) {
  const base = {
    status: 'ready_for_articulation' as const,
    reviewed_at: new Date().toISOString(),
  }

  const withReviewer = reviewedBy ? { ...base, reviewed_by: reviewedBy } : base
  const { error } = await admin.from('document_intake_batches').update(withReviewer).eq('id', batchId)

  if (error?.code === '23503' && reviewedBy) {
    const retry = await admin.from('document_intake_batches').update(base).eq('id', batchId)
    if (retry.error) {
      console.error('[intake-draft] batch status update failed', retry.error)
    }
    return
  }

  if (error) {
    console.error('[intake-draft] batch status update failed', error)
  }
}

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
  try {
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
      return NextResponse.json(
        {
          error:
            'Server storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.',
        },
        { status: 503 }
      )
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
      const { gatherSourceText, generateArticulatedDraft } = await import('@/lib/intake/articulate')
      const gathered = await gatherSourceText(sourceFileIds)
      if (!gathered.ok) {
        console.error('[intake-draft] extract failed', gathered.error)
        return NextResponse.json(
          {
            error:
              gathered.error ||
              'Could not read text from the uploaded file(s). Prefer PDF or Word (.docx).',
          },
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
      bodyMarkdown = sanitizeDraftMarkdown(drafted.body)
      if (!bodyMarkdown) {
        return NextResponse.json(
          { error: 'AI returned an empty draft body. Please try again.' },
          { status: 502 }
        )
      }
    }

    const insertPayload: DraftInsert = {
      title,
      pillar,
      prompt_notes: promptNotes || null,
      source_batch_id: sourceBatchId,
      source_file_ids: sourceFileIds,
      body_markdown: bodyMarkdown,
      status: 'draft',
      created_by: staff.profile.id,
    }

    const { draft, error: insertError } = await insertDraftWithFallback(admin, insertPayload)

    if (!draft) {
      console.error('[intake-draft] insert failed', insertError)
      return NextResponse.json({ error: formatDbError(insertError) }, { status: 500 })
    }

    if (sourceBatchId) {
      await markBatchReady(admin, sourceBatchId, staff.profile.id)
    }

    console.info('[intake-draft] ok', { draftId: draft.id, bodyChars: bodyMarkdown?.length ?? 0 })
    return NextResponse.json({ draft })
  } catch (err) {
    console.error('[intake-draft] unhandled', err)
    const message = err instanceof Error ? err.message : 'Unexpected error while generating draft'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
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
    if (typeof body.body_markdown === 'string') {
      updates.body_markdown = sanitizeDraftMarkdown(body.body_markdown) ?? ''
    }
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
      return NextResponse.json({ error: formatDbError(error) }, { status: 500 })
    }

    return NextResponse.json({ draft: data })
  } catch (err) {
    console.error('[intake-draft] patch unhandled', err)
    const message = err instanceof Error ? err.message : 'Could not update draft'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
