import { Suspense } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamDeliveryHub from '@/components/portal/TeamDeliveryHub'
import { requirePortalAccess } from '@/lib/supabase/session'
import { teamShellProps } from '@/components/portal/teamNav'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import type { School } from '@/lib/types'
import { listServicePromises } from '@/lib/delivery/db'
import { demoPromises } from '@/lib/delivery/demo'
import { listDeliveryNotifications } from '@/lib/delivery/notifications'

function seedSchools(): School[] {
  return [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    country: s.country,
    city: s.city,
    status: s.status,
    logo_url: null,
    website: s.website || null,
    contact_name: null,
    contact_email: null,
    student_count: null,
    year_joined: s.year_joined || null,
    curriculum: s.curriculum,
    accreditations: null,
    description: s.description,
    short_bio: s.short_bio,
    is_public: true,
  }))
}

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

  let schools = seedSchools()
  let promises = demoPromises(schools)
  let notifications: Awaited<ReturnType<typeof listDeliveryNotifications>> = []
  let demoMode = true

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('name')
    if (s?.length) schools = s as School[]

    const dbPromises = await listServicePromises()
    notifications = await listDeliveryNotifications({ audience: 'staff', limit: 20 })
    if (dbPromises.length > 0) {
      promises = dbPromises
      demoMode = false
    } else {
      promises = demoPromises(schools)
      demoMode = true
    }
  }

  const initialSchoolId =
    params.school && schools.some(s => s.id === params.school)
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
