import PortalShell from '@/components/portal/PortalShell'
import AdminDashboard from '@/components/portal/AdminDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { School } from '@/lib/types'
import {
  LayoutDashboard,
  Globe,
  Users,
  FileText,
  Inbox,
  Settings,
  Calendar,
  MessageSquare,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/team', icon: <LayoutDashboard size={16} /> },
  { label: 'Schools', href: '/team/schools', icon: <Globe size={16} /> },
  { label: 'Users', href: '/team/users', icon: <Users size={16} /> },
  { label: 'Documents', href: '/team/documents', icon: <FileText size={16} /> },
  { label: 'Calendar', href: '/team/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/team/messages', icon: <MessageSquare size={16} /> },
  { label: 'Enquiries', href: '/team/enquiries', icon: <Inbox size={16} /> },
  { label: 'Settings', href: '/team/settings', icon: <Settings size={16} /> },
]

function networkAsSchools(): School[] {
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

export default async function TeamPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['employee', 'admin', 'board_member', 'super_admin'],
    'super_admin'
  )

  let schools = networkAsSchools()
  let enquiries: Parameters<typeof AdminDashboard>[0]['enquiries'] = []
  let announcements: Parameters<typeof AdminDashboard>[0]['announcements'] = []
  let documentsCount = 12

  if (supabase && !preview) {
    const { data: s } = await supabase.from('schools').select('*').order('status')
    if (s?.length) schools = s
    const { data: e } = await supabase.from('investor_enquiries').select('*').order('created_at', { ascending: false }).limit(10)
    if (e) enquiries = e
    const { data: a } = await supabase.from('announcements').select('*').order('published_at', { ascending: false })
    if (a) announcements = a
  }

  return (
    <PortalShell
      profile={profile}
      portalName={profile?.role === 'super_admin' || profile?.role === 'admin' ? 'Super Admin' : 'ECI Team'}
      portalAccent="#E05C5C"
      navItems={NAV_ITEMS}
      activeSection="/team"
    >
      <AdminDashboard
        schools={schools}
        enquiries={enquiries}
        announcements={announcements}
        documentsCount={documentsCount}
      />
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
