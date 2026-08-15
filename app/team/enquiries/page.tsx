import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
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

export default async function TeamEnquiriesPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let enquiries: { id: string; full_name: string; organisation: string | null; email: string; investment_type: string | null; status: string; created_at: string; country: string | null; message: string | null }[] = []
  if (supabase && !preview) {
    const { data } = await supabase.from('investor_enquiries').select('*').order('created_at', { ascending: false })
    if (data) enquiries = data
  }

  return (
    <PortalShell profile={profile} portalName="ECI Team" portalAccent="#E05C5C" navItems={NAV_ITEMS} activeSection="/team/enquiries">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Investor enquiries</h1>
      <p className="text-gray-400 text-sm font-jost mb-8">Submissions from the public site and investors page.</p>

      {enquiries.length === 0 ? (
        <div className="bg-white border border-gray-100 p-10 text-center text-gray-400 font-jost text-sm">
          No enquiries in the database yet. New submissions from /investors and the homepage contact form will appear here once Supabase is connected.
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map(e => (
            <div key={e.id} className="bg-white border border-gray-100 p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-jost font-semibold text-gray-800">{e.full_name}</p>
                  <p className="text-xs text-gray-400 font-jost">{e.organisation} · {e.email}</p>
                </div>
                <span className="text-xs font-jost text-eci-purple">{e.investment_type || 'General'}</span>
              </div>
              {e.message && <p className="text-sm text-gray-600 font-jost mt-3">{e.message}</p>}
            </div>
          ))}
        </div>
      )}
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
