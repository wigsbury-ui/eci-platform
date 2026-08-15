import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import {
  DEMO_CATEGORIES,
  DEMO_NETWORK_DOCS,
  DEMO_SCHOOL_DOCS,
} from '@/lib/content/demo-portal'

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
    <SchoolPortalShell profile={profile} activeSection="/school/documents">
      {ctx => (
        <>
          <DualDocumentArchive
            networkDocs={networkDocs}
            schoolDocs={schoolDocs}
            categories={categories}
            schoolLabel={`${ctx.schoolName} archive`}
            canUpload={
              profile?.role === 'school_partner' ||
              profile?.role === 'super_admin' ||
              profile?.role === 'admin'
            }
          />
          <PortalChatbot audience="school" />
        </>
      )}
    </SchoolPortalShell>
  )
}
