import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import { listServicePromises } from '@/lib/delivery/db'
import type { PromiseStatus } from '@/lib/delivery/types'
import { PROMISE_STATUSES } from '@/lib/delivery/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const schoolId = new URL(request.url).searchParams.get('schoolId')
  const promises = await listServicePromises(schoolId ?? undefined)
  return NextResponse.json({ promises })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const body = await request.json()
  const id = body.id as string | undefined
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (body.status && PROMISE_STATUSES.includes(body.status as PromiseStatus)) {
    updates.status = body.status
    updates.last_reviewed_at = new Date().toISOString()
  }
  if (body.owner_name !== undefined) updates.owner_name = body.owner_name
  if (body.next_review_at !== undefined) updates.next_review_at = body.next_review_at
  if (body.notes !== undefined) updates.notes = body.notes

  const { data: existing } = await admin.from('service_promises').select('status').eq('id', id).single()

  const { data, error } = await admin
    .from('service_promises')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    const msg =
      error.code === '42P01'
        ? 'Run migration 010_partner_delivery.sql in Supabase.'
        : error.message
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  if (body.status && existing?.status !== body.status) {
    await admin.from('promise_reviews').insert({
      promise_id: id,
      reviewed_by: user.id,
      previous_status: existing?.status ?? null,
      new_status: body.status,
      notes: (body.review_notes as string | null) ?? null,
    })
  }

  return NextResponse.json({ promise: data })
}
