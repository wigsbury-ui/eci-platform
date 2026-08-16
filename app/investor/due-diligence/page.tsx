import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_INVESTOR_DD } from '@/lib/content/demo-portal'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'

export default async function InvestorDDPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={INVESTOR_NAV_ITEMS} activeSection="/investor/due-diligence">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Due diligence</h1>
      <p className="text-gray-400 text-sm font-jost mb-8">
        Substantive materials for serious partnership discussions. Ask the chatbot for high-level orientation, then download packs here.
      </p>
      <DualDocumentArchive
        networkDocs={DEMO_INVESTOR_DD}
        schoolDocs={[]}
        schoolLabel="Reserved"
        canUpload={false}
      />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
