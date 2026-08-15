import { NextRequest, NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { isStaff } from '@/lib/auth/roles'
import { VIEW_SCHOOL_COOKIE } from '@/lib/auth/school-view'
import { previewProfile } from '@/lib/supabase/session'

function safeNext(raw: string | null, fallback: string) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return fallback
  return raw
}

async function assertStaff(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return previewProfile('super_admin')
  }
  const supabase = await createClient()
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !isStaff(profile.role as string)) return null
  return profile
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const clear = url.searchParams.get('clear') === '1'
  const school = url.searchParams.get('school')?.trim()
  const nextPath = safeNext(url.searchParams.get('next'), clear ? '/team' : '/school')

  const staff = await assertStaff(request)
  if (!staff) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url))

  if (clear) {
    response.cookies.set(VIEW_SCHOOL_COOKIE, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    })
    return response
  }

  if (!school) {
    return NextResponse.redirect(new URL('/team/schools', request.url))
  }

  response.cookies.set(VIEW_SCHOOL_COOKIE, school, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    httpOnly: true,
  })

  return response
}
