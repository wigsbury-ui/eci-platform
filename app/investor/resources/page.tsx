import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_INVESTOR_MARKETING } from '@/lib/content/demo-portal'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'

export default async function InvestorResourcesPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={INVESTOR_NAV_ITEMS} activeSection="/investor/resources">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Marketing resources</h1>
      <p className="text-gray-400 text-sm font-jost mb-8">
        Overview decks and one-pagers suitable for early conversations. Upload live files via the team portal once Storage is connected.
      </p>
      <DualDocumentArchive
        networkDocs={DEMO_INVESTOR_MARKETING}
        schoolDocs={[]}
        schoolLabel="Reserved"
        canUpload={false}
      />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
