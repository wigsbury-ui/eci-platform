import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { Profile, UserRole } from '@/lib/types'
import { redirect } from 'next/navigation'

export async function getSessionProfile() {
  if (!hasSupabaseEnv()) {
    return { user: null, profile: null as Profile | null, supabase: null }
  }
  const supabase = await createClient()
  if (!supabase) return { user: null, profile: null, supabase: null }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null, supabase }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return { user, profile: profile as Profile | null, supabase }
}

export function previewProfile(role: UserRole, schoolId: string | null = null): Profile {
  const names: Record<string, string> = {
    school_partner: 'School Partner (Preview)',
    investor: 'Investor (Preview)',
    agent: 'Introduction Agent (Preview)',
    employee: 'ECI Staff (Preview)',
    admin: 'ECI Admin (Preview)',
    board_member: 'Board Member (Preview)',
    super_admin: 'Super Admin (Preview)',
  }
  return {
    id: 'preview',
    full_name: names[role] || 'Preview User',
    role,
    school_id: schoolId,
    job_title: 'Preview mode — connect Supabase for live auth',
    phone: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
  }
}

export async function requirePortalAccess(allowed: UserRole[], fallbackRole: UserRole) {
  if (!hasSupabaseEnv()) {
    return {
      user: null,
      profile: previewProfile(fallbackRole),
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
