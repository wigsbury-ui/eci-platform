import {
  BookOpen,
  Home,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export const AGENT_PORTAL_ACCENT = '#0E7490'

export const AGENT_NAV_ITEMS = [
  { label: 'Overview', href: '/agent', icon: <Home size={16} /> },
  { label: 'Briefing', href: '/agent/briefing', icon: <Sparkles size={16} /> },
  { label: 'Toolkit', href: '/agent/toolkit', icon: <BookOpen size={16} /> },
  { label: 'Referrals', href: '/agent/referrals', icon: <MessageSquare size={16} /> },
]
