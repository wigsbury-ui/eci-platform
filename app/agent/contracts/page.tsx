import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { agentNavForProfile, AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME } from '@/components/portal/agentNav'
import { requireAgentPortalAccess } from '@/lib/supabase/session'
import { DEMO_PARTNER_CONTRACTS, PARTNER_CONTRACTS } from '@/lib/content/partner-portal'

export default async function AgentContractsPage() {
  const { profile } = await requireAgentPortalAccess('/agent/contracts')

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent/contracts"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          {PARTNER_CONTRACTS.eyebrow}
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">{PARTNER_CONTRACTS.title}</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">{PARTNER_CONTRACTS.summary}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {[PARTNER_CONTRACTS.agent, PARTNER_CONTRACTS.rainmaker].map(block => (
          <article key={block.title} className="bg-white border border-gray-100 p-7">
            <h2 className="font-cormorant text-2xl text-[#2D1654] mb-3">{block.title}</h2>
            <p className="text-sm text-gray-600 font-jost leading-relaxed mb-5">{block.body}</p>
            <ul className="space-y-2">
              {block.highlights.map(h => (
                <li key={h} className="text-sm text-gray-600 font-jost flex gap-2">
                  <span className="text-[#0E7490] shrink-0">◆</span>
                  {h}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h2 className="font-cormorant text-2xl text-[#2D1654] mb-4">Download samples</h2>
      <DualDocumentArchive
        networkDocs={DEMO_PARTNER_CONTRACTS}
        schoolDocs={[]}
        schoolLabel="Additional files"
        canUpload={false}
      />

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
