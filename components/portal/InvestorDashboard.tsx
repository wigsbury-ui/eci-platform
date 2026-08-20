'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Layers, MapPinned, MessageSquare } from 'lucide-react'
import { School, Profile } from '@/lib/types'
import { INVESTOR_PORTAL_ACCENT } from '@/components/portal/investorNav'

const NEXT = [
  {
    href: '/investor/opportunity',
    label: 'Opportunity',
    blurb: 'Partnership models and the three-tier services framework behind every campus.',
    icon: Layers,
  },
  {
    href: '/investor/markets',
    label: 'Markets',
    blurb: 'Ranked growth destinations open for new capital — with thesis and partner fit.',
    icon: MapPinned,
  },
  {
    href: '/investor/documents',
    label: 'Documents',
    blurb: 'Marketing materials and diligence packs released for your access level.',
    icon: BookOpen,
  },
  {
    href: '/investor/apply',
    label: 'Next steps',
    blurb: 'Tell us markets, capital profile and timing — or request deeper access.',
    icon: MessageSquare,
  },
] as const

export default function InvestorDashboard({
  schools,
  profile,
}: {
  schools: School[]
  profile: Profile | null
}) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Investor'
  const operating = schools.filter(s => s.status === 'active')
  const opening = schools.filter(s => s.status === 'setting_up')

  return (
    <div className="max-w-3xl">
      <header className="mb-12">
        <p className="font-jost text-base text-[#2D1654]/70 mb-2">Welcome, {firstName}</p>
        <h1 className="font-cormorant text-[2.35rem] md:text-[2.75rem] leading-tight text-[#2D1654] mb-4">
          Overview
        </h1>
        <p className="font-jost text-base md:text-lg text-[#2D1654]/75 leading-relaxed">
          This portal is your working space for ECI brand licensing. Start with the opportunity,
          then markets and documents. Use Next steps when you are ready to talk.
        </p>
      </header>

      <section className="mb-14" aria-labelledby="investor-path">
        <h2
          id="investor-path"
          className="font-jost text-xs tracking-[0.22em] uppercase text-[#2D1654]/45 font-semibold mb-5"
        >
          Your path
        </h2>
        <ul className="divide-y divide-[#2D1654]/10 border-y border-[#2D1654]/10">
          {NEXT.map(({ href, label, blurb, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-start gap-4 py-5 hover:bg-[#F8F4EF]/80 -mx-3 px-3 transition-colors"
              >
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center"
                  style={{ background: `${INVESTOR_PORTAL_ACCENT}22`, color: '#2D1654' }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-cormorant text-2xl text-[#2D1654] group-hover:text-[#4C2585] transition-colors">
                      {label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-[#C8A84B] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </span>
                  <span className="block font-jost text-[0.95rem] text-[#2D1654]/65 leading-relaxed mt-1">
                    {blurb}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="network-status">
        <h2
          id="network-status"
          className="font-jost text-xs tracking-[0.22em] uppercase text-[#2D1654]/45 font-semibold mb-5"
        >
          Network status
        </h2>
        <p className="font-jost text-[0.95rem] text-[#2D1654]/65 leading-relaxed mb-6">
          {operating.length} operating · {opening.length} opening soon · detailed briefs live under
          Markets.
        </p>
        <ul className="space-y-3">
          {schools.map(school => (
            <li
              key={school.id}
              className="flex items-baseline justify-between gap-4 border-b border-[#2D1654]/8 pb-3"
            >
              <div>
                <p className="font-jost text-base text-[#2D1654] font-medium">{school.name}</p>
                <p className="font-jost text-sm text-[#2D1654]/50 mt-0.5">
                  {school.city}, {school.country}
                </p>
              </div>
              <p className="font-jost text-sm text-[#2D1654]/55 shrink-0 capitalize">
                {school.status === 'active'
                  ? 'Operating'
                  : school.status === 'setting_up'
                    ? 'Opening soon'
                    : school.status.replace('_', ' ')}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
