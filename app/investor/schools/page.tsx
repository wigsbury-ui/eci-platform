import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { OPENING_SOON, OPERATING_SCHOOLS } from '@/lib/content/network'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
import { INVESTOR_NAV_ITEMS } from '@/components/portal/investorNav'
import Image from 'next/image'
import Link from 'next/link'

export default async function InvestorSchoolsPage() {
  const { profile } = await requirePortalAccess(
    ['investor', 'admin', 'board_member', 'super_admin'],
    'investor'
  )

  return (
    <PortalShell profile={profile} portalName="Investor Portal" portalAccent="#C8A84B" navItems={INVESTOR_NAV_ITEMS} activeSection="/investor/schools">
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
      <div className="flex items-end justify-between gap-4 mb-4">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark">Top 10 priority destinations</h2>
        <Link href="/investor/markets" className="text-sm font-jost text-eci-purple hover:underline">
          Open full market brief →
        </Link>
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {TOP_DESTINATIONS.map(m => (
          <li key={m.id} className="bg-white border border-gray-100 p-5">
            <p className="text-xs text-eci-gold font-jost tracking-widest mb-1">#{m.rank}</p>
            <p className="font-cormorant text-xl text-eci-purple-dark">{m.shortName}</p>
            <p className="text-xs text-gray-400 font-jost mt-0.5">{m.country}</p>
            <p className="text-sm text-gray-500 font-jost mt-2">{m.publicSummary}</p>
          </li>
        ))}
      </ul>
      <PortalChatbot audience="investor" />
    </PortalShell>
  )
}
