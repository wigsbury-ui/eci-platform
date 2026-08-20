import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import PartnerServicesSection from '@/components/PartnerServicesSection'
import ExpansionSection from '@/components/ExpansionSection'
import {
  INVESTOR_VALUE_PROPS,
  OPENING_SOON,
  OPERATING_SCHOOLS,
  PARTNERSHIP_MODELS,
} from '@/lib/content/network'

export const metadata: Metadata = {
  title: 'Investors',
  description:
    'Partner with Ellesmere College International — aligned capital and operators for British-heritage schools across the Middle East.',
}

const MODEL_POINTS: Record<string, string[]> = {
  full: [
    'Full Ellesmere branding and identity',
    'Curriculum frameworks and quality assurance',
    'Leadership mentoring and network support',
  ],
  curriculum: [
    'Ellesmere curriculum and assessment licence',
    'Retain your existing school brand',
    'Standards aligned to British heritage pathways',
  ],
  advisory: [
    'Inspection readiness and quality advisory',
    'Professional development for leaders',
    'No full brand integration required',
  ],
}

export default function InvestorsPage() {
  return (
    <main className="home-snap">
      <PublicNav solid />

      <section className="home-window relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <Image
          src="/images/schools/doha-horizon.jpg"
          alt="International campus expansion"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/95 via-[#2D1654]/78 to-[#2D1654]/35" />
        <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-20 w-full pt-28">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
            Investors
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
          >
            Build the next Ellesmere campus
            <br />
            <em className="text-[#C8A84B] font-normal">with us.</em>
          </h1>
          <p className="text-white/75 font-jost max-w-xl mb-10 leading-relaxed">
            Aligned capital and operating partners for British-heritage schools — partnering into a
            model already operating in Riyadh, with Doha opening soon.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Start a conversation
            </a>
            <Link
              href="/login?audience=investor"
              className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Investor portal
            </Link>
          </div>
        </div>
      </section>

      <section
        id="investors"
        className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#F8F4EF] py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center mb-10">
            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                Investment partners
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
              >
                Partner into an operating network
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="text-[#2D1654]/80 font-jost leading-relaxed mb-4 max-w-xl">
                ECI seeks aligned capital and operating partners for British-heritage schools —
                not a paper franchise.
              </p>
              <p className="text-[#2D1654]/65 font-jost leading-relaxed mb-8 max-w-xl">
                Invited partners receive market scorecards, financial packs and model documentation
                inside the password-controlled Investor Portal.
              </p>
              <Link
                href="/login?audience=investor"
                className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
              >
                Open Investor Portal
              </Link>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[420px] overflow-hidden">
              <Image
                src="/images/schools/riyadh-community.webp"
                alt="Ellesmere College Riyadh community"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#2D1654] via-[#2D1654]/70 to-transparent p-6 md:p-8">
                <p className="text-[#C8A84B] text-xs tracking-widest uppercase font-jost mb-1">
                  Operating proof
                </p>
                <p className="text-white font-cormorant text-2xl md:text-3xl">
                  Riyadh · Salwa Compound · Doha soon
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {INVESTOR_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-white p-6 md:p-7 border-l-4 border-[#C8A84B] h-full">
                <h3 className="font-cormorant text-xl md:text-2xl text-[#2D1654] font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-[#2D1654]/70 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => (
              <div key={s.id} className="bg-white/80 border border-[#2D1654]/8 px-5 py-4">
                <p className="font-cormorant text-xl text-[#2D1654] font-semibold">{s.name}</p>
                <p className="font-jost text-sm text-[#2D1654]/55 mt-1">
                  {s.city}, {s.country}
                  <span className="text-[#C8A84B]">
                    {' '}
                    · {s.status === 'active' ? 'Operating' : 'Opening soon'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExpansionSection asModule sectionId="top-destinations" ctaHref="/investors#contact" />

      <section className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#2D1654] py-16 md:py-20">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(200,168,75,0.18), transparent 45%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl mb-12">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Partnership structures
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Choose the right engagement model
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <p className="text-white/70 font-jost leading-relaxed max-w-xl">
              From full brand affiliation to curriculum licensing or advisory support — each model
              is designed for a different level of integration while protecting Ellesmere quality.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {PARTNERSHIP_MODELS.map(model => (
              <div
                key={model.id}
                className="flex flex-col border border-white/15 bg-white/[0.03] p-8 md:p-10 min-h-[22rem]"
              >
                <div className="w-12 h-1 bg-[#C8A84B] mb-6" />
                <h3 className="font-cormorant text-3xl text-white font-semibold mb-4">
                  {model.title}
                </h3>
                <p className="text-white/75 text-sm font-jost leading-relaxed mb-6 flex-1">
                  {model.summary}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {(MODEL_POINTS[model.id] ?? []).map(point => (
                    <li key={point} className="font-jost text-sm text-white/70 flex gap-2.5">
                      <span className="text-[#C8A84B] shrink-0">◆</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="text-[#C8A84B] text-sm font-jost italic border-t border-white/10 pt-4">
                  Ideal for: {model.ideal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerServicesSection variant="investors" />

      <ContactSection
        title="Start a partnership conversation"
        subtitle="Tell us about your capital profile, markets of interest and timing. Our team typically responds within three working days."
        defaultInterest="Investment Opportunity"
        className="home-window min-h-[100svh] flex flex-col justify-center !py-20"
      />

      <Footer />
    </main>
  )
}
