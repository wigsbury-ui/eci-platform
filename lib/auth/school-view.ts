import { cookies } from 'next/headers'
import { isStaff } from '@/lib/auth/roles'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { Profile } from '@/lib/types'

export const VIEW_SCHOOL_COOKIE = 'eci_view_school'

const KNOWN_SCHOOLS = [...OPERATING_SCHOOLS, ...OPENING_SOON]

export function schoolLabel(schoolId: string | null | undefined): string {
  if (!schoolId) return 'School'
  const known = KNOWN_SCHOOLS.find(s => s.id === schoolId)
  if (known) return known.name
  return schoolId
}

export function knownSchoolOptions() {
  return KNOWN_SCHOOLS.map(s => ({ id: s.id, name: s.name, city: s.city }))
}

export async function getViewedSchoolId(): Promise<string | null> {
  const store = await cookies()
  const value = store.get(VIEW_SCHOOL_COOKIE)?.value?.trim()
  return value || null
}

/**
 * Resolves which school portal context to show.
 * Staff/super-admins can override via the eci_view_school cookie without logging out.
 */
export async function resolveSchoolPortalContext(profile: Profile | null) {
  const viewedId = await getViewedSchoolId()
  const staff = isStaff(profile?.role)
  const schoolId = viewedId || profile?.school_id || (staff ? 'riyadh' : null) || 'riyadh'
  const viewingAsStaff = Boolean(staff)
  return {
    schoolId,
    schoolName: schoolLabel(schoolId),
    viewingAsStaff,
    viewedId,
    schoolOptions: knownSchoolOptions(),
  }
}
