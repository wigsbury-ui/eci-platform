import {
  BookOpen,
  FileText,
  Home,
  MapPinned,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export const AGENT_NAV_ITEMS = [
  { label: 'Overview', href: '/agent', icon: <Home size={16} /> },
  { label: 'Opportunity briefing', href: '/agent/briefing', icon: <Sparkles size={16} /> },
  { label: 'Priority markets', href: '/agent/markets', icon: <MapPinned size={16} /> },
  { label: 'Marketing resources', href: '/agent/resources', icon: <BookOpen size={16} /> },
  { label: 'Referrals', href: '/agent/referrals', icon: <MessageSquare size={16} /> },
  { label: 'Engagement notes', href: '/agent/engagement', icon: <FileText size={16} /> },
]

export const AGENT_PORTAL_ACCENT = '#0E7490'
