import PortalShell from '@/components/portal/PortalShell'
import SharedCalendar from '@/components/portal/SharedCalendar'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { demoEvents } from '@/lib/content/demo-portal'
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

  let events = demoEvents().filter(e => e.visibility !== 'internal')
  if (supabase && !preview) {
    const { data } = await supabase.from('calendar_events').select('*').order('starts_at')
    if (data?.length) events = data.filter((e: { visibility: string }) => e.visibility !== 'internal')
  }

  return (
    <PortalShell
      profile={profile}
      portalName="School Partner Portal"
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection="/school/calendar"
    >
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Shared calendar</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Network and school events shared with the ECI team — visits, training, and key deadlines.
        </p>
      </div>
      <SharedCalendar events={events} mode="school" />
      <PortalChatbot audience="school" />
    </PortalShell>
  )
}
