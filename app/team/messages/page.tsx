import PortalShell from '@/components/portal/PortalShell'
import MessagingPanel from '@/components/portal/MessagingPanel'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_MESSAGES } from '@/lib/content/demo-portal'
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

export default async function TeamMessagesPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  return (
    <PortalShell profile={profile} portalName="ECI Team" portalAccent="#C8A84B" navItems={NAV_ITEMS} activeSection="/team/messages">
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Messaging</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Coordinate with partner schools. Wire email notifications via your SMTP or Resend credentials when ready.
        </p>
      </div>
      <MessagingPanel messages={DEMO_MESSAGES} currentUserId="eci" />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
