import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'

export default async function SchoolAnnouncementsPage() {
  const { profile } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  const items = [
    {
      title: 'Doha campus approaching launch',
      body: 'Network communications will include Doha onboarding resources over the coming term.',
      pinned: true,
    },
    {
      title: 'Shared calendar now live',
      body: 'Please use the Calendar section for visit windows and training dates shared with the ECI team.',
      pinned: false,
    },
  ]

  return (
    <SchoolPortalShell profile={profile} activeSection="/school/announcements">
      <>
        <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-8">Announcements</h1>
        <div className="space-y-4">
          {items.map(item => (
            <article
              key={item.title}
              className={`bg-white border border-gray-100 p-6 border-l-4 ${item.pinned ? 'border-l-eci-gold' : 'border-l-eci-purple'}`}
            >
              <h2 className="font-jost font-semibold text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-600 font-jost mt-2 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
        <PortalChatbot audience="school" />
      </>
    </SchoolPortalShell>
  )
}
