import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { AGENT_NAV_ITEMS, AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import { requirePortalAccess } from '@/lib/supabase/session'
import { AGENT_IDEAL_INTROS, AGENT_PROGRAM } from '@/lib/content/agents'
import {
  INVESTOR_VALUE_PROPS,
  PARTNERSHIP_ADDONS,
  PRIMARY_PARTNERSHIP,
} from '@/lib/content/network'

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
          Keep the story simple when introducing ECI: we work with investors to build schools under
          the Ellesmere brand. Heritage quality, operating proof, and brand protection.
        </p>
      </div>

      <div className="bg-[#0E7490] text-white p-7 mb-8">
        <p className="font-jost text-[11px] tracking-[0.25em] uppercase text-white/70 mb-2">
          One-line pitch
        </p>
        <p className="font-cormorant text-3xl leading-snug">
          Partner with ECI to open an Ellesmere school.
        </p>
        <p className="font-jost text-sm text-white/80 mt-4 max-w-2xl">{AGENT_PROGRAM.summary}</p>
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#0E7490] font-jost font-bold mb-2">
          Core offer
        </p>
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-3">{PRIMARY_PARTNERSHIP.title}</h2>
        <p className="text-sm text-gray-600 font-jost leading-relaxed mb-4">
          {PRIMARY_PARTNERSHIP.summary}
        </p>
        <p className="text-xs text-[#0E7490] font-jost italic mb-6">{PRIMARY_PARTNERSHIP.ideal}</p>
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400 font-jost uppercase tracking-wide mb-3">
            Mention only if asked: optional add-ons
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PARTNERSHIP_ADDONS.map(a => (
              <div key={a.id}>
                <p className="font-cormorant text-lg text-[#2D1654]">{a.title}</p>
                <p className="text-xs text-gray-500 font-jost mt-1 leading-relaxed">{a.summary}</p>
              </div>
            ))}
          </div>
        </div>
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
