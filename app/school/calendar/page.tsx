import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import SharedCalendar from '@/components/portal/SharedCalendar'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { demoEvents } from '@/lib/content/demo-portal'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { eventAppearsOnSchool, normalizeEvent } from '@/lib/calendar'
import { CalendarEvent } from '@/lib/types'

export default async function SchoolCalendarPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  const schools = [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    city: s.city,
  }))

  let dbEvents: CalendarEvent[] | null = null
  if (supabase && !preview) {
    const { data } = await supabase.from('calendar_events').select('*').order('starts_at')
    if (data?.length) dbEvents = (data as CalendarEvent[]).map(row => normalizeEvent(row))
  }

  return (
    <SchoolPortalShell profile={profile} activeSection="/school/calendar">
      {ctx => {
        const base = dbEvents ?? demoEvents().map(normalizeEvent)
        const events = base.filter(e => eventAppearsOnSchool(e, ctx.schoolId))
        return (
          <>
            <SharedCalendar
              events={events}
              mode="school"
              schools={schools}
              schoolId={ctx.schoolId}
            />
            <PortalChatbot audience="school" />
          </>
        )
      }}
    </SchoolPortalShell>
  )
}
