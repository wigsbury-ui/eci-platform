import PortalShell from '@/components/portal/PortalShell'
import InvestorDashboard from '@/components/portal/InvestorDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { School } from '@/lib/types'
import { INVESTOR_NAV_ITEMS, INVESTOR_PORTAL_ACCENT, INVESTOR_PORTAL_NAME } from '@/components/portal/investorNav'
import { resolvePartnerSchools, seedPartnerSchools } from '@/lib/schools/partner-schools'

export default async function InvestorPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  let schools = seedPartnerSchools()
  if (supabase && !preview) {
    const { data } = await supabase.from('schools').select('*').eq('is_public', true)
    if (data?.length) schools = resolvePartnerSchools(data as School[])
  }

  return (
    <PortalShell
      profile={profile}
      portalName={INVESTOR_PORTAL_NAME}
      portalAccent={INVESTOR_PORTAL_ACCENT}
      navItems={INVESTOR_NAV_ITEMS}
      activeSection="/investor"
    >
      <InvestorDashboard schools={schools} profile={profile} />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
