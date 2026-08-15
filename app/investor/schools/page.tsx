import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { OPENING_SOON, OPERATING_SCHOOLS, EXPANSION_MARKETS } from '@/lib/content/network'
import { TrendingUp, FileText, Users, MessageSquare, Home, BookOpen } from 'lucide-react'
import Image from 'next/image'

const NAV_ITEMS = [
  { label: 'Overview', href: '/investor', icon: <Home size={16} /> },
  { label: 'Partnership Models', href: '/investor/models', icon: <TrendingUp size={16} /> },
  { label: 'Marketing Resources', href: '/investor/resources', icon: <BookOpen size={16} /> },
  { label: 'Due Diligence', href: '/investor/due-diligence', icon: <FileText size={16} /> },
  { label: 'Network Schools', href: '/investor/schools', icon: <Users size={16} /> },
  { label: 'Express Interest', href: '/investor/apply', icon: <MessageSquare size={16} /> },
]

export default async function InvestorSchoolsPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={NAV_ITEMS} activeSection="/investor/schools">
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-8">Network schools</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => (
          <article key={s.id} className="bg-white border border-gray-100 overflow-hidden">
            <div className="relative h-40">
              <Image src={s.image} alt={s.name} fill className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-xs text-eci-gold font-jost uppercase tracking-wide mb-1">{s.city}, {s.country}</p>
              <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-2">{s.name}</h2>
              <p className="text-sm text-gray-600 font-jost leading-relaxed">{s.description}</p>
            </div>
          </article>
        ))}
      </div>
      <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-4">Expansion markets</h2>
      <ul className="grid md:grid-cols-2 gap-3">
        {EXPANSION_MARKETS.map(m => (
          <li key={m.id} className="bg-white border border-gray-100 p-5">
            <p className="font-cormorant text-xl text-eci-purple-dark">{m.name}</p>
            <p className="text-sm text-gray-500 font-jost mt-1">{m.detail}</p>
          </li>
        ))}
      </ul>
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
