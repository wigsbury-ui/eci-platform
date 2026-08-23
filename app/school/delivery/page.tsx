import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import SchoolDeliveryView from '@/components/portal/SchoolDeliveryView'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { resolveSchoolPortalContext } from '@/lib/auth/school-view'

export default async function SchoolDeliveryPage() {
  const { profile, preview } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  const ctx = await resolveSchoolPortalContext(profile)

  return (
    <SchoolPortalShell profile={profile} activeSection="/school/delivery">
      <SchoolDeliveryView
        schoolId={ctx.schoolId}
        schoolName={ctx.schoolName}
        demoMode={preview}
      />
      <PortalChatbot audience="school" />
    </SchoolPortalShell>
  )
}
