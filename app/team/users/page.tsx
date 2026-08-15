import { requirePortalAccess } from '@/lib/supabase/session'
import TeamUsersManager from '@/components/portal/TeamUsersManager'

export default async function TeamUsersPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )
  return <TeamUsersManager profile={profile} />
}
