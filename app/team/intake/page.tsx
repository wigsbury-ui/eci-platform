import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamIntakeReview from '@/components/portal/TeamIntakeReview'
import { requirePortalAccess } from '@/lib/supabase/session'
import { teamShellProps } from '@/components/portal/teamNav'
import { createAdminClient } from '@/lib/supabase/admin'
import { getIntakeUploadToken } from '@/lib/intake/config'
import type { DocumentDraft, DocumentIntakeBatch } from '@/lib/types'

function intakeShareUrl() {
  const token = getIntakeUploadToken()
  if (!token) return null
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://eci-platform-seven.vercel.app'
  return `${base}/intake/${token}`
}

export default async function TeamIntakePage() {
  const { profile, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let batches: DocumentIntakeBatch[] = []
  let drafts: DocumentDraft[] = []

  if (!preview) {
    const admin = createAdminClient()
    if (admin) {
      const { data: batchRows } = await admin
        .from('document_intake_batches')
        .select('*, document_intake_files(*)')
        .order('created_at', { ascending: false })
        .limit(200)

      batches = (batchRows as DocumentIntakeBatch[]) ?? []

      const { data: draftRows } = await admin
        .from('document_drafts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      drafts = (draftRows as DocumentDraft[]) ?? []
    }
  }

  return (
    <PortalShell {...teamShellProps(profile, '/team/intake')}>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Document intake</h1>
        <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl leading-relaxed">
          Collect source material from colleagues inside ECI, then shape articulated partner documentation
          from what they submit. This is the working inbox, not the published school partner library.
        </p>
      </div>

      <TeamIntakeReview
        batches={batches}
        drafts={drafts}
        intakeShareUrl={intakeShareUrl()}
      />

      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
