import PortalShell from '@/components/portal/PortalShell'
import AdminDashboard from '@/components/portal/AdminDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { School } from '@/lib/types'
import { teamShellProps } from '@/components/portal/teamNav'
import { resolvePartnerSchools, seedPartnerSchools } from '@/lib/schools/partner-schools'

export default async function TeamPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let schools = seedPartnerSchools()
  let enquiries: Parameters<typeof AdminDashboard>[0]['enquiries'] = []
  let announcements: Parameters<typeof AdminDashboard>[0]['announcements'] = []
  const documentsCount = 12

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('status')
    if (s?.length) schools = resolvePartnerSchools(s as School[])
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
