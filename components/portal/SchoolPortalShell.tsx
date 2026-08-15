import PortalShell from '@/components/portal/PortalShell'
import StaffSchoolBanner from '@/components/portal/StaffSchoolBanner'
import { resolveSchoolPortalContext } from '@/lib/auth/school-view'
import { Profile } from '@/lib/types'
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

export type SchoolPortalCtx = Awaited<ReturnType<typeof resolveSchoolPortalContext>>

export default async function SchoolPortalShell({
  profile,
  activeSection,
  children,
}: {
  profile: Profile | null
  activeSection: string
  children: React.ReactNode | ((ctx: SchoolPortalCtx) => React.ReactNode)
}) {
  const ctx = await resolveSchoolPortalContext(profile)
  const content = typeof children === 'function' ? children(ctx) : children

  return (
    <PortalShell
      profile={profile}
      portalName={ctx.viewingAsStaff ? ctx.schoolName : 'School Partner Portal'}
      portalAccent="#4C9A6B"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      staffReturnHref={ctx.viewingAsStaff ? '/api/view-school?clear=1&next=/team' : null}
    >
      {ctx.viewingAsStaff && (
        <StaffSchoolBanner
          schoolId={ctx.schoolId}
          schoolName={ctx.schoolName}
          schoolOptions={ctx.schoolOptions}
        />
      )}
      {content}
    </PortalShell>
  )
}
