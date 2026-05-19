import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortalShell from '@/components/portal/PortalShell'
import AdminDashboard from '@/components/portal/AdminDashboard'
import { LayoutDashboard, Globe, Users, FileText, Inbox, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
  { label: 'Network Schools', href: '/admin/schools', icon: <Globe size={16} /> },
  { label: 'Users & Access', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Document Admin', href: '/admin/documents', icon: <FileText size={16} /> },
  { label: 'Investor Enquiries', href: '/admin/enquiries', icon: <Inbox size={16} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={16} /> },
]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'board_member') redirect('/school')

  const { data: schools } = await supabase.from('schools').select('*').order('status')
  const { data: enquiries } = await supabase.from('investor_enquiries').select('*').order('created_at', { ascending: false }).limit(10)
  const { data: announcements } = await supabase.from('announcements').select('*').order('published_at', { ascending: false })
  const { data: documents } = await supabase.from('documents').select('count').single()

  return (
    <PortalShell
      profile={profile}
      portalName="Admin & Governance"
      portalAccent="#E05C5C"
      navItems={NAV_ITEMS}
      activeSection="/admin"
    >
      <AdminDashboard
        schools={schools || []}
        enquiries={enquiries || []}
        announcements={announcements || []}
        documentsCount={(documents as any)?.count || 0}
      />
    </PortalShell>
  )
}
