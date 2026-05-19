import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortalShell from '@/components/portal/PortalShell'
import DocumentLibrary from '@/components/portal/DocumentLibrary'
import { Home, FolderOpen, CheckSquare, Bell, HelpCircle } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/school', icon: <Home size={16} /> },
  { label: 'Document Library', href: '/school/documents', icon: <FolderOpen size={16} /> },
  { label: 'Setup Checklist', href: '/school/setup', icon: <CheckSquare size={16} /> },
  { label: 'Announcements', href: '/school/announcements', icon: <Bell size={16} /> },
  { label: 'Support', href: '/school/support', icon: <HelpCircle size={16} /> },
]

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: categories } = await supabase.from('document_categories').select('*').order('sort_order')
  const { data: documents } = await supabase.from('documents')
    .select('*, document_categories(name, icon)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <PortalShell profile={profile} portalName="School Partner Portal" portalAccent="#4C9A6B" navItems={NAV_ITEMS} activeSection="/school/documents">
      <DocumentLibrary categories={categories || []} documents={documents || []} />
    </PortalShell>
  )
}
