import {
  BookOpen,
  FileText,
  Home,
  Layers,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react'

export const INVESTOR_NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Partnership Models', href: '/investor/models', icon: <TrendingUp size={16} /> },
  { label: 'Partner Services', href: '/investor/services', icon: <Layers size={16} /> },
  { label: 'Marketing Resources', href: '/investor/resources', icon: <BookOpen size={16} /> },
  { label: 'Due Diligence', href: '/investor/due-diligence', icon: <FileText size={16} /> },
  { label: 'Network Schools', href: '/investor/schools', icon: <Users size={16} /> },
  { label: 'Express Interest', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]
