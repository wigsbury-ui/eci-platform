import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import {
  INVESTOR_VALUE_PROPS,
  OPENING_SOON,
  OPERATING_SCHOOLS,
} from '@/lib/content/network'
import {
  AGENT_HOW_IT_WORKS,
  AGENT_PROGRAM,
  AGENT_VALUE_PROPS,
} from '@/lib/content/agents'
import {
  RAINMAKER_PROCESS,
  RAINMAKER_PROGRAM,
  RAINMAKER_VALUE_PROPS,
  RAINMAKER_VS_AGENT,
} from '@/lib/content/rainmakers'

export const metadata: Metadata = {
  title: 'Investors & agents',
  description:
    'Invest with ECI, introduce partners as an agent, or join our rainmaker referral network — pathways for growing the Ellesmere international school family.',
}

const PATHWAYS = [
  {
    label: 'Investors',
    href: '#investors',
    line: 'Aligned capital and operating partners',
  },
  {
    label: 'Agents',
    href: '#agents',
    line: 'Trusted introduction partners',
  },
  {
    label: 'Rainmakers',
    href: '#rainmakers',
    line: 'Alumni and high-trust referrers',
  },
]

export default function GrowthPage() {
  return (
    <main>
      <PublicNav solid />

      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
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
            Partnership pathways
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
          >
            Capital, introductions,
            <br />
            <em className="text-[#C8A84B] font-normal">and trusted networks.</em>
          </h1>
          <p className="text-white/75 font-jost max-w-xl mb-10 leading-relaxed">
            Three ways to grow British-heritage schooling with Ellesmere College International.
            Models, markets and services live on the public site; this page is how you join.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mb-10">
            {PATHWAYS.map(p => (
              <a
                key={p.href}
                href={p.href}
                className="border border-white/25 bg-white/5 backdrop-blur-sm px-5 py-4 hover:border-[#C8A84B]/70 transition-colors"
              >
                <p className="font-cormorant text-xl text-white font-semibold">{p.label}</p>
                <p className="font-jost text-xs text-white/60 mt-1 leading-snug">{p.line}</p>
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="inline-block bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
          >
            Start a conversation
          </a>
        </div>
      </section>

      <section id="investors" className="relative bg-[#F8F4EF] py-20 md:py-24">
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
                Build the next Ellesmere campus with us
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="text-[#2D1654]/80 font-jost leading-relaxed mb-4 max-w-xl">
                ECI seeks aligned capital and operating partners for British-heritage schools —
                partnering into a model already operating across the Middle East, not a paper
                franchise.
              </p>
              <p className="text-[#2D1654]/65 font-jost leading-relaxed mb-8 max-w-xl">
                Invited partners receive market scorecards, financial packs and model documentation
                inside the password-controlled Investor Portal.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
                >
                  Register interest
                </a>
                <Link
                  href="/login?audience=investor"
                  className="inline-block border border-[#2D1654]/20 text-[#2D1654] px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] transition-colors"
                >
                  Investor portal
                </Link>
              </div>
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

      <section id="agents" className="relative bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                {AGENT_PROGRAM.eyebrow}
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3rem)' }}
              >
                {AGENT_PROGRAM.title}
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-4" />
              <p className="text-[#2D1654]/75 font-jost leading-relaxed mb-4">
                {AGENT_PROGRAM.summary}
              </p>
              <p className="font-cormorant text-xl text-[#4C2585] italic mb-8">
                {AGENT_PROGRAM.punchline}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-block bg-[#2D1654] text-white px-6 py-3 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
                >
                  Enquire as an agent
                </a>
                <Link
                  href="/login?audience=agent"
                  className="inline-block border border-[#2D1654]/20 text-[#2D1654] px-6 py-3 font-jost text-sm hover:border-[#C8A84B] transition-colors"
                >
                  Agent portal
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {AGENT_VALUE_PROPS.map(item => (
                <div key={item.title} className="bg-[#F8F4EF] p-5 border-t-2 border-[#C8A84B]">
                  <h3 className="font-cormorant text-lg text-[#2D1654] font-semibold mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-jost text-xs text-[#2D1654]/65 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_HOW_IT_WORKS.map(step => (
              <div key={step.step} className="bg-[#F8F4EF] border border-[#2D1654]/8 p-4">
                <p className="font-jost text-[10px] tracking-[0.2em] text-[#C8A84B] font-bold mb-1">
                  {step.step}
                </p>
                <p className="font-cormorant text-lg text-[#2D1654] font-semibold mb-1">
                  {step.title}
                </p>
                <p className="font-jost text-xs text-[#2D1654]/60 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="rainmakers"
        className="relative py-20 md:py-24"
        style={{
          background: 'linear-gradient(165deg, #2D1654 0%, #3d1f6e 52%, #1A1228 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl mb-8">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              {RAINMAKER_PROGRAM.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3rem)' }}
            >
              {RAINMAKER_PROGRAM.title}
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-4" />
            <p className="text-white/75 font-jost leading-relaxed">{RAINMAKER_PROGRAM.summary}</p>
            <p className="font-cormorant text-xl text-[#C8A84B] italic mt-4">
              {RAINMAKER_PROGRAM.punchline}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {RAINMAKER_VALUE_PROPS.map(item => (
              <div key={item.title} className="border border-white/12 bg-white/5 p-5">
                <h3 className="font-cormorant text-lg text-white font-semibold mb-2">{item.title}</h3>
                <p className="font-jost text-xs text-white/65 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {RAINMAKER_PROCESS.map(step => (
              <div key={step.step} className="border border-white/10 px-4 py-3">
                <p className="font-jost text-[10px] tracking-[0.2em] text-[#C8A84B] font-bold">
                  {step.step} · {step.title}
                </p>
                <p className="font-jost text-xs text-white/60 mt-1 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto border border-white/10 mb-8">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-5 py-3.5 font-jost text-[10px] tracking-widest uppercase text-[#C8A84B] font-bold w-[16%]">
                    Category
                  </th>
                  <th className="px-5 py-3.5 font-jost text-[10px] tracking-widest uppercase text-[#C8A84B] font-bold">
                    Rainmaker
                  </th>
                  <th className="px-5 py-3.5 font-jost text-[10px] tracking-widest uppercase text-[#C8A84B] font-bold">
                    Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {RAINMAKER_VS_AGENT.map(row => (
                  <tr key={row.category} className="border-b border-white/8 align-top">
                    <td className="px-5 py-4 font-cormorant text-lg text-white font-semibold">
                      {row.category}
                    </td>
                    <td className="px-5 py-4 font-jost text-sm text-white/70 leading-relaxed">
                      {row.rainmaker}
                    </td>
                    <td className="px-5 py-4 font-jost text-sm text-white/70 leading-relaxed">
                      {row.agent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <a
            href="#contact"
            className="inline-block bg-[#C8A84B] text-[#2D1654] px-6 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
          >
            Enquire as a rainmaker
          </a>
        </div>
      </section>

      <ContactSection
        title="Start a partnership conversation"
        subtitle="Tell us whether you are exploring investment, introductions as an agent, or a rainmaker referral role. Our team typically responds within three working days."
        defaultInterest="Investment Opportunity"
      />

      <Footer />
    </main>
  )
}
