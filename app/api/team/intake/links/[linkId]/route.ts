import { NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'

type RouteContext = { params: Promise<{ linkId: string }> }

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

export async function PATCH(request: Request, context: RouteContext) {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { linkId } = await context.params
  const body = await request.json().catch(() => ({}))
  const revoke = body?.revoke !== false

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const { data, error } = await admin
    .from('document_intake_links')
    .update({
      is_active: !revoke,
      revoked_at: revoke ? new Date().toISOString() : null,
    })
    .eq('id', linkId)
    .select('*')
    .single()

  if (error || !data) {
    console.error('intake link revoke', error)
    return NextResponse.json({ error: 'Could not update link' }, { status: 500 })
  }

  return NextResponse.json({ link: data })
}
