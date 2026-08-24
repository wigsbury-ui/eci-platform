import { NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import {
  buildIntakeShareUrl,
  ensureDefaultIntakeLink,
  generateIntakeToken,
  listIntakeLinks,
} from '@/lib/intake/links'
import { resolveSiteBaseUrl } from '@/lib/intake/shareUrl'

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

export async function GET() {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const defaultLink = await ensureDefaultIntakeLink(staff.profile.id)
  const links = await listIntakeLinks()
  const siteBase = await resolveSiteBaseUrl()

  return NextResponse.json({
    siteBase,
    links,
    defaultShareUrl: defaultLink ? buildIntakeShareUrl(siteBase, defaultLink.token) : null,
  })
}

export async function POST(request: Request) {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const label =
    typeof body?.label === 'string' && body.label.trim()
      ? body.label.trim().slice(0, 120)
      : 'Colleague upload'

  const token = generateIntakeToken()
  const { data, error } = await admin
    .from('document_intake_links')
    .insert({
      token,
      label,
      is_active: true,
      created_by: staff.profile.id,
    })
    .select('*')
    .single()

  if (error || !data) {
    console.error('intake link create', error)
    const missingTable =
      error?.code === '42P01' || error?.message?.includes('document_intake_links')
    return NextResponse.json(
      {
        error: missingTable
          ? 'Document intake is not fully ready yet. Please try again shortly.'
          : 'Could not create link.',
      },
      { status: 500 }
    )
  }

  const siteBase = await resolveSiteBaseUrl()
  return NextResponse.json({
    link: data,
    shareUrl: buildIntakeShareUrl(siteBase, data.token),
  })
}
