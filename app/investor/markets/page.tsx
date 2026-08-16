import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import ExpansionMarketsDetail from '@/components/portal/ExpansionMarketsDetail'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'
import { requirePortalAccess } from '@/lib/supabase/session'

export default async function InvestorMarketsPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell
      profile={profile}
      portalName="Investor Portal"
      portalAccent="#C8A84B"
      navItems={INVESTOR_NAV_ITEMS}
      activeSection="/investor/markets"
    >
      <ExpansionMarketsDetail />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
