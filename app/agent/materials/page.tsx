import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { agentNavForProfile, AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME } from '@/components/portal/agentNav'
import { requireAgentPortalAccess } from '@/lib/supabase/session'
import { DEMO_AGENT_INVESTOR_PROMO } from '@/lib/content/partner-portal'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'

export default async function AgentMaterialsPage() {
  const { profile } = await requireAgentPortalAccess('/agent/materials')

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent/materials"
    >
      <h1 className="font-cormorant text-4xl text-[#2D1654] mb-2">Investor promotional materials</h1>
      <p className="text-gray-500 font-jost text-sm mb-8 max-w-2xl">
        Packs you may share with prospective investors after an introduction is underway. Do not
        circulate due-diligence documents, those stay in the Investor Portal after ECI approval.
      </p>

      <DualDocumentArchive
        networkDocs={DEMO_AGENT_INVESTOR_PROMO}
        schoolDocs={[]}
        schoolLabel="Additional files"
        canUpload={false}
      />

      <div className="mt-10 bg-white border border-gray-100 p-7">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2">Open destinations at a glance</h2>
        <p className="text-sm text-gray-500 font-jost mb-5 max-w-2xl">
          Ranked markets for conversation only. Deeper scorecards live with ECI and invited investors.
        </p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {TOP_DESTINATIONS.map(d => (
            <li key={d.id} className="border border-gray-50 px-4 py-3">
              <p className="font-jost text-sm text-[#2D1654] font-semibold">
                <span className="text-[#0E7490] mr-2">#{d.rank}</span>
                {d.shortName}
              </p>
              <p className="text-xs text-gray-400 font-jost mt-0.5">{d.country}</p>
            </li>
          ))}
        </ul>
      </div>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
