import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { AGENT_NAV_ITEMS, AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import { requirePortalAccess } from '@/lib/supabase/session'
import { AGENT_IDEAL_INTROS, AGENT_PROGRAM } from '@/lib/content/agents'
import { INVESTOR_VALUE_PROPS, PARTNERSHIP_MODELS } from '@/lib/content/network'
import { FRAMEWORK_INTRO, SERVICE_GROUPS } from '@/lib/content/partner-services'

export default async function AgentBriefingPage() {
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
      activeSection="/agent/briefing"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          Talking points
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">Opportunity briefing</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">
          Use this briefing when introducing ECI to investors and operators. Keep the story clear:
          heritage quality, operating proof, ranked growth markets, and a structured partner product.
        </p>
      </div>

      <div className="bg-[#0E7490] text-white p-7 mb-8">
        <p className="font-jost text-[11px] tracking-[0.25em] uppercase text-white/70 mb-2">
          One-line pitch
        </p>
        <p className="font-cormorant text-3xl leading-snug">{AGENT_PROGRAM.punchline}</p>
        <p className="font-jost text-sm text-white/80 mt-4 max-w-2xl">{AGENT_PROGRAM.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {INVESTOR_VALUE_PROPS.map(item => (
          <article key={item.title} className="bg-white border border-gray-100 p-6">
            <div className="w-10 h-1 bg-[#0E7490] mb-4" />
            <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2">{item.title}</h2>
            <p className="text-sm text-gray-600 font-jost leading-relaxed">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-4">Partnership models to mention</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {PARTNERSHIP_MODELS.map(model => (
            <div key={model.id} className="border border-gray-100 p-5">
              <h3 className="font-cormorant text-xl text-[#2D1654] mb-2">{model.title}</h3>
              <p className="text-xs text-gray-600 font-jost leading-relaxed mb-3">{model.summary}</p>
              <p className="text-xs text-[#0E7490] font-jost">{model.ideal}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2">{FRAMEWORK_INTRO.title}</h2>
        <p className="text-sm text-gray-500 font-jost mb-5">{FRAMEWORK_INTRO.summary}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {SERVICE_GROUPS.map(g => (
            <div key={g.id} className="border-l-4 pl-4" style={{ borderColor: g.colour }}>
              <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">
                {g.label}
              </p>
              <p className="font-cormorant text-xl text-[#2D1654]">{g.title}</p>
              <p className="text-xs text-gray-500 font-jost mt-1">{g.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-7">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-4">Ideal introductions</h2>
        <ul className="space-y-2">
          {AGENT_IDEAL_INTROS.map(item => (
            <li key={item} className="font-jost text-sm text-gray-600 flex gap-2">
              <span className="text-[#0E7490]">◆</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
