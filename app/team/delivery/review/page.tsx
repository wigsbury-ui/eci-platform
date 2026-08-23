import { Suspense } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamDeliveryReview from '@/components/portal/TeamDeliveryReview'
import { requirePortalAccess } from '@/lib/supabase/session'
import { teamShellProps } from '@/components/portal/teamNav'
import type { School } from '@/lib/types'
import { listServicePromises } from '@/lib/delivery/db'
import { demoPromises } from '@/lib/delivery/demo'
import {
  isExcludedPartnerSchool,
  resolvePartnerSchools,
  seedPartnerSchools,
} from '@/lib/schools/partner-schools'

type SearchParams = Promise<{ school?: string }>

export default async function TeamDeliveryReviewPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let schools = seedPartnerSchools()
  let promises = demoPromises(schools)
  let demoMode = true

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('name')
    schools = resolvePartnerSchools(s as School[] | null)

    const dbPromises = await listServicePromises()
    const activePromises = dbPromises.filter(
      p => schools.some(sch => sch.id === p.school_id)
    )
    if (activePromises.length > 0) {
      promises = activePromises
      demoMode = false
    } else {
      promises = demoPromises(schools)
    }
  }

  const initialSchoolId =
    params.school &&
    schools.some(s => s.id === params.school) &&
    !isExcludedPartnerSchool(schools.find(s => s.id === params.school)!)
      ? params.school
      : schools[0]?.id

  return (
    <PortalShell {...teamShellProps(profile, '/team/delivery')}>
      <Suspense fallback={<p className="font-jost text-sm text-gray-500">Loading review…</p>}>
        <TeamDeliveryReview
          schools={schools}
          initialPromises={promises}
          demoMode={demoMode}
          initialSchoolId={initialSchoolId}
        />
      </Suspense>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
