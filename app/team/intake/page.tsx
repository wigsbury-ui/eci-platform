import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamIntakeReview from '@/components/portal/TeamIntakeReview'
import { requirePortalAccess } from '@/lib/supabase/session'
import { teamShellProps } from '@/components/portal/teamNav'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  buildIntakeShareUrl,
  ensureDefaultIntakeLink,
  listIntakeLinks,
} from '@/lib/intake/links'
import { resolveSiteBaseUrl } from '@/lib/intake/shareUrl'
import type { DocumentDraft, DocumentIntakeBatch, DocumentIntakeLink } from '@/lib/types'

export default async function TeamIntakePage() {
  const { profile, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let batches: DocumentIntakeBatch[] = []
  let drafts: DocumentDraft[] = []
  let links: DocumentIntakeLink[] = []
  let intakeShareUrl: string | null = null
  let setupError: string | null = null

  const siteBase = await resolveSiteBaseUrl()

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

      const defaultLink = await ensureDefaultIntakeLink(profile?.id ?? null)
      links = await listIntakeLinks()

      if (defaultLink) {
        intakeShareUrl = buildIntakeShareUrl(siteBase, defaultLink.token)
      } else {
        setupError =
          'Could not create an upload link automatically. Run migration 009_document_intake_links.sql in the Supabase SQL editor, then refresh this page.'
      }
    } else {
      setupError =
        'SUPABASE_SERVICE_ROLE_KEY is required for document intake. Add it in Vercel if uploads should work.'
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
        intakeShareUrl={intakeShareUrl}
        siteBase={siteBase}
        links={links}
        setupError={setupError}
      />

      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
