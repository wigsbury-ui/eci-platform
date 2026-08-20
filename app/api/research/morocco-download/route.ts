import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { RESEARCH_MOROCCO_COOKIE } from '@/lib/research/cookies'

export async function GET() {
  const jar = await cookies()
  const unlocked = jar.get(RESEARCH_MOROCCO_COOKIE)?.value === '1'
  return NextResponse.json({ unlocked })
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    full_name?: string
    email?: string
    organisation?: string
    country?: string
  } | null

  const full_name = body?.full_name?.trim() || ''
  const email = body?.email?.trim() || ''
  const organisation = body?.organisation?.trim() || ''
  const country = body?.country?.trim() || ''

  if (!full_name || !email || !email.includes('@')) {
    return NextResponse.json({ error: 'Name and a valid email are required.' }, { status: 400 })
  }

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient()
      if (supabase) {
        await supabase.from('investor_enquiries').insert([
          {
            full_name,
            email,
            organisation: organisation || null,
            country: country || null,
            investment_type: 'Morocco research report download',
            message: 'Requested Morocco Private K-12 investor research PDF (gated download).',
          },
        ])
      }
    } catch {
      // Still unlock download if CRM insert fails — form data is secondary to access.
    }
  }

  const res = NextResponse.json({ ok: true, unlocked: true })
  res.cookies.set(RESEARCH_MOROCCO_COOKIE, '1', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
