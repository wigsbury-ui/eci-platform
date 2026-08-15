import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import SchoolDashboard from '@/components/portal/SchoolDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_CATEGORIES } from '@/lib/content/demo-portal'

export default async function SchoolPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  let categories = DEMO_CATEGORIES
  let announcements: { id: string; title: string; body: string; audience: null; is_pinned: boolean; published_at: string }[] = [
    {
      id: 'a1',
      title: 'Doha campus approaching launch',
      body: 'Please note network communications will include Doha onboarding resources over the coming term.',
      audience: null,
      is_pinned: true,
      published_at: new Date().toISOString(),
    },
  ]

  if (supabase && !preview) {
    const { data: cats } = await supabase.from('document_categories').select('*').order('sort_order')
    if (cats?.length) categories = cats
    const { data: anns } = await supabase
      .from('announcements')
      .select('*')
      .contains('audience', ['school_partner'])
      .order('is_pinned', { ascending: false })
      .limit(5)
    if (anns?.length) announcements = anns
  }

  return (
    <SchoolPortalShell profile={profile} activeSection="/school">
      {ctx => (
        <>
          <SchoolDashboard
            profile={profile}
            categories={categories}
            announcements={announcements}
            schoolName={ctx.schoolName}
          />
          <PortalChatbot audience="school" />
        </>
      )}
    </SchoolPortalShell>
  )
}
