import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortalShell from '@/components/portal/PortalShell'
import InvestorDashboard from '@/components/portal/InvestorDashboard'
import { TrendingUp, FileText, Users, MessageSquare, Home } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Partnership Models', href: '/investor/models', icon: <TrendingUp size={16} /> },
  { label: 'Due Diligence', href: '/investor/due-diligence', icon: <FileText size={16} /> },
  { label: 'Network Schools', href: '/investor/schools', icon: <Users size={16} /> },
  { label: 'Express Interest', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]

export default async function InvestorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'investor' && profile?.role !== 'admin' && profile?.role !== 'board_member') {
    redirect('/school')
  }

  const { data: schools } = await supabase.from('schools').select('*').eq('is_public', true)
  const { data: enquiries } = await supabase.from('investor_enquiries').select('count').single()

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalColour="#4C2585" navItems={NAV_ITEMS} activeSection="/investor">
      <InvestorDashboard schools={schools || []} profile={profile} />
    </PortalShell>
  )
}
