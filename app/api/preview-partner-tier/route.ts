import { NextResponse } from 'next/server'
import { PREVIEW_PARTNER_COOKIE } from '@/lib/supabase/session'
import { hasSupabaseEnv } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (hasSupabaseEnv()) {
    return NextResponse.json({ error: 'Preview tier toggle disabled when Supabase is configured' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as { status?: string } | null
  const status = body?.status === 'accepted' ? 'accepted' : 'applicant'

  const res = NextResponse.json({ ok: true, status })
  res.cookies.set(PREVIEW_PARTNER_COOKIE, status, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
