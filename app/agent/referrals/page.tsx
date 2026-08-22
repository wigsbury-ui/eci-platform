import AgentReferralsClient from '@/components/portal/AgentReferralsClient'
import { requireAgentPortalAccess } from '@/lib/supabase/session'

export default async function AgentReferralsPage() {
  const { profile } = await requireAgentPortalAccess('/agent/referrals')
  return <AgentReferralsClient profile={profile} />
}
