import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SCHOOL_ROLES } from '@/lib/auth/roles'
import type { UserRole } from '@/lib/types'

function mapPromise(row: Record<string, unknown>) {
  const criteria = row.success_criteria
  return {
    id: String(row.id),
    school_id: String(row.school_id),
    service_id: String(row.service_id),
    service_group: Number(row.service_group),
    title: String(row.title),
    promise_text: (row.promise_text as string | null) ?? null,
    success_criteria: Array.isArray(criteria) ? (criteria as string[]) : [],
    status: row.status,
    owner_profile_id: (row.owner_profile_id as string | null) ?? null,
    owner_name: (row.owner_name as string | null) ?? null,
    next_review_at: (row.next_review_at as string | null) ?? null,
    last_reviewed_at: (row.last_reviewed_at as string | null) ?? null,
    notes: null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

/** Read-only promise list for school partners (RLS-scoped). */
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role, school_id').eq('id', user.id).single()
  if (!profile || !SCHOOL_ROLES.includes(profile.role as UserRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const schoolIdParam = new URL(request.url).searchParams.get('schoolId')
  const schoolId = schoolIdParam || profile.school_id
  if (!schoolId) return NextResponse.json({ error: 'No school context' }, { status: 400 })

  let query = supabase.from('service_promises').select('*').order('service_group').order('title')
  query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) {
    const msg =
      error.code === '42P01'
        ? 'Run migration 010_partner_delivery.sql in Supabase.'
        : error.message
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  return NextResponse.json({
    promises: (data ?? []).map((row: Record<string, unknown>) => mapPromise(row)),
  })
}
