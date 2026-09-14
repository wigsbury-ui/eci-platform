import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { agentNavForProfile, AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME } from '@/components/portal/agentNav'
import { requireAgentPortalAccess } from '@/lib/supabase/session'
import { PARTNER_ABOUT } from '@/lib/content/partner-portal'

export default async function AgentAboutPage() {
  const { profile } = await requireAgentPortalAccess('/agent/about')

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent/about"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          {PARTNER_ABOUT.eyebrow}
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">{PARTNER_ABOUT.title}</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">{PARTNER_ABOUT.summary}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PARTNER_ABOUT.facts.map(f => (
          <div key={f.label} className="bg-white border border-gray-100 p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-jost mb-1">{f.label}</p>
            <p className="font-cormorant text-xl text-[#2D1654]">{f.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#0E7490] font-jost font-bold mb-2">
          Core offer
        </p>
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-3">{PARTNER_ABOUT.coreOffer.title}</h2>
        <p className="text-sm text-gray-600 font-jost leading-relaxed max-w-2xl">
          {PARTNER_ABOUT.coreOffer.body}
        </p>
      </div>

      <div className="bg-white border border-gray-100 p-7">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-5">Campuses</h2>
        <ul className="space-y-3">
          {PARTNER_ABOUT.campuses.map(c => (
            <li key={c.name} className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3">
              <div>
                <p className="font-jost font-semibold text-sm text-[#2D1654]">{c.name}</p>
                <p className="text-xs text-gray-400 font-jost">{c.place}</p>
              </div>
              <span className="text-xs font-jost text-[#0E7490]">{c.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
