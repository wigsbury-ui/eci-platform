import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import ContactSection from '@/components/ContactSection'
import { requirePortalAccess } from '@/lib/supabase/session'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'

export default async function InvestorApplyPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={INVESTOR_NAV_ITEMS} activeSection="/investor/apply">
      <ContactSection
        title="Express further interest"
        subtitle="Share markets, capital profile, and timing. Our team will follow up with next steps."
        defaultInterest="Investment Opportunity"
      />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
