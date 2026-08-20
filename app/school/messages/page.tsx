import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import MessagingPanel from '@/components/portal/MessagingPanel'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_MESSAGES } from '@/lib/content/demo-portal'
import { HERITAGE } from '@/lib/content/network'

export default async function SchoolMessagesPage() {
  const { profile } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  return (
    <SchoolPortalShell profile={profile} activeSection="/school/messages">
      <>
        <div className="mb-8">
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">Messages</h1>
          <p className="text-gray-400 text-sm font-jost mt-1">
            Direct messaging with the ECI team. For formal office contact: {HERITAGE.email} · {HERITAGE.phone}
          </p>
        </div>
        <MessagingPanel messages={DEMO_MESSAGES} currentUserId={profile?.id || 'school'} />
        <PortalChatbot audience="school" />
      </>
    </SchoolPortalShell>
  )
}
