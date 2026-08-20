import { cookies } from 'next/headers'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { Profile, PartnerChannel, PartnerStatus, UserRole } from '@/lib/types'
import { redirect } from 'next/navigation'
import {
  AGENT_PORTAL_ALLOWED_ROLES,
  canAccessAgentTierPath,
  hasAcceptedPartnerAccess,
} from '@/lib/auth/partnerAccess'

export const PREVIEW_PARTNER_COOKIE = 'eci_preview_partner_status'

export async function getSessionProfile() {
  if (!hasSupabaseEnv()) {
    return { user: null, profile: null as Profile | null, supabase: null }
  }
  const supabase = await createClient()
  if (!supabase) return { user: null, profile: null, supabase: null }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null, supabase }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return { user, profile: normalizeProfile(profile), supabase }
}

function normalizeProfile(raw: unknown): Profile | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  return {
    id: String(p.id),
    full_name: (p.full_name as string | null) ?? null,
    role: p.role as UserRole,
    school_id: (p.school_id as string | null) ?? null,
    job_title: (p.job_title as string | null) ?? null,
    phone: (p.phone as string | null) ?? null,
    avatar_url: (p.avatar_url as string | null) ?? null,
    created_at: String(p.created_at ?? new Date().toISOString()),
    partner_status: (p.partner_status as PartnerStatus | null) ?? null,
    partner_channel: (p.partner_channel as PartnerChannel | null) ?? null,
  }
}

export function previewProfile(
  role: UserRole,
  schoolId: string | null = null,
  opts?: { partnerStatus?: PartnerStatus | null; partnerChannel?: PartnerChannel | null }
): Profile {
  const names: Record<string, string> = {
    school_partner: 'School Partner (Preview)',
    investor: 'Investor (Preview)',
    agent: 'Introduction Partner (Preview)',
    employee: 'ECI Staff (Preview)',
    admin: 'ECI Admin (Preview)',
    board_member: 'Board Member (Preview)',
    super_admin: 'Super Admin (Preview)',
  }

  const isAgent = role === 'agent'
  return {
    id: 'preview',
    full_name: names[role] || 'Preview User',
    role,
    school_id: schoolId,
    job_title: 'Preview mode — connect Supabase for live auth',
    phone: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    partner_status: isAgent
      ? (opts?.partnerStatus ?? 'applicant')
      : (opts?.partnerStatus ?? null),
    partner_channel: isAgent
      ? (opts?.partnerChannel ?? 'agent')
      : (opts?.partnerChannel ?? null),
  }
}

export async function requirePortalAccess(allowed: UserRole[], fallbackRole: UserRole) {
  if (!hasSupabaseEnv()) {
    let partnerStatus: PartnerStatus | undefined
    if (fallbackRole === 'agent') {
      const jar = await cookies()
      const tier = jar.get(PREVIEW_PARTNER_COOKIE)?.value
      partnerStatus = tier === 'accepted' ? 'accepted' : 'applicant'
    }
    return {
      user: null,
      profile: previewProfile(fallbackRole, null, { partnerStatus }),
      supabase: null,
      preview: true as const,
    }
  }

  const session = await getSessionProfile()
  if (!session.user) redirect('/login')
  if (!session.profile) redirect('/login')

  const role = session.profile.role
  const permitted = allowed.includes(role) || role === 'super_admin'
  if (!permitted) redirect('/dashboard')

  return { ...session, preview: false as const }
}

/** Agent/rainmaker portal entry with tier enforcement. */
export async function requireAgentPortalAccess(pathname: string) {
  const session = await requirePortalAccess(AGENT_PORTAL_ALLOWED_ROLES, 'agent')
  if (!canAccessAgentTierPath(pathname, session.profile)) {
    redirect('/agent')
  }
  return {
    ...session,
    accepted: hasAcceptedPartnerAccess(session.profile),
  }
}
