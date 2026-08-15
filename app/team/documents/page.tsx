import PortalShell from '@/components/portal/PortalShell'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import DocumentUploadForm from '@/components/portal/DocumentUploadForm'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import {
  DEMO_CATEGORIES,
  DEMO_INVESTOR_DD,
  DEMO_INVESTOR_MARKETING,
  DEMO_NETWORK_DOCS,
  DEMO_SCHOOL_DOCS,
} from '@/lib/content/demo-portal'
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

export default async function TeamDocumentsPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  return (
    <PortalShell profile={profile} portalName="ECI Team" portalAccent="#E05C5C" navItems={NAV_ITEMS} activeSection="/team/documents">
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Document administration</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Publish to the network archive, manage school folders, and release investor marketing or due-diligence packs.
        </p>
      </div>
      <div className="mb-10">
        <DocumentUploadForm canUpload />
      </div>
      <DualDocumentArchive
        networkDocs={[...DEMO_NETWORK_DOCS, ...DEMO_INVESTOR_MARKETING, ...DEMO_INVESTOR_DD]}
        schoolDocs={DEMO_SCHOOL_DOCS}
        categories={DEMO_CATEGORIES}
        schoolLabel="School-specific archives"
        canUpload
      />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
