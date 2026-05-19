import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortalShell from '@/components/portal/PortalShell'
import SchoolDashboard from '@/components/portal/SchoolDashboard'
import { Home, FolderOpen, CheckSquare, Bell, HelpCircle } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/school', icon: <Home size={16} /> },
  { label: 'Document Library', href: '/school/documents', icon: <FolderOpen size={16} /> },
  { label: 'Setup Checklist', href: '/school/setup', icon: <CheckSquare size={16} /> },
  { label: 'Announcements', href: '/school/announcements', icon: <Bell size={16} /> },
  { label: 'Support', href: '/school/support', icon: <HelpCircle size={16} /> },
]

export default async function SchoolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: categories } = await supabase.from('document_categories').select('*').order('sort_order')
  const { data: announcements } = await supabase
    .from('announcements').select('*')
    .contains('audience', ['school_partner'])
    .order('is_pinned', { ascending: false })
    .limit(5)

  return (
    <PortalShell
      profile={profile}
      portalName="School Partner Portal"
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection="/school"
    >
      <SchoolDashboard profile={profile} categories={categories || []} announcements={announcements || []} />
    </PortalShell>
  )
}
