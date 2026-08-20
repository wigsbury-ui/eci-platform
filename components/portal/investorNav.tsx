import {
  BookOpen,
  Home,
  Layers,
  MapPinned,
  MessageSquare,
} from 'lucide-react'

export const INVESTOR_PORTAL_NAME = 'Investor Portal'
export const INVESTOR_PORTAL_ACCENT = '#C8A84B'

export const INVESTOR_NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Opportunity', href: '/investor/opportunity', icon: <Layers size={16} /> },
  { label: 'Markets', href: '/investor/markets', icon: <MapPinned size={16} /> },
  { label: 'Documents', href: '/investor/documents', icon: <BookOpen size={16} /> },
  { label: 'Next steps', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]
