import { Suspense } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamDeliveryReview from '@/components/portal/TeamDeliveryReview'
import { requirePortalAccess } from '@/lib/supabase/session'
import { teamShellProps } from '@/components/portal/teamNav'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import type { School } from '@/lib/types'
import { listServicePromises } from '@/lib/delivery/db'
import { demoPromises } from '@/lib/delivery/demo'

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

  let schools = seedSchools()
  let promises = demoPromises(schools)
  let demoMode = true

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('name')
    if (s?.length) schools = s as School[]

    const dbPromises = await listServicePromises()
    if (dbPromises.length > 0) {
      promises = dbPromises
      demoMode = false
    } else {
      promises = demoPromises(schools)
    }
  }

  const initialSchoolId =
    params.school && schools.some(s => s.id === params.school)
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
