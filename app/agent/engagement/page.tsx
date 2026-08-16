import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { AGENT_NAV_ITEMS, AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import { requirePortalAccess } from '@/lib/supabase/session'

export default async function AgentEngagementPage() {
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
      activeSection="/agent/engagement"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          Working with ECI
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">Engagement notes</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">
          High-level expectations for introduction agents. Commercial schedules and success fees are
          agreed in writing with ECI for each engagement — they are not published in this portal.
        </p>
      </div>

      <div className="space-y-5">
        {[
          {
            title: 'What we ask of agents',
            points: [
              'Introduce investors or operators who match ECI’s quality and geography focus',
              'Use only approved marketing materials for external conversations',
              'Disclose existing relationships and conflicts early',
              'Hand the relationship to ECI promptly once interest is confirmed',
            ],
          },
          {
            title: 'What ECI provides',
            points: [
              'Briefing materials, market context and partnership model summaries',
              'A named ECI contact for live introductions',
              'Status updates on referrals submitted through the portal',
              'Written commercial terms for successful, accepted introductions',
            ],
          },
          {
            title: 'Boundaries',
            points: [
              'Agents do not negotiate school fees, licensing terms or NDAs on ECI’s behalf',
              'Due-diligence packs stay in the Investor Portal after ECI grants access',
              'Riyadh and other allocated campuses are not open for new growth introductions',
              'Brand use must follow Ellesmere identity guidance supplied in resources',
            ],
          },
        ].map(block => (
          <article key={block.title} className="bg-white border border-gray-100 p-7">
            <h2 className="font-cormorant text-2xl text-[#2D1654] mb-4">{block.title}</h2>
            <ul className="space-y-2">
              {block.points.map(p => (
                <li key={p} className="font-jost text-sm text-gray-600 flex gap-2">
                  <span className="text-[#0E7490]">·</span>
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
