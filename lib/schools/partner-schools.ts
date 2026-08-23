import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import type { School } from '@/lib/types'

/** Slugs that must never appear in partner portals, delivery, or public network UI. */
export const EXCLUDED_PARTNER_SCHOOL_IDS = ['muscat'] as const

const EXCLUDED_NAME_PATTERNS = [/muscat/i, /ellesmere college muscat/i]

/**
 * Ellesmere College Muscat is no longer an ECI partner school.
 * Filter at the application layer so stale DB rows never surface in the UI.
 */
export function isExcludedPartnerSchool(
  school: Pick<School, 'id' | 'name' | 'city'> | { id: string; name?: string; city?: string }
): boolean {
  const id = school.id?.toLowerCase() ?? ''
  if (EXCLUDED_PARTNER_SCHOOL_IDS.some(slug => id === slug || id.includes(slug))) {
    return true
  }
  const name = school.name ?? ''
  if (EXCLUDED_NAME_PATTERNS.some(re => re.test(name))) {
    return true
  }
  const city = school.city?.toLowerCase() ?? ''
  if (city === 'muscat' && /ellesmere/i.test(name)) {
    return true
  }
  return false
}

export function filterPartnerSchools<T extends Pick<School, 'id' | 'name' | 'city'>>(schools: T[]): T[] {
  return schools.filter(s => !isExcludedPartnerSchool(s))
}

/** Canonical seed list when Supabase is empty or in preview — matches network.ts, no Muscat. */
export function seedPartnerSchools(): School[] {
  return [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    country: s.country,
    city: s.city,
    status: s.status,
    logo_url: null,
    website: s.website || null,
    contact_name: null,
    contact_email: null,
    student_count: null,
    year_joined: s.year_joined || null,
    curriculum: s.curriculum,
    accreditations: null,
    description: s.description,
    short_bio: s.short_bio,
    is_public: true,
  }))
}

export function resolvePartnerSchools(dbSchools: School[] | null | undefined): School[] {
  const fromDb = filterPartnerSchools(dbSchools ?? [])
  if (fromDb.length > 0) return fromDb
  return seedPartnerSchools()
}
