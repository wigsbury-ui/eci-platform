import { NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import type { IntakeBatchStatus, IntakePillar } from '@/lib/types'
import { INTAKE_BATCH_STATUSES, INTAKE_PILLARS } from '@/lib/intake/config'

type RouteContext = { params: Promise<{ batchId: string }> }

const STATUS_VALUES = new Set(INTAKE_BATCH_STATUSES.map(s => s.value))
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
  return { supabase, profile }
}

export async function PATCH(request: Request, context: RouteContext) {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { batchId } = await context.params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}

  if (typeof body.status === 'string' && STATUS_VALUES.has(body.status as IntakeBatchStatus)) {
    updates.status = body.status
  }
  if (body.suggested_pillar === null || body.suggested_pillar === '') {
    updates.suggested_pillar = null
  } else if (
    typeof body.suggested_pillar === 'string' &&
    PILLAR_VALUES.has(body.suggested_pillar as IntakePillar)
  ) {
    updates.suggested_pillar = body.suggested_pillar
  }
  if (typeof body.review_notes === 'string') {
    updates.review_notes = body.review_notes.trim() || null
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  updates.reviewed_by = staff.profile.id
  updates.reviewed_at = new Date().toISOString()

  const admin = createAdminClient()
  const client = admin ?? staff.supabase

  const { data, error } = await client
    .from('document_intake_batches')
    .update(updates)
    .eq('id', batchId)
    .select('*')
    .single()

  if (error || !data) {
    console.error('intake batch update', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ batch: data })
}
