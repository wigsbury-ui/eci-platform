import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { agentNavForProfile, AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME } from '@/components/portal/agentNav'
import { requireAgentPortalAccess } from '@/lib/supabase/session'
import { PARTNER_WHY } from '@/lib/content/partner-portal'

export default async function AgentWhyPartnerPage() {
  const { profile } = await requireAgentPortalAccess('/agent/why-partner')

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent/why-partner"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          {PARTNER_WHY.eyebrow}
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">{PARTNER_WHY.title}</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">{PARTNER_WHY.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {PARTNER_WHY.points.map(p => (
          <article key={p.title} className="bg-white border border-gray-100 p-6">
            <div className="w-10 h-1 bg-[#0E7490] mb-4" />
            <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2">{p.title}</h2>
            <p className="text-sm text-gray-600 font-jost leading-relaxed">{p.body}</p>
          </article>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#F0FDFA] border border-[#0E7490]/15 p-6">
          <p className="text-xs font-jost font-bold uppercase tracking-wider text-[#0E7490] mb-2">
            For agents
          </p>
          <p className="text-sm text-gray-700 font-jost leading-relaxed">{PARTNER_WHY.agentAngle}</p>
        </div>
        <div className="bg-[#F8F4EF] border border-[#2D1654]/10 p-6">
          <p className="text-xs font-jost font-bold uppercase tracking-wider text-[#C8A84B] mb-2">
            For rainmakers
          </p>
          <p className="text-sm text-gray-700 font-jost leading-relaxed">{PARTNER_WHY.rainmakerAngle}</p>
        </div>
      </div>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
