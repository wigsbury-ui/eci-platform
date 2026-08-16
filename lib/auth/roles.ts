import { UserRole } from '@/lib/types'

export const STAFF_ROLES: UserRole[] = ['employee', 'admin', 'board_member', 'super_admin']
export const SUPER_ADMIN_ROLES: UserRole[] = ['super_admin', 'admin']
export const INVESTOR_ROLES: UserRole[] = ['investor', 'super_admin', 'admin', 'board_member']
export const SCHOOL_ROLES: UserRole[] = ['school_partner', 'super_admin', 'admin', 'employee', 'board_member']
export const AGENT_ROLES: UserRole[] = ['agent', 'super_admin', 'admin', 'board_member']

export type PortalKey = 'team' | 'investor' | 'agent' | 'school'

export const PORTAL_HOMES: Record<PortalKey, string> = {
  team: '/team',
  investor: '/investor',
  agent: '/agent',
  school: '/school',
}

const PORTAL_META: { key: PortalKey; label: string; shortLabel: string }[] = [
  { key: 'team', label: 'Super Admin / Team', shortLabel: 'Team' },
  { key: 'investor', label: 'Investor portal', shortLabel: 'Investor' },
  { key: 'agent', label: 'Agent portal', shortLabel: 'Agent' },
  { key: 'school', label: 'School partner portal', shortLabel: 'School' },
]

export function isStaff(role?: string | null): boolean {
  return !!role && STAFF_ROLES.includes(role as UserRole)
}

export function isSuperAdmin(role?: string | null): boolean {
  return !!role && SUPER_ADMIN_ROLES.includes(role as UserRole)
}

export function portalForRole(role?: string | null): string {
  if (!role) return '/school'
  if (role === 'investor') return '/investor'
  if (role === 'agent') return '/agent'
  if (role === 'school_partner') return '/school'
  if (isStaff(role)) return '/team'
  return '/school'
}

export function canAccessPath(pathname: string, role?: string | null): boolean {
  // Segment-aware: /investors and /agents are public marketing pages
  if (pathname === '/investor' || pathname.startsWith('/investor/')) {
    return !!role && INVESTOR_ROLES.includes(role as UserRole)
  }
  if (pathname === '/agent' || pathname.startsWith('/agent/')) {
    return !!role && AGENT_ROLES.includes(role as UserRole)
  }
  if (pathname === '/school' || pathname.startsWith('/school/')) {
    return !!role && SCHOOL_ROLES.includes(role as UserRole)
  }
  if (pathname.startsWith('/team') || pathname.startsWith('/admin')) return isStaff(role)
  return true
}

export function accessiblePortals(role?: string | null) {
  return PORTAL_META.filter(p => canAccessPath(PORTAL_HOMES[p.key], role)).map(p => ({
    key: p.key,
    href: PORTAL_HOMES[p.key],
    label: p.key === 'team' && isSuperAdmin(role) ? 'Super Admin' : p.label,
    shortLabel: p.key === 'team' && isSuperAdmin(role) ? 'Admin' : p.shortLabel,
  }))
}

/** Prefer an explicit redirect or audience portal when the role is allowed there. */
export function resolvePortalDestination(
  role?: string | null,
  opts?: { redirectTo?: string | null; audience?: string | null }
): string {
  const redirectTo = opts?.redirectTo?.trim()
  if (
    redirectTo &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    canAccessPath(redirectTo, role)
  ) {
    return redirectTo
  }

  const audience = opts?.audience
  if (audience === 'investor' || audience === 'agent' || audience === 'school' || audience === 'team') {
    const href = PORTAL_HOMES[audience]
    if (canAccessPath(href, role)) return href
  }

  return portalForRole(role)
}

export function portalKeyFromPath(pathname: string): PortalKey | null {
  if (pathname === '/investor' || pathname.startsWith('/investor/')) return 'investor'
  if (pathname === '/agent' || pathname.startsWith('/agent/')) return 'agent'
  if (pathname === '/school' || pathname.startsWith('/school/')) return 'school'
  if (pathname.startsWith('/team') || pathname.startsWith('/admin')) return 'team'
  return null
}
