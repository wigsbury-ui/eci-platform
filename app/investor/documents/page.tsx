import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_INVESTOR_DD, DEMO_INVESTOR_MARKETING } from '@/lib/content/demo-portal'
import { INVESTOR_NAV_ITEMS, INVESTOR_PORTAL_ACCENT, INVESTOR_PORTAL_NAME } from '@/components/portal/investorNav'

export default async function InvestorDocumentsPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell
      profile={profile}
      portalName={INVESTOR_PORTAL_NAME}
      portalAccent={INVESTOR_PORTAL_ACCENT}
      navItems={INVESTOR_NAV_ITEMS}
      activeSection="/investor/documents"
    >
      <div className="mb-10 max-w-3xl">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Documents</h1>
        <p className="text-gray-400 text-sm font-jost">
          Early marketing materials for conversations, and due-diligence packs for serious
          partnership discussions. Ask the chatbot for orientation, then download here.
        </p>
      </div>

      <section id="marketing" className="mb-12">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-2">Marketing</h2>
        <p className="text-gray-400 text-sm font-jost mb-6">
          Overview decks and one-pagers suitable for early conversations.
        </p>
        <DualDocumentArchive
          networkDocs={DEMO_INVESTOR_MARKETING}
          schoolDocs={[]}
          schoolLabel="Reserved"
          canUpload={false}
        />
      </section>

      <section id="diligence">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-2">Due diligence</h2>
        <p className="text-gray-400 text-sm font-jost mb-6">
          Substantive materials for invited partners. Additional packs may require NDA.
        </p>
        <DualDocumentArchive
          networkDocs={DEMO_INVESTOR_DD}
          schoolDocs={[]}
          schoolLabel="Reserved"
          canUpload={false}
        />
      </section>
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
