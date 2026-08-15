import { CalendarEvent, EventVisibility } from '@/lib/types'

export type CalendarTargetOption = {
  id: string
  label: string
  kind: 'admin' | 'school'
}

/** Derive legacy visibility for RLS / older consumers. */
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
    // School portal without a bound school: show network + any school-scoped demos
    return event.all_schools || event.visibility === 'network' || (event.school_ids?.length ?? 0) > 0 || Boolean(event.school_id)
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

export function normalizeEvent(raw: Partial<CalendarEvent> & {
  id: string
  title: string
  starts_at: string
  ends_at: string
}): CalendarEvent {
  const school_ids = raw.school_ids ?? (raw.school_id ? [raw.school_id] : [])
  const all_schools = raw.all_schools ?? raw.visibility === 'network'
  const show_on_admin = raw.show_on_admin ?? true
  const visibility =
    raw.visibility ??
    deriveVisibility({ show_on_admin, all_schools, school_ids })

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
  }
}
