import { UserRole } from '@/lib/types'

export const STAFF_ROLES: UserRole[] = ['employee', 'admin', 'board_member', 'super_admin']
export const SUPER_ADMIN_ROLES: UserRole[] = ['super_admin', 'admin']
export const INVESTOR_ROLES: UserRole[] = ['investor', 'super_admin', 'admin', 'board_member']
export const SCHOOL_ROLES: UserRole[] = ['school_partner', 'super_admin', 'admin', 'employee', 'board_member']
export const AGENT_ROLES: UserRole[] = ['agent', 'super_admin', 'admin', 'board_member']

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
