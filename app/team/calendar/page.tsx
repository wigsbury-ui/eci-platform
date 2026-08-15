import PortalShell from '@/components/portal/PortalShell'
import SharedCalendar from '@/components/portal/SharedCalendar'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { demoEvents } from '@/lib/content/demo-portal'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { normalizeEvent } from '@/lib/calendar'
import { CalendarEvent } from '@/lib/types'
import {
  LayoutDashboard, Globe, Users, FileText, Inbox, Settings, Calendar, MessageSquare,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/team', icon: <LayoutDashboard size={16} /> },
  { label: 'Schools', href: '/team/schools', icon: <Globe size={16} /> },
  { label: 'Users', href: '/team/users', icon: <Users size={16} /> },
  { label: 'Documents', href: '/team/documents', icon: <FileText size={16} /> },
  { label: 'Calendar', href: '/team/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/team/messages', icon: <MessageSquare size={16} /> },
  { label: 'Enquiries', href: '/team/enquiries', icon: <Inbox size={16} /> },
  { label: 'Settings', href: '/team/settings', icon: <Settings size={16} /> },
]

function networkSchoolOptions(): { id: string; name: string; city?: string }[] {
  return [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    city: s.city,
  }))
}

export default async function TeamCalendarPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let schools = networkSchoolOptions()
  let events: CalendarEvent[] = demoEvents().map(normalizeEvent)

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('id, name, city').order('name')
    if (s?.length) {
      schools = (s as { id: string; name: string; city: string | null }[]).map(row => ({
        id: row.id,
        name: row.name,
        city: row.city ?? undefined,
      }))
    }
    const { data } = await supabase.from('calendar_events').select('*').order('starts_at')
    if (data?.length) {
      events = (data as CalendarEvent[]).map(row => normalizeEvent(row))
    }
  }

  return (
    <PortalShell
      profile={profile}
      portalName="ECI Team"
      portalAccent="#C8A84B"
      navItems={NAV_ITEMS}
      activeSection="/team/calendar"
    >
      <SharedCalendar events={events} mode="team" schools={schools} canCreate />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
