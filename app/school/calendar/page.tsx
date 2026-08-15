import PortalShell from '@/components/portal/PortalShell'
import SharedCalendar from '@/components/portal/SharedCalendar'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { demoEvents } from '@/lib/content/demo-portal'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { eventAppearsOnSchool, normalizeEvent } from '@/lib/calendar'
import { CalendarEvent } from '@/lib/types'
import {
  Home,
  FolderOpen,
  Calendar,
  MessageSquare,
  Bell,
  HelpCircle,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/school', icon: <Home size={16} /> },
  { label: 'Documents', href: '/school/documents', icon: <FolderOpen size={16} /> },
  { label: 'Calendar', href: '/school/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/school/messages', icon: <MessageSquare size={16} /> },
  { label: 'Announcements', href: '/school/announcements', icon: <Bell size={16} /> },
  { label: 'Support', href: '/school/support', icon: <HelpCircle size={16} /> },
]

export default async function SchoolCalendarPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  const schoolId = profile?.school_id ?? 'riyadh'
  const schools = [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    city: s.city,
  }))

  let events: CalendarEvent[] = demoEvents()
    .map(normalizeEvent)
    .filter(e => eventAppearsOnSchool(e, schoolId))

  if (supabase && !preview) {
    const { data } = await supabase.from('calendar_events').select('*').order('starts_at')
    if (data?.length) {
      events = (data as CalendarEvent[])
        .map(row => normalizeEvent(row))
        .filter(e => eventAppearsOnSchool(e, schoolId))
    }
  }

  return (
    <PortalShell
      profile={profile}
      portalName="School Partner Portal"
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection="/school/calendar"
    >
      <SharedCalendar
        events={events}
        mode="school"
        schools={schools}
        schoolId={schoolId}
      />
      <PortalChatbot audience="school" />
    </PortalShell>
  )
}
