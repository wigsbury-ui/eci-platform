import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { PARTNERSHIP_MODELS } from '@/lib/content/network'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'

export default async function InvestorModelsPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={INVESTOR_NAV_ITEMS} activeSection="/investor/models">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Partnership models</h1>
      <p className="text-gray-400 text-sm font-jost mb-10 max-w-2xl">
        Substantive overview of how capital and operators engage with ECI. Commercial schedules are released in due diligence packs after NDA where required.
      </p>
      <div className="space-y-6">
        {PARTNERSHIP_MODELS.map(model => (
          <article key={model.id} className="bg-white border border-gray-100 p-8">
            <div className="w-10 h-px bg-eci-gold mb-5" />
            <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-3">{model.title}</h2>
            <p className="text-gray-600 font-jost leading-relaxed mb-4">{model.summary}</p>
            <p className="text-sm text-eci-gold font-jost italic">{model.ideal}</p>
          </article>
        ))}
      </div>
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
