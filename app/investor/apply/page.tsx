import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import ContactSection from '@/components/ContactSection'
import { requirePortalAccess } from '@/lib/supabase/session'
import { INVESTOR_NAV_ITEMS, INVESTOR_PORTAL_ACCENT, INVESTOR_PORTAL_NAME } from '@/components/portal/investorNav'

export default async function InvestorApplyPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell
      profile={profile}
      portalName={INVESTOR_PORTAL_NAME}
      portalAccent={INVESTOR_PORTAL_ACCENT}
      navItems={INVESTOR_NAV_ITEMS}
      activeSection="/investor/apply"
    >
      <ContactSection
        title="Request next steps"
        subtitle="Already inside the portal — tell us markets, capital profile and timing, or request diligence access. Our team will follow up."
        defaultInterest="Investment Opportunity"
      />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
