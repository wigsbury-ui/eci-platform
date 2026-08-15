import PortalShell from '@/components/portal/PortalShell'
import SharedCalendar from '@/components/portal/SharedCalendar'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { demoEvents } from '@/lib/content/demo-portal'
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

export default async function TeamCalendarPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  return (
    <PortalShell profile={profile} portalName="ECI Team" portalAccent="#E05C5C" navItems={NAV_ITEMS} activeSection="/team/calendar">
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Team & network calendar</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Internal, network-wide, and school-scoped events shared with partner schools where appropriate.
        </p>
      </div>
      <SharedCalendar events={demoEvents()} mode="team" />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
