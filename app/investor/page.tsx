import PortalShell from '@/components/portal/PortalShell'
import InvestorDashboard from '@/components/portal/InvestorDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { School } from '@/lib/types'
import { TrendingUp, FileText, Users, MessageSquare, Home, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Partnership Models', href: '/investor/models', icon: <TrendingUp size={16} /> },
  { label: 'Marketing Resources', href: '/investor/resources', icon: <BookOpen size={16} /> },
  { label: 'Due Diligence', href: '/investor/due-diligence', icon: <FileText size={16} /> },
  { label: 'Network Schools', href: '/investor/schools', icon: <Users size={16} /> },
  { label: 'Express Interest', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]

function toSchools(): School[] {
  return [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    country: s.country,
    city: s.city,
    status: s.status,
    logo_url: null,
    website: s.website || null,
    contact_name: null,
    contact_email: null,
    student_count: null,
    year_joined: s.year_joined || null,
    curriculum: s.curriculum,
    accreditations: null,
    description: s.description,
    short_bio: s.short_bio,
    is_public: true,
  }))
}

export default async function InvestorPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  let schools = toSchools()
  if (supabase && !preview) {
    const { data } = await supabase.from('schools').select('*').eq('is_public', true)
    if (data?.length) schools = data
  }

  return (
    <PortalShell
      profile={profile}
      portalName="Investor Portal"
      portalAccent="#C8A84B"
      navItems={NAV_ITEMS}
      activeSection="/investor"
    >
      <InvestorDashboard schools={schools} profile={profile} />
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
