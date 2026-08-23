import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SCHOOL_ROLES } from '@/lib/auth/roles'
import type { UserRole } from '@/lib/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !SCHOOL_ROLES.includes(profile.role as UserRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const schoolId = new URL(request.url).searchParams.get('schoolId') || profile.school_id
  if (!schoolId) return NextResponse.json({ error: 'No school context' }, { status: 400 })

  let query = supabase
    .from('delivery_notifications')
    .select('*')
    .eq('audience', 'school_partner')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(30)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const notifications = (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    school_id: String(row.school_id),
    promise_id: (row.promise_id as string | null) ?? null,
    audience: row.audience,
    kind: row.kind,
    title: String(row.title),
    body: String(row.body),
    metadata: row.metadata ?? {},
    read_at: (row.read_at as string | null) ?? null,
    created_at: String(row.created_at),
  }))

  return NextResponse.json({ notifications })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !SCHOOL_ROLES.includes(profile.role as UserRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const id = body.id as string | undefined
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('delivery_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('school_id', profile.school_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
