import {
  BookOpen,
  FileText,
  Home,
  MapPinned,
  MessageSquare,
} from 'lucide-react'

/** Lean investor portal: brand licensing focus, not a product catalogue. */
export const INVESTOR_NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Priority Markets', href: '/investor/markets', icon: <MapPinned size={16} /> },
  { label: 'Resources', href: '/investor/resources', icon: <BookOpen size={16} /> },
  { label: 'Due Diligence', href: '/investor/due-diligence', icon: <FileText size={16} /> },
  { label: 'Express Interest', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]
