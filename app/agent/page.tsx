import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import AgentDashboard from '@/components/portal/AgentDashboard'
import { agentNavForProfile, AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME } from '@/components/portal/agentNav'
import { requireAgentPortalAccess } from '@/lib/supabase/session'

export default async function AgentPortalPage() {
  const { profile, preview } = await requireAgentPortalAccess('/agent')

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent"
    >
      <AgentDashboard profile={profile} preview={preview} />
      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
