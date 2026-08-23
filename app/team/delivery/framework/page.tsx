import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import TeamDeliveryFramework from '@/components/portal/TeamDeliveryFramework'
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

export default async function TeamDeliveryFrameworkPage() {
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

  return (
    <PortalShell {...teamShellProps(profile, '/team/delivery')}>
      <TeamDeliveryFramework
        schools={schools}
        initialPromises={promises}
        demoMode={demoMode}
      />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
