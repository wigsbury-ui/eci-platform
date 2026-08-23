import { Suspense } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamDeliveryHub from '@/components/portal/TeamDeliveryHub'
import { requirePortalAccess } from '@/lib/supabase/session'
import { teamShellProps } from '@/components/portal/teamNav'
import type { School } from '@/lib/types'
import { listServicePromises } from '@/lib/delivery/db'
import { demoPromises } from '@/lib/delivery/demo'
import { listDeliveryNotifications } from '@/lib/delivery/notifications'
import {
  isExcludedPartnerSchool,
  resolvePartnerSchools,
  seedPartnerSchools,
} from '@/lib/schools/partner-schools'

type SearchParams = Promise<{ school?: string; view?: string; add?: string }>

export default async function TeamDeliveryPage({
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
  let notifications: Awaited<ReturnType<typeof listDeliveryNotifications>> = []
  let demoMode = true

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('name')
    schools = resolvePartnerSchools(s as School[] | null)

    const dbPromises = await listServicePromises()
    notifications = await listDeliveryNotifications({ audience: 'staff', limit: 20 })
    const schoolIds = new Set(schools.map(s => s.id))
    const activePromises = dbPromises.filter(p => schoolIds.has(p.school_id))

    if (activePromises.length > 0) {
      promises = activePromises
      demoMode = false
    } else {
      promises = demoPromises(schools)
      demoMode = true
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
      <Suspense fallback={<p className="font-jost text-sm text-gray-500">Loading delivery…</p>}>
        <TeamDeliveryHub
          schools={schools}
          initialPromises={promises}
          initialNotifications={notifications}
          demoMode={demoMode}
          initialSchoolId={initialSchoolId}
          initialShowPicker={params.add === '1'}
        />
      </Suspense>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
