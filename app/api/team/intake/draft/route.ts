import { NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import type { IntakePillar } from '@/lib/types'
import { INTAKE_PILLARS } from '@/lib/intake/config'

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

  let pillar: IntakePillar | null = null
  if (typeof body.pillar === 'string' && PILLAR_VALUES.has(body.pillar as IntakePillar)) {
    pillar = body.pillar as IntakePillar
  }

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
  }

  const { data, error } = await admin
    .from('document_drafts')
    .insert({
      title,
      pillar,
      prompt_notes: promptNotes || null,
      source_batch_id: sourceBatchId,
      source_file_ids: sourceFileIds,
      body_markdown: null,
      status: 'draft',
      created_by: staff.profile.id,
    })
    .select('*')
    .single()

  if (error || !data) {
    console.error('draft insert', error)
    return NextResponse.json({ error: 'Could not create draft' }, { status: 500 })
  }

  if (sourceBatchId) {
    await admin
      .from('document_intake_batches')
      .update({
        status: 'ready_for_articulation',
        reviewed_by: staff.profile.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', sourceBatchId)
  }

  return NextResponse.json({ draft: data })
}
