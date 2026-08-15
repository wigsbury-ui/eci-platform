import PortalShell from '@/components/portal/PortalShell'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import {
  DEMO_CATEGORIES,
  DEMO_NETWORK_DOCS,
  DEMO_SCHOOL_DOCS,
} from '@/lib/content/demo-portal'
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

export default async function SchoolDocumentsPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  let networkDocs = DEMO_NETWORK_DOCS
  let schoolDocs = DEMO_SCHOOL_DOCS
  let categories = DEMO_CATEGORIES

  if (supabase && !preview) {
    const { data: docs } = await supabase
      .from('documents')
      .select('*, document_categories(*)')
      .eq('is_published', true)
    if (docs?.length) {
      networkDocs = docs.filter((d: { scope?: string }) => !d.scope || d.scope === 'network')
      schoolDocs = docs.filter((d: { scope?: string; school_id?: string | null }) => d.scope === 'school')
    }
    const { data: cats } = await supabase.from('document_categories').select('*').order('sort_order')
    if (cats?.length) categories = cats
  }

  return (
    <PortalShell
      profile={profile}
      portalName="School Partner Portal"
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection="/school/documents"
    >
      <DualDocumentArchive
        networkDocs={networkDocs}
        schoolDocs={schoolDocs}
        categories={categories}
        schoolLabel="Your school archive"
        canUpload={profile?.role === 'school_partner' || profile?.role === 'super_admin' || profile?.role === 'admin'}
      />
      <PortalChatbot audience="school" />
    </PortalShell>
  )
}
