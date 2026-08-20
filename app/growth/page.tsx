import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import ExpansionSection from '@/components/ExpansionSection'
import GrowthHeroVideo from '@/components/GrowthHeroVideo'
import {
  INVESTOR_VALUE_PROPS,
  OPENING_SOON,
  OPERATING_SCHOOLS,
  PARTNERSHIP_ADDONS,
  PRIMARY_PARTNERSHIP,
} from '@/lib/content/network'
import { AGENT_HOW_IT_WORKS, AGENT_PROGRAM } from '@/lib/content/agents'
import { RAINMAKER_PROGRAM } from '@/lib/content/rainmakers'

export const metadata: Metadata = {
  title: 'Growth',
  description:
    'Partner with Ellesmere College International to build a school under the Ellesmere brand. Agents and rainmakers help introduce aligned investors.',
}

export default function GrowthPage() {
  return (
    <main className="home-snap">
      <PublicNav solid />

      {/* 1 — Hero: brand licensing first */}
      <section className="home-window relative min-h-[100svh] flex flex-col overflow-hidden">
        <Image
          src="/images/schools/doha-horizon.jpg"
          alt="International campus expansion"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/88 via-[#2D1654]/55 to-[#2D1654]/15" />
        <div className="relative max-w-7xl mx-auto px-6 w-full pt-28 pb-16 md:pb-20 flex-1 flex flex-col">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 flex-1 items-stretch">
            <div className="order-2 lg:order-1 flex flex-col justify-end">
              <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
                Growth
              </p>
              <h1
                className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
              >
                Build a school
                <br />
                <em className="text-[#C8A84B] font-normal">under the Ellesmere brand.</em>
              </h1>
              <p className="text-white/75 font-jost max-w-xl mb-10 leading-relaxed">
                Brand licensing is the core of how we grow: investors and operators work with ECI to
                open an Ellesmere campus. Curriculum and advisory support are available as add-ons —
                not parallel products.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href="#investors"
                  className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
                >
                  For investors
                </a>
                <Link
                  href="/login?audience=investor"
                  className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
                >
                  Investor portal
                </Link>
                <a
                  href="#contact"
                  className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
                >
                  Start a conversation
                </a>
              </div>

              <p className="font-jost text-sm text-white/50">
                Know someone who should build with us?{' '}
                <a href="#introductions" className="text-[#C8A84B] hover:underline">
                  Agents &amp; rainmakers
                </a>
              </p>
            </div>

            <div className="order-1 lg:order-2 flex items-start justify-center lg:justify-end pt-2 lg:pt-4">
              <GrowthHeroVideo />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Investors: core offer + proof */}
      <section
        id="investors"
        className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#F8F4EF] py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center mb-12">
            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                Investment partners
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
              >
                {PRIMARY_PARTNERSHIP.title}
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="text-[#2D1654]/80 font-jost leading-relaxed mb-4 max-w-xl">
                {PRIMARY_PARTNERSHIP.summary}
              </p>
              <p className="text-[#2D1654]/60 font-jost text-sm leading-relaxed mb-6 max-w-xl italic">
                {PRIMARY_PARTNERSHIP.ideal}
              </p>
              <ul className="space-y-2.5 mb-8 max-w-xl">
                {[
                  'Ellesmere branding and identity',
                  'Curriculum frameworks and quality assurance',
                  'Leadership mentoring and network support',
                  'Standards proven on live Middle East campuses',
                ].map(point => (
                  <li key={point} className="font-jost text-sm text-[#2D1654]/75 flex gap-2.5">
                    <span className="text-[#C8A84B] shrink-0">◆</span>
                    {point}
                  </li>
                ))}
              </ul>
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
                  Riyadh · Muscat · Doha soon
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {INVESTOR_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-white p-6 border-l-4 border-[#C8A84B] h-full">
                <h3 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-[#2D1654]/70 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#2D1654]/8 p-6 md:p-8 mb-8">
            <p className="text-[#2D1654]/45 text-[10px] tracking-[0.25em] uppercase font-jost font-bold mb-4">
              Optional add-ons
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {PARTNERSHIP_ADDONS.map(model => (
                <div key={model.id}>
                  <h4 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">
                    {model.title}
                  </h4>
                  <p className="text-[#2D1654]/65 text-sm font-jost leading-relaxed">
                    {model.summary}
                  </p>
                </div>
              ))}
            </div>
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

      {/* 3 — Expansion map */}
      <ExpansionSection asModule sectionId="top-destinations" ctaHref="/growth#investors" />

      {/* 4 — Introduction channels (secondary) */}
      <section
        id="introductions"
        className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#2D1654] py-16 md:py-20"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 20% 80%, rgba(200,168,75,0.16), transparent 45%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl mb-10">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Introduction channels
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Help us reach the right investors
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <p className="text-white/70 font-jost leading-relaxed max-w-xl">
              Agents and rainmakers are how introductions reach ECI — not separate products. Both
              channels feed one pipeline: brand licensing conversations with aligned capital and
              operators.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div id="agents" className="border border-white/15 bg-white/[0.05] p-7 md:p-8">
              <p className="text-[#C8A84B] text-[10px] tracking-[0.25em] uppercase font-jost font-bold mb-3">
                {AGENT_PROGRAM.eyebrow}
              </p>
              <h3 className="font-cormorant text-2xl md:text-3xl text-white font-semibold mb-3">
                {AGENT_PROGRAM.title}
              </h3>
              <p className="text-white/70 font-jost text-sm leading-relaxed mb-4">
                {AGENT_PROGRAM.summary}
              </p>
              <p className="font-cormorant text-lg text-[#C8A84B] italic mb-6">
                {AGENT_PROGRAM.punchline}
              </p>
              <Link
                href="/login?audience=agent"
                className="inline-block border border-[#C8A84B]/60 text-white px-5 py-2.5 font-jost text-sm hover:bg-[#C8A84B] hover:text-[#2D1654] transition-colors"
              >
                Partner portal
              </Link>
            </div>

            <div id="rainmakers" className="border border-white/15 bg-white/[0.05] p-7 md:p-8">
              <p className="text-[#C8A84B] text-[10px] tracking-[0.25em] uppercase font-jost font-bold mb-3">
                {RAINMAKER_PROGRAM.eyebrow}
              </p>
              <h3 className="font-cormorant text-2xl md:text-3xl text-white font-semibold mb-3">
                {RAINMAKER_PROGRAM.title}
              </h3>
              <p className="text-white/70 font-jost text-sm leading-relaxed mb-4">
                {RAINMAKER_PROGRAM.summary}
              </p>
              <p className="font-cormorant text-lg text-[#C8A84B] italic mb-6">
                {RAINMAKER_PROGRAM.punchline}
              </p>
              <Link
                href="/login?audience=agent"
                className="inline-block border border-[#C8A84B]/60 text-white px-5 py-2.5 font-jost text-sm hover:bg-[#C8A84B] hover:text-[#2D1654] transition-colors"
              >
                Partner portal
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_HOW_IT_WORKS.map(step => (
              <div key={step.step} className="border border-white/10 px-4 py-4">
                <p className="font-jost text-[10px] tracking-[0.2em] text-[#C8A84B] font-bold mb-1">
                  {step.step}
                </p>
                <p className="font-cormorant text-lg text-white font-semibold mb-1">{step.title}</p>
                <p className="font-jost text-xs text-white/55 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Contact */}
      <ContactSection
        title="Start a growth conversation"
        subtitle="Tell us if you want to build under the Ellesmere brand, introduce investors as an agent, or refer as a rainmaker. We typically respond within three working days."
        defaultInterest="Brand licensing / new Ellesmere school"
        className="home-window min-h-[100svh] flex flex-col justify-center !py-20"
      />

      <Footer />
    </main>
  )
}
