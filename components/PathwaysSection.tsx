import Link from 'next/link'

const PATHWAYS = [
  {
    label: 'Investors',
    href: '/growth#investors',
    line: 'Aligned capital and operating partners for new Ellesmere campuses.',
  },
  {
    label: 'Agents',
    href: '/growth#agents',
    line: 'Trusted introducers who connect serious counterparties with ECI.',
  },
  {
    label: 'Rainmakers',
    href: '/growth#rainmakers',
    line: 'Alumni and high-trust referrers who open doors, not a sales channel.',
  },
]

export default function PathwaysSection() {
  return (
    <section id="pathways" className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            How to work with us
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Investors, agents, rainmakers
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mt-4 mb-4" />
          <p className="text-[#2D1654]/70 font-jost leading-relaxed">
            One partnership platform. Three ways in — capital, introductions, or trusted referrals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {PATHWAYS.map(p => (
            <Link
              key={p.href}
              href={p.href}
              className="group border-2 border-[#2D1654]/10 p-8 hover:border-[#C8A84B] transition-colors"
            >
              <div className="w-10 h-1 bg-[#C8A84B] mb-5" />
              <h3 className="font-cormorant text-2xl text-[#2D1654] font-semibold mb-3">{p.label}</h3>
              <p className="font-jost text-sm text-[#2D1654]/70 leading-relaxed mb-5">{p.line}</p>
              <span className="font-jost text-sm font-semibold text-[#2D1654] group-hover:text-[#C8A84B] transition-colors">
                Explore this pathway →
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/growth"
          className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
        >
          Full pathways briefing
        </Link>
      </div>
    </section>
  )
}
