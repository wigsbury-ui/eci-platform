import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import DualDocumentArchive from '@/components/portal/DualDocumentArchive'
import { AGENT_NAV_ITEMS, AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_INVESTOR_MARKETING } from '@/lib/content/demo-portal'

export default async function AgentResourcesPage() {
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
      activeSection="/agent/resources"
    >
      <h1 className="font-cormorant text-4xl text-[#2D1654] mb-2">Marketing resources</h1>
      <p className="text-gray-500 font-jost text-sm mb-8 max-w-2xl">
        Approved overview materials for sharing with prospective investors and operators. Do not
        circulate due-diligence packs without ECI authorisation — those remain inside the Investor
        Portal after NDA where required.
      </p>
      <DualDocumentArchive
        networkDocs={DEMO_INVESTOR_MARKETING}
        schoolDocs={[]}
        schoolLabel="Agent-only files"
        canUpload={false}
      />
      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
