import Link from 'next/link'
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

      <div className="mb-10 border border-[#C8A84B]/25 bg-[#FBF8F4] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.25em] text-[#C8A84B] font-semibold mb-2">
            Market research
          </p>
          <h2 className="font-cormorant text-2xl text-[#2D1654] mb-1">Morocco Private K–12 Report</h2>
          <p className="font-jost text-sm text-gray-500">
            Updated March 2026 — free PDF unlock with your details.
          </p>
        </div>
        <Link
          href="/investor/research"
          className="inline-flex items-center justify-center bg-[#4C2585] text-white px-5 py-2.5 font-jost text-sm font-semibold hover:bg-[#2D1654] transition-colors"
        >
          View research
        </Link>
      </div>

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
