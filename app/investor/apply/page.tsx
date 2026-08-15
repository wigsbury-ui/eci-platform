import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import ContactSection from '@/components/ContactSection'
import { requirePortalAccess } from '@/lib/supabase/session'
import { TrendingUp, FileText, Users, MessageSquare, Home, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Partnership Models', href: '/investor/models', icon: <TrendingUp size={16} /> },
  { label: 'Marketing Resources', href: '/investor/resources', icon: <BookOpen size={16} /> },
  { label: 'Due Diligence', href: '/investor/due-diligence', icon: <FileText size={16} /> },
  { label: 'Network Schools', href: '/investor/schools', icon: <Users size={16} /> },
  { label: 'Express Interest', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]

export default async function InvestorApplyPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={NAV_ITEMS} activeSection="/investor/apply">
      <ContactSection
        title="Express further interest"
        subtitle="Share markets, capital profile, and timing. Our team will follow up with next steps."
        defaultInterest="Investment Opportunity"
      />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
