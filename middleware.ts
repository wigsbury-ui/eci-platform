import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { canAccessPath, portalForRole } from '@/lib/auth/roles'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Allow public site and build without Supabase configured
  if (!supabaseUrl || !supabaseKey) {
    if (path.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = path.replace(/^\/admin/, '/team') || '/team'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Use path segment boundaries so /investors (public) is not treated as /investor
  const isProtected =
    path === '/investor' ||
    path.startsWith('/investor/') ||
    path === '/agent' ||
    path.startsWith('/agent/') ||
    path === '/school' ||
    path.startsWith('/school/') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/team' ||
    path.startsWith('/team/')

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (user && path.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = path.replace(/^\/admin/, '/team') || '/team'
    return NextResponse.redirect(url)
  }

  if (user && isProtected) {
    const { data: role } = await supabase.rpc('get_my_role')
    if (role && !canAccessPath(path, role as string)) {
      return NextResponse.redirect(new URL(portalForRole(role as string), request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
