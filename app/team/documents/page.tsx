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
import { teamShellProps } from '@/components/portal/teamNav'

export default async function TeamDocumentsPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  return (
    <PortalShell {...teamShellProps(profile, '/team/documents')}>
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
