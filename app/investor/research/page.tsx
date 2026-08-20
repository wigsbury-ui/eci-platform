import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import MoroccoResearchGate from '@/components/portal/MoroccoResearchGate'
import { requirePortalAccess } from '@/lib/supabase/session'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'

export default async function InvestorResearchPage() {
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
      activeSection="/investor/research"
    >
      <MoroccoResearchGate />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
