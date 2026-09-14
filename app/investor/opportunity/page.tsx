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
      <div className="mb-12 max-w-3xl">
        <h1 className="font-cormorant text-[2.35rem] md:text-[2.75rem] leading-tight text-[#2D1654] mb-4">
          Opportunity
        </h1>
        <p className="font-jost text-base md:text-lg text-[#2D1654]/75 leading-relaxed">
          How capital and operators engage with ECI, and the services framework behind every campus.
          Commercial schedules sit in diligence packs after NDA where required.
        </p>
      </div>

      <section id="models" className="mb-16 max-w-3xl">
        <h2 className="font-jost text-xs tracking-[0.22em] uppercase text-[#2D1654]/45 font-semibold mb-6">
          Partnership models
        </h2>
        <div className="space-y-10">
          {PARTNERSHIP_MODELS.map(model => (
            <article key={model.id} className="border-t border-[#2D1654]/12 pt-6">
              <h3 className="font-cormorant text-3xl text-[#2D1654] mb-3">{model.title}</h3>
              <p className="font-jost text-base text-[#2D1654]/75 leading-relaxed mb-3">
                {model.summary}
              </p>
              <p className="font-jost text-sm text-[#2D1654]/55">
                Best fit: {model.ideal}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="max-w-5xl">
        <PartnerServicesDetail embedded />
      </section>
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
