import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { HERITAGE } from '@/lib/content/network'
import { Home, FolderOpen, Calendar, MessageSquare, Bell, HelpCircle } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/school', icon: <Home size={16} /> },
  { label: 'Documents', href: '/school/documents', icon: <FolderOpen size={16} /> },
  { label: 'Calendar', href: '/school/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/school/messages', icon: <MessageSquare size={16} /> },
  { label: 'Announcements', href: '/school/announcements', icon: <Bell size={16} /> },
  { label: 'Support', href: '/school/support', icon: <HelpCircle size={16} /> },
]

export default async function SchoolSupportPage() {
  const { profile } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  return (
    <PortalShell profile={profile} portalName="School Partner Portal" portalAccent="#4C9A6B" navItems={NAV_ITEMS} activeSection="/school/support">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Support</h1>
      <p className="text-gray-400 text-sm font-jost mb-8 max-w-xl">
        Prefer the Messages channel for day-to-day coordination. For formal support, contact the ECI office below.
      </p>
      <div className="bg-white border border-gray-100 p-8 max-w-lg space-y-4 text-sm font-jost text-gray-600">
        <p><strong className="text-eci-purple">Email</strong><br />{HERITAGE.email}</p>
        <p><strong className="text-eci-purple">Phone</strong><br />{HERITAGE.phone}</p>
        <p><strong className="text-eci-purple">Office</strong><br />{HERITAGE.address}</p>
      </div>
      <PortalChatbot audience="school" />
    </PortalShell>
  )
}
