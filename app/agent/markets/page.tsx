import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { AGENT_NAV_ITEMS, AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import { requirePortalAccess } from '@/lib/supabase/session'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
import Link from 'next/link'

export default async function AgentMarketsPage() {
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
      activeSection="/agent/markets"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          Growth map
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">Priority markets</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">
          Share these ranked destinations when discussing where capital can partner with ECI.
          Allocated operating campuses such as Riyadh are excluded from open growth bids.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {TOP_DESTINATIONS.map(d => (
          <article key={d.id} className="bg-white border border-gray-100 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-jost text-xs tracking-widest text-[#0E7490] mb-1">#{d.rank}</p>
                <h2 className="font-cormorant text-2xl text-[#2D1654]">{d.name}</h2>
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

      <p className="text-sm font-jost text-gray-500">
        Need deeper scorecards? Invite the investor into the{' '}
        <Link href="/login?audience=investor" className="text-[#0E7490] font-semibold hover:underline">
          Investor Portal
        </Link>{' '}
        once ECI has approved access.
      </p>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
