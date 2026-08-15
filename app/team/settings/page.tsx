import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import {
  LayoutDashboard, Globe, Users, FileText, Inbox, Settings, Calendar, MessageSquare,
} from 'lucide-react'
import { HERITAGE } from '@/lib/content/network'

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

export default async function TeamSettingsPage() {
  const { profile } = await requirePortalAccess(
    ['super_admin', 'admin'],
    'super_admin'
  )

  return (
    <PortalShell profile={profile} portalName="Super Admin" portalAccent="#E05C5C" navItems={NAV_ITEMS} activeSection="/team/settings">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Organisation settings</h1>
      <p className="text-gray-400 text-sm font-jost mb-10">Global ECI configuration controlled by super admins.</p>

      <div className="grid gap-6 max-w-2xl">
        {[
          { label: 'Organisation email', value: HERITAGE.email },
          { label: 'UK office', value: HERITAGE.address },
          { label: 'Charity number', value: HERITAGE.charityNumber },
          { label: 'Chatbot', value: 'First-party RAG enabled · set LLM_BASE_URL for self-hosted inference' },
          { label: 'Email notifications', value: 'Configure SMTP / Resend env vars to activate message alerts' },
          { label: 'Storage buckets', value: 'school-docs · investor-packs · team-docs' },
        ].map(row => (
          <div key={row.label} className="bg-white border border-gray-100 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-jost mb-1">{row.label}</p>
            <p className="font-jost text-sm text-gray-800">{row.value}</p>
          </div>
        ))}
      </div>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
