import AgentReferralsClient from '@/components/portal/AgentReferralsClient'
import { requirePortalAccess } from '@/lib/supabase/session'

export default async function AgentReferralsPage() {
  const { profile } = await requirePortalAccess(
    ['agent', 'admin', 'board_member', 'super_admin'],
    'agent'
  )

  return <AgentReferralsClient profile={profile} />
}
