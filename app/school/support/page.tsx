import SchoolPortalShell from '@/components/portal/SchoolPortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { HERITAGE } from '@/lib/content/network'

export default async function SchoolSupportPage() {
  const { profile } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  return (
    <SchoolPortalShell profile={profile} activeSection="/school/support">
      <>
        <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Support</h1>
        <p className="text-gray-400 text-sm font-jost mb-8 max-w-xl">
          Prefer the Messages channel for day-to-day coordination. For formal support, contact the ECI office below.
        </p>
        <div className="bg-white border border-gray-100 p-8 max-w-lg space-y-4 text-sm font-jost text-gray-600">
          <p>
            <strong className="text-eci-purple">Email</strong>
            <br />
            {HERITAGE.email}
          </p>
          <p>
            <strong className="text-eci-purple">Phone</strong>
            <br />
            {HERITAGE.phone}
          </p>
          <p>
            <strong className="text-eci-purple">Office</strong>
            <br />
            {HERITAGE.address}
          </p>
        </div>
        <PortalChatbot audience="school" />
      </>
    </SchoolPortalShell>
  )
}
