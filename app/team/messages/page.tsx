import PortalShell from '@/components/portal/PortalShell'
import MessagingPanel from '@/components/portal/MessagingPanel'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_MESSAGES } from '@/lib/content/demo-portal'
import { teamShellProps } from '@/components/portal/teamNav'

export default async function TeamMessagesPage() {
  const { profile } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  return (
    <PortalShell {...teamShellProps(profile, '/team/messages')}>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Messaging</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Coordinate with partner schools. Wire email notifications via your SMTP or Resend credentials when ready.
        </p>
      </div>
      <MessagingPanel messages={DEMO_MESSAGES} currentUserId="eci" />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
