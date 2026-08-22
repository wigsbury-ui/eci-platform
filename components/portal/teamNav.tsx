import {
  LayoutDashboard,
  Globe,
  Users,
  FileText,
  Inbox,
  Settings,
  Calendar,
  MessageSquare,
  FolderInput,
} from 'lucide-react'
import type { Profile } from '@/lib/types'

export const TEAM_PORTAL_ACCENT = '#3D5A80'

export const TEAM_NAV_ITEMS = [
  { label: 'Home', href: '/team', icon: <LayoutDashboard size={16} /> },
  { label: 'Schools', href: '/team/schools', icon: <Globe size={16} /> },
  { label: 'People', href: '/team/users', icon: <Users size={16} /> },
  { label: 'Documents', href: '/team/documents', icon: <FileText size={16} /> },
  { label: 'Doc intake', href: '/team/intake', icon: <FolderInput size={16} /> },
  { label: 'Calendar', href: '/team/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/team/messages', icon: <MessageSquare size={16} /> },
  { label: 'Pipeline', href: '/team/enquiries', icon: <Inbox size={16} /> },
  { label: 'Settings', href: '/team/settings', icon: <Settings size={16} /> },
]

export function teamPortalName(role?: string | null) {
  return role === 'super_admin' || role === 'admin' ? 'Super Admin' : 'ECI Team'
}

export function teamShellProps(profile: Profile | null, activeSection: string) {
  return {
    profile,
    portalName: teamPortalName(profile?.role),
    portalAccent: TEAM_PORTAL_ACCENT,
    navItems: TEAM_NAV_ITEMS,
    activeSection,
  }
}
