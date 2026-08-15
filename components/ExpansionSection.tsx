import { EXPANSION_MARKETS } from '@/lib/content/network'
import Link from 'next/link'

export default function ExpansionSection() {
  return (
    <section id="expansion" className="py-28 bg-[#1A1228] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          <div>
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
              Where we are going
            </p>
            <h2
              className="font-cormorant font-light leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Expansion markets for investment partners
            </h2>
            <p className="text-white/65 font-jost leading-relaxed max-w-xl mb-8">
              With Riyadh open and Doha approaching launch, ECI is actively seeking aligned
              investment and operating partners for the next wave of campuses across the region
              and North Africa.
            </p>
            <Link
              href="/investors"
              className="inline-block bg-[#C8A84B] text-[#2D1654] px-7 py-3.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Explore investment partnership
            </Link>
          </div>

          <ul className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {EXPANSION_MARKETS.map((market, i) => (
              <li
                key={market.id}
                className="py-5 flex gap-5 items-start group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="font-cormorant text-[#C8A84B] text-2xl w-8 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-cormorant text-2xl text-white group-hover:text-[#C8A84B] transition-colors">
                    {market.name}
                  </h3>
                  <p className="text-white/55 text-sm font-jost mt-1 leading-relaxed">{market.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
