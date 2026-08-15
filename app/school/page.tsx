import PortalShell from '@/components/portal/PortalShell'
import SchoolDashboard from '@/components/portal/SchoolDashboard'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { DEMO_CATEGORIES } from '@/lib/content/demo-portal'
import {
  Home,
  FolderOpen,
  Calendar,
  MessageSquare,
  Bell,
  HelpCircle,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/school', icon: <Home size={16} /> },
  { label: 'Documents', href: '/school/documents', icon: <FolderOpen size={16} /> },
  { label: 'Calendar', href: '/school/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/school/messages', icon: <MessageSquare size={16} /> },
  { label: 'Announcements', href: '/school/announcements', icon: <Bell size={16} /> },
  { label: 'Support', href: '/school/support', icon: <HelpCircle size={16} /> },
]

export default async function SchoolPage() {
  const { profile, supabase, preview } = await requirePortalAccess(
    ['school_partner', 'employee', 'admin', 'board_member', 'super_admin'],
    'school_partner'
  )

  let categories = DEMO_CATEGORIES
  let announcements: { id: string; title: string; body: string; audience: null; is_pinned: boolean; published_at: string }[] = [
    {
      id: 'a1',
      title: 'Doha campus approaching launch',
      body: 'Please note network communications will include Doha onboarding resources over the coming term.',
      audience: null,
      is_pinned: true,
      published_at: new Date().toISOString(),
    },
  ]

  if (supabase && !preview) {
    const { data: cats } = await supabase.from('document_categories').select('*').order('sort_order')
    if (cats?.length) categories = cats
    const { data: anns } = await supabase
      .from('announcements')
      .select('*')
      .contains('audience', ['school_partner'])
      .order('is_pinned', { ascending: false })
      .limit(5)
    if (anns?.length) announcements = anns
  }

  return (
    <PortalShell
      profile={profile}
      portalName="School Partner Portal"
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection="/school"
    >
      <SchoolDashboard profile={profile} categories={categories} announcements={announcements} />
      <PortalChatbot audience="school" />
    </PortalShell>
  )
}
