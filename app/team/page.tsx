import PortalShell from '@/components/portal/PortalShell'
import AdminDashboard from '@/components/portal/AdminDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { School } from '@/lib/types'
import { teamShellProps } from '@/components/portal/teamNav'

function networkAsSchools(): School[] {
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

export default async function TeamPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let schools = networkAsSchools()
  let enquiries: Parameters<typeof AdminDashboard>[0]['enquiries'] = []
  let announcements: Parameters<typeof AdminDashboard>[0]['announcements'] = []
  const documentsCount = 12

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('status')
    if (s?.length) schools = s
    const { data: e } = await supabase.from('investor_enquiries').select('*').order('created_at', { ascending: false }).limit(10)
    if (e) enquiries = e
    const { data: a } = await supabase.from('announcements').select('*').order('published_at', { ascending: false })
    if (a) announcements = a
  }

  return (
    <PortalShell {...teamShellProps(profile, '/team')}>
      <AdminDashboard
        schools={schools}
        enquiries={enquiries}
        announcements={announcements}
        documentsCount={documentsCount}
      />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
