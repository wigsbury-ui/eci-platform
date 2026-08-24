import Image from 'next/image'
import Link from 'next/link'
import {
  INVESTOR_VALUE_PROPS,
  INVESTMENT_PARTNER_INTRO,
  INVESTMENT_PARTNER_OFFER_POINTS,
  PRIMARY_PARTNERSHIP,
} from '@/lib/content/network'

export default function PartnershipSection() {
  return (
    <section id="partnership" className="relative py-20 md:py-28 overflow-hidden">
      <Image
        src="/images/campus/students-classroom.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#2D1654]/92" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start mb-12 md:mb-14">
          <div>
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Investment partners
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Brand licensing and more…
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <p className="text-white/80 font-jost leading-relaxed mb-4 max-w-xl">
              {PRIMARY_PARTNERSHIP.summary}
            </p>
            <p className="text-white/55 font-jost text-sm leading-relaxed mb-4 max-w-xl italic">
              {PRIMARY_PARTNERSHIP.ideal}
            </p>
            <p className="text-white/70 font-jost text-sm leading-relaxed mb-6 max-w-xl">
              {INVESTMENT_PARTNER_INTRO}
            </p>
            <ul className="space-y-2.5 mb-8 max-w-xl">
              {INVESTMENT_PARTNER_OFFER_POINTS.map(point => (
                <li key={point} className="font-jost text-sm text-white/80 flex gap-2.5">
                  <span className="text-[#C8A84B] shrink-0">◆</span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/investors"
                className="bg-[#C8A84B] text-[#2D1654] px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                For investment partners
              </Link>
              <Link
                href="/#contact"
                className="border border-white/40 text-white px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
              >
                Register your interest
              </Link>
            </div>
            <p className="mt-4 font-jost text-sm text-white/50">
              <Link
                href="/login?audience=investor"
                className="text-[#C8A84B] hover:underline underline-offset-2"
              >
                Gain access to the investor portal
              </Link>
              {' · '}
              <Link href="/investors#offer" className="hover:text-white transition-colors">
                Watch the brand licensing video
              </Link>
            </p>
          </div>

          <div className="border border-[#C8A84B]/35 bg-white/[0.06] p-6 md:p-8">
            <p className="text-[#C8A84B] text-[10px] tracking-[0.25em] uppercase font-jost font-bold mb-4">
              Why partner with ECI
            </p>
            <div className="space-y-5">
              {INVESTOR_VALUE_PROPS.map(item => (
                <div key={item.title} className="border-t border-white/15 pt-4 first:border-t-0 first:pt-0">
                  <h3 className="font-cormorant text-xl text-white font-semibold mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-white/65 text-sm font-jost leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
