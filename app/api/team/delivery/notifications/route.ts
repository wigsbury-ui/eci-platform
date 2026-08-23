import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isStaff } from '@/lib/auth/roles'
import {
  listDeliveryNotifications,
  markNotificationRead,
} from '@/lib/delivery/notifications'

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(request.url)
  const schoolId = url.searchParams.get('schoolId')
  const unreadOnly = url.searchParams.get('unread') === '1'

  const notifications = await listDeliveryNotifications({
    schoolId: schoolId ?? undefined,
    audience: 'staff',
    unreadOnly,
    limit: 40,
  })

  return NextResponse.json({ notifications })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const id = body.id as string | undefined
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await markNotificationRead(id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
