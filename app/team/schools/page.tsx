import { requirePortalAccess } from '@/lib/supabase/session'
import TeamSchoolsManager from '@/components/portal/TeamSchoolsManager'

export default async function TeamSchoolsPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )
  return <TeamSchoolsManager profile={profile} />
}
