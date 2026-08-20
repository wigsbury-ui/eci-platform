import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { agentNavForProfile, AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME } from '@/components/portal/agentNav'
import { requireAgentPortalAccess } from '@/lib/supabase/session'
import { DEMO_AGENT_MARKETING } from '@/lib/content/partner-portal'

export default async function AgentResourcesPage() {
  const { profile } = await requireAgentPortalAccess('/agent/resources')

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent/resources"
    >
      <h1 className="font-cormorant text-4xl text-[#2D1654] mb-2">Marketing resources</h1>
      <p className="text-gray-500 font-jost text-sm mb-8 max-w-2xl">
        Approved materials for your own outreach as an introduction partner. Share only what is listed
        here. Investor decks sit under Investor materials.
      </p>
      <DualDocumentArchive
        networkDocs={DEMO_AGENT_MARKETING}
        schoolDocs={[]}
        schoolLabel="Additional files"
        canUpload={false}
      />
      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
