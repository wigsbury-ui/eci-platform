import { Profile, PartnerChannel, PartnerStatus, UserRole } from '@/lib/types'
import { isStaff } from '@/lib/auth/roles'

/** Paths available before admin acceptance. */
export const APPLICANT_AGENT_PATHS = [
  '/agent',
  '/agent/about',
  '/agent/why-partner',
  '/agent/contracts',
] as const

/** Paths that require accepted partner status (staff always allowed). */
export const ACCEPTED_ONLY_AGENT_PATHS = [
  '/agent/resources',
  '/agent/materials',
  '/agent/referrals',
  '/agent/briefing',
  '/agent/toolkit',
  '/agent/markets',
  '/agent/engagement',
] as const

export function isIntroductionPartnerRole(role?: string | null): boolean {
  return role === 'agent'
}

export function partnerChannelLabel(channel?: PartnerChannel | null): string {
  if (channel === 'rainmaker') return 'Rainmaker'
  return 'Introduction agent'
}

export function partnerStatusLabel(status?: PartnerStatus | null): string {
  if (status === 'accepted') return 'Accepted partner'
  return 'Applicant'
}

/**
 * Staff browsing the portal see the full accepted toolkit.
 * Introduction partners need partner_status === 'accepted'.
 * Legacy agents with null status (pre-migration) keep full access.
 */
export function hasAcceptedPartnerAccess(profile?: Profile | null): boolean {
  if (!profile) return false
  if (isStaff(profile.role) || profile.role === 'super_admin') return true
  if (!isIntroductionPartnerRole(profile.role)) return false
  if (profile.partner_status == null) return true
  return profile.partner_status === 'accepted'
}

export function isApplicantPartner(profile?: Profile | null): boolean {
  if (!profile) return false
  if (!isIntroductionPartnerRole(profile.role)) return false
  return profile.partner_status === 'applicant'
}

export function canAccessAgentTierPath(pathname: string, profile?: Profile | null): boolean {
  if (!profile) return false
  if (!(isIntroductionPartnerRole(profile.role) || isStaff(profile.role) || profile.role === 'super_admin')) {
    return false
  }

  const acceptedOnly = ACCEPTED_ONLY_AGENT_PATHS.some(
    p => pathname === p || pathname.startsWith(`${p}/`)
  )
  if (acceptedOnly) return hasAcceptedPartnerAccess(profile)
  return true
}

export function defaultPartnerFieldsForInvite(
  channel: PartnerChannel = 'agent'
): { partner_status: PartnerStatus; partner_channel: PartnerChannel } {
  return { partner_status: 'applicant', partner_channel: channel }
}

export const AGENT_PORTAL_ALLOWED_ROLES: UserRole[] = [
  'agent',
  'admin',
  'board_member',
  'super_admin',
]
