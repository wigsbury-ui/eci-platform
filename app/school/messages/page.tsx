import PortalShell from '@/components/portal/PortalShell'
import MessagingPanel from '@/components/portal/MessagingPanel'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_MESSAGES } from '@/lib/content/demo-portal'
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

export default async function SchoolMessagesPage() {
  const { profile } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  return (
    <PortalShell
      profile={profile}
      portalName="School Partner Portal"
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection="/school/messages"
    >
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Messages</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          WhatsApp-style messaging with the ECI team. Email notifications can be enabled once SMTP is connected.
        </p>
      </div>
      <MessagingPanel messages={DEMO_MESSAGES} currentUserId={profile?.id || 'school'} />
      <PortalChatbot audience="school" />
    </PortalShell>
  )
}
