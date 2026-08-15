import { CalendarEvent, EventVisibility } from '@/lib/types'

export type CalendarTargetOption = {
  id: string
  label: string
  kind: 'admin' | 'school'
}

/** Signature colours for admin + known schools (easy scan on the month grid). */
export const ADMIN_CALENDAR_COLOUR = '#2D1654'
export const NETWORK_CALENDAR_COLOUR = '#4C2585'

const SCHOOL_COLOURS: Record<string, string> = {
  riyadh: '#0F766E',
  muscat: '#B45309',
  doha: '#1D4ED8',
}

const FALLBACK_COLOURS = ['#047857', '#9A3412', '#4338CA', '#0E7490', '#A16207', '#BE123C']

export const COMMON_TIMEZONES: { value: string; label: string }[] = [
  { value: 'Europe/London', label: 'London (UK)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (Saudi Arabia)' },
  { value: 'Asia/Qatar', label: 'Doha (Qatar)' },
  { value: 'Asia/Muscat', label: 'Muscat (Oman)' },
  { value: 'Asia/Dubai', label: 'Dubai (UAE)' },
  { value: 'Africa/Cairo', label: 'Cairo (Egypt)' },
  { value: 'Africa/Casablanca', label: 'Casablanca (Morocco)' },
  { value: 'UTC', label: 'UTC' },
]

export const SCHOOL_DEFAULT_TIMEZONE: Record<string, string> = {
  riyadh: 'Asia/Riyadh',
  muscat: 'Asia/Muscat',
  doha: 'Asia/Qatar',
}

export function schoolColour(schoolId: string): string {
  if (SCHOOL_COLOURS[schoolId]) return SCHOOL_COLOURS[schoolId]
  let hash = 0
  for (let i = 0; i < schoolId.length; i++) hash = (hash * 31 + schoolId.charCodeAt(i)) | 0
  return FALLBACK_COLOURS[Math.abs(hash) % FALLBACK_COLOURS.length]
}

/** Primary colour for an event chip on the calendar grid. */
export function eventColour(event: CalendarEvent): string {
  if (event.all_schools || event.visibility === 'network') return NETWORK_CALENDAR_COLOUR
  const ids = event.school_ids?.length
    ? event.school_ids
    : event.school_id
      ? [event.school_id]
      : []
  if (ids.length === 1) return schoolColour(ids[0])
  if (ids.length > 1) return schoolColour(ids[0])
  return ADMIN_CALENDAR_COLOUR
}

export function deriveVisibility(input: {
  show_on_admin: boolean
  all_schools: boolean
  school_ids: string[]
}): EventVisibility {
  if (input.all_schools) return 'network'
  if (input.school_ids.length > 0) return 'school'
  return 'internal'
}

export function eventAppearsOnAdmin(event: CalendarEvent): boolean {
  return event.show_on_admin !== false
}

export function eventAppearsOnSchool(event: CalendarEvent, schoolId: string | null | undefined): boolean {
  if (!schoolId) {
    return (
      event.all_schools ||
      event.visibility === 'network' ||
      (event.school_ids?.length ?? 0) > 0 ||
      Boolean(event.school_id)
    )
  }
  if (event.all_schools || event.visibility === 'network') return true
  if (event.school_ids?.includes(schoolId)) return true
  if (event.school_id === schoolId) return true
  return false
}

export function filterEventsForView(
  events: CalendarEvent[],
  opts: { mode: 'team' | 'school'; schoolId?: string | null; calendarFilter?: string }
): CalendarEvent[] {
  const { mode, schoolId, calendarFilter = 'all' } = opts

  let list = events
  if (mode === 'school') {
    list = events.filter(e => eventAppearsOnSchool(e, schoolId))
  } else if (calendarFilter === 'admin') {
    list = events.filter(eventAppearsOnAdmin)
  } else if (calendarFilter.startsWith('school:')) {
    const id = calendarFilter.slice('school:'.length)
    list = events.filter(e => eventAppearsOnSchool(e, id))
  }

  return list
}

export function calendarsLabel(event: CalendarEvent, schoolNames: Record<string, string>): string {
  const parts: string[] = []
  if (eventAppearsOnAdmin(event)) parts.push('Admin')
  if (event.all_schools || event.visibility === 'network') {
    parts.push('All schools')
  } else {
    const ids = event.school_ids?.length
      ? event.school_ids
      : event.school_id
        ? [event.school_id]
        : []
    for (const id of ids) {
      parts.push(schoolNames[id] || id)
    }
  }
  return parts.length ? parts.join(' · ') : 'Unassigned'
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = dtf.formatToParts(date)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0'
  let hour = Number(get('hour'))
  if (hour === 24) hour = 0
  const asUtc = Date.UTC(
    Number(get('year')),
    Number(get('month')) - 1,
    Number(get('day')),
    hour,
    Number(get('minute')),
    Number(get('second'))
  )
  return asUtc - date.getTime()
}

/** Interpret a datetime-local wall time in `timeZone` and return a UTC Date. */
export function wallTimeToUtc(localValue: string, timeZone: string): Date {
  const [datePart, timePart = '00:00'] = localValue.split('T')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [h, mi] = timePart.split(':').map(Number)
  const utcGuess = new Date(Date.UTC(y, mo - 1, d, h, mi, 0))
  const offset1 = getTimeZoneOffsetMs(utcGuess, timeZone)
  const adjusted = new Date(utcGuess.getTime() - offset1)
  const offset2 = getTimeZoneOffsetMs(adjusted, timeZone)
  return new Date(utcGuess.getTime() - offset2)
}

export function formatInTimeZone(
  iso: string,
  timeZone: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(iso)
  return date.toLocaleString(undefined, {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    ...opts,
  })
}

export function timezoneShortLabel(timeZone: string, at = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(at)
    return parts.find(p => p.type === 'timeZoneName')?.value || timeZone
  } catch {
    return timeZone
  }
}

export function suggestTimezone(schoolIds: string[], allSchools: boolean): string {
  if (allSchools) return 'Europe/London'
  if (schoolIds.length === 1 && SCHOOL_DEFAULT_TIMEZONE[schoolIds[0]]) {
    return SCHOOL_DEFAULT_TIMEZONE[schoolIds[0]]
  }
  return 'Europe/London'
}

export function normalizeEvent(
  raw: Partial<CalendarEvent> & {
    id: string
    title: string
    starts_at: string
    ends_at: string
  }
): CalendarEvent {
  const school_ids = raw.school_ids ?? (raw.school_id ? [raw.school_id] : [])
  const all_schools = raw.all_schools ?? raw.visibility === 'network'
  const show_on_admin = raw.show_on_admin ?? true
  const visibility =
    raw.visibility ?? deriveVisibility({ show_on_admin, all_schools, school_ids })
  const attendees = (raw.attendees ?? []).map(a => a.trim()).filter(Boolean)
  const timezone =
    raw.timezone ||
    suggestTimezone(schoolIdsOrFallback(school_ids, raw.school_id), Boolean(all_schools))

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    starts_at: raw.starts_at,
    ends_at: raw.ends_at,
    visibility,
    school_id: raw.school_id ?? school_ids[0] ?? null,
    school_ids,
    show_on_admin,
    all_schools,
    location: raw.location ?? null,
    created_by: raw.created_by ?? null,
    timezone,
    attendees,
  }
}

function schoolIdsOrFallback(school_ids: string[], school_id: string | null | undefined) {
  if (school_ids.length) return school_ids
  return school_id ? [school_id] : []
}
