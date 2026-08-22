import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { AGENT_NAV_ITEMS, AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import { requirePortalAccess } from '@/lib/supabase/session'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
import { DEMO_INVESTOR_MARKETING } from '@/lib/content/demo-portal'
import Link from 'next/link'

export default async function AgentToolkitPage() {
  const { profile } = await requirePortalAccess(
    ['agent', 'admin', 'board_member', 'super_admin'],
    'agent'
  )

  return (
    <PortalShell
      profile={profile}
      portalName="Agent Portal"
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={AGENT_NAV_ITEMS}
      activeSection="/agent/toolkit"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          Conversation kit
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">Toolkit</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">
          Ranked markets and approved materials for introducing ECI. Do not circulate due-diligence
          packs without authorisation, those remain inside the Investor Portal after NDA where
          required.
        </p>
      </div>

      <section id="markets" className="mb-12">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-5">Priority markets</h2>
        <div className="space-y-3">
          {TOP_DESTINATIONS.map(d => (
            <article key={d.id} className="bg-white border border-gray-100 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-jost text-xs tracking-widest text-[#0E7490] mb-1">#{d.rank}</p>
                  <h3 className="font-cormorant text-2xl text-[#2D1654]">{d.name}</h3>
                  <p className="text-xs text-gray-400 font-jost mt-1">
                    {d.country} · {d.opportunity} opportunity
                  </p>
                </div>
                <p className="font-jost text-sm text-[#0E7490] font-semibold">{d.compositeScore}</p>
              </div>
              <p className="font-jost text-sm text-gray-600 leading-relaxed mb-3">{d.investorThesis}</p>
              <p className="font-jost text-xs text-gray-500 italic">{d.partnerFit}</p>
            </article>
          ))}
        </div>
        <p className="text-sm font-jost text-gray-500 mt-6">
          Need deeper scorecards? Invite the investor into the{' '}
          <Link href="/login?audience=investor" className="text-[#0E7490] font-semibold hover:underline">
            Investor Portal
          </Link>{' '}
          once ECI has approved access.
        </p>
      </section>

      <section id="resources">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2">Marketing resources</h2>
        <p className="text-gray-500 font-jost text-sm mb-6 max-w-2xl">
          Approved overview materials for sharing with prospective investors and operators.
        </p>
        <DualDocumentArchive
          networkDocs={DEMO_INVESTOR_MARKETING}
          schoolDocs={[]}
          schoolLabel="Agent-only files"
          canUpload={false}
        />
      </section>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
