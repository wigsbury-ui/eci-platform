import type { ReactNode } from 'react'
import {
  BookOpen,
  FileSignature,
  Home,
  Info,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { Profile } from '@/lib/types'
import { hasAcceptedPartnerAccess } from '@/lib/auth/partnerAccess'

export const AGENT_PORTAL_ACCENT = '#0E7490'
export const AGENT_PORTAL_NAME = 'Agents & rainmakers'

type NavItem = { label: string; href: string; icon: ReactNode }

const APPLICANT_NAV: NavItem[] = [
  { label: 'Overview', href: '/agent', icon: <Home size={16} /> },
  { label: 'About ECI', href: '/agent/about', icon: <Info size={16} /> },
  { label: 'Why partner', href: '/agent/why-partner', icon: <Sparkles size={16} /> },
  { label: 'Sample contracts', href: '/agent/contracts', icon: <FileSignature size={16} /> },
]

const ACCEPTED_NAV: NavItem[] = [
  { label: 'Overview', href: '/agent', icon: <Home size={16} /> },
  { label: 'Briefing', href: '/agent/briefing', icon: <Sparkles size={16} /> },
  { label: 'Toolkit', href: '/agent/toolkit', icon: <BookOpen size={16} /> },
  { label: 'Referrals', href: '/agent/referrals', icon: <MessageSquare size={16} /> },
]

/** Nav filtered by partner acceptance tier. Staff see the accepted toolkit. */
export function agentNavForProfile(profile?: Profile | null): NavItem[] {
  return hasAcceptedPartnerAccess(profile) ? ACCEPTED_NAV : APPLICANT_NAV
}

/** @deprecated Prefer agentNavForProfile(profile) */
export const AGENT_NAV_ITEMS = ACCEPTED_NAV
