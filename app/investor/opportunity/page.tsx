import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import PartnerServicesDetail from '@/components/portal/PartnerServicesDetail'
import { requirePortalAccess } from '@/lib/supabase/session'
import { PARTNERSHIP_MODELS } from '@/lib/content/network'
import { INVESTOR_NAV_ITEMS, INVESTOR_PORTAL_ACCENT, INVESTOR_PORTAL_NAME } from '@/components/portal/investorNav'

export default async function InvestorOpportunityPage() {
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
      activeSection="/investor/opportunity"
    >
      <div className="mb-10 max-w-3xl">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">The opportunity</h1>
        <p className="text-gray-400 text-sm font-jost max-w-2xl">
          How capital and operators engage with ECI, and the three-tier services framework that
          sits behind every campus. Commercial schedules are released in due diligence packs after
          NDA where required.
        </p>
      </div>

      <section id="models" className="mb-12">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Partnership models</h2>
        <div className="space-y-5">
          {PARTNERSHIP_MODELS.map(model => (
            <article key={model.id} className="bg-white border border-gray-100 p-8">
              <div className="w-10 h-px bg-eci-gold mb-5" />
              <h3 className="font-cormorant text-3xl text-eci-purple-dark mb-3">{model.title}</h3>
              <p className="text-gray-600 font-jost leading-relaxed mb-4">{model.summary}</p>
              <p className="text-sm text-eci-gold font-jost italic">{model.ideal}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services">
        <PartnerServicesDetail embedded />
      </section>
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
