import PortalShell from '@/components/portal/PortalShell'
import SharedCalendar from '@/components/portal/SharedCalendar'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { demoEvents } from '@/lib/content/demo-portal'
import { normalizeEvent } from '@/lib/calendar'
import { CalendarEvent } from '@/lib/types'
import { teamShellProps } from '@/components/portal/teamNav'
import {
  filterPartnerSchools,
  seedPartnerSchools,
} from '@/lib/schools/partner-schools'

export default async function TeamCalendarPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let schools = seedPartnerSchools().map(s => ({ id: s.id, name: s.name, city: s.city }))
  let events: CalendarEvent[] = demoEvents().map(normalizeEvent)

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('id, name, city').order('name')
    if (s?.length) {
      schools = filterPartnerSchools(
        (s as { id: string; name: string; city: string | null }[]).map(row => ({
          id: row.id,
          name: row.name,
          city: row.city ?? '',
        }))
      ).map(row => ({
        id: row.id,
        name: row.name,
        city: row.city,
      }))
    }
    const { data } = await supabase.from('calendar_events').select('*').order('starts_at')
    if (data?.length) {
      events = (data as CalendarEvent[]).map(row => normalizeEvent(row))
    }
  }

  return (
    <PortalShell {...teamShellProps(profile, '/team/calendar')}>
      <SharedCalendar events={events} mode="team" schools={schools} canCreate />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
