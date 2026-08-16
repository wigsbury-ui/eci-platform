import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import {
  AGENT_HOW_IT_WORKS,
  AGENT_IDEAL_INTROS,
  AGENT_PROGRAM,
  AGENT_VALUE_PROPS,
} from '@/lib/content/agents'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'

export const metadata: Metadata = {
  title: 'Introduction Agents',
  description:
    'Partner with Ellesmere College International as an introduction agent connecting aligned investors and operators to our MENA school network.',
}

export default function AgentsPage() {
  return (
    <main>
      <PublicNav solid />

      <section className="relative min-h-[65vh] flex items-end overflow-hidden pt-24">
        <Image
          src="/images/campus/uk-campus-life.jpg"
          alt="Ellesmere partnership conversations"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0E7490]/75 to-[#0E7490]/35" />
        <div className="relative max-w-7xl mx-auto px-6 pb-20 w-full">
          <p className="text-[#5EEAD4] text-xs tracking-[0.35em] uppercase mb-5 font-jost font-bold">
            {AGENT_PROGRAM.eyebrow}
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)' }}
          >
            {AGENT_PROGRAM.title}
          </h1>
          <p className="text-white/80 text-lg font-jost max-w-xl mb-8 leading-relaxed">
            {AGENT_PROGRAM.summary}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#agent-contact"
              className="bg-[#0E7490] text-white px-8 py-3.5 rounded-sm font-jost font-bold text-sm hover:bg-[#14B8A6] transition-colors"
            >
              Register as an agent
            </a>
            <Link
              href="/login?audience=agent"
              className="border-2 border-white/50 text-white px-8 py-3.5 rounded-sm font-jost font-semibold text-sm hover:border-[#5EEAD4] hover:text-[#5EEAD4] transition-colors"
            >
              Agent portal login
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F8F4EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Why agents choose ECI
            </p>
            <h2 className="font-cormorant text-4xl text-[#2D1654] font-semibold">
              A clear product. A serious network.
            </h2>
            <div className="w-14 h-1 bg-[#0E7490] mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {AGENT_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-white p-8 border-l-4 border-[#0E7490]">
                <h3 className="font-cormorant text-2xl text-[#2D1654] mb-3 font-semibold">
                  {item.title}
                </h3>
                <p className="text-[#2D1654]/75 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-cormorant text-4xl text-[#2D1654] font-semibold mb-10">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {AGENT_HOW_IT_WORKS.map(step => (
              <div key={step.step} className="border-2 border-[#2D1654]/10 p-6">
                <p className="font-jost text-xs tracking-[0.25em] text-[#0E7490] font-bold mb-3">
                  {step.step}
                </p>
                <h3 className="font-cormorant text-2xl text-[#2D1654] font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="font-jost text-sm text-[#2D1654]/70 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-5">
                Ideal introductions
              </h3>
              <ul className="space-y-3">
                {AGENT_IDEAL_INTROS.map(item => (
                  <li key={item} className="font-jost text-sm text-[#2D1654]/75 flex gap-3">
                    <span className="text-[#0E7490] font-bold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-5">
                Markets agents can discuss
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {TOP_DESTINATIONS.slice(0, 8).map(d => (
                  <div key={d.id} className="bg-[#F8F4EF] p-4">
                    <p className="text-[11px] text-[#0E7490] font-jost tracking-widest">#{d.rank}</p>
                    <p className="font-cormorant text-lg text-[#2D1654]">{d.shortName}</p>
                    <p className="text-xs text-gray-500 font-jost">{d.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0E7490] text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-cormorant text-3xl font-semibold mb-2">{AGENT_PROGRAM.punchline}</p>
            <p className="font-jost text-white/80 text-sm max-w-xl">
              Invited agents access briefing packs, market summaries and a referral desk inside the
              password-protected Agent Portal.
            </p>
          </div>
          <Link
            href="/login?audience=agent"
            className="bg-white text-[#0E7490] px-8 py-3.5 rounded-sm font-jost font-bold text-sm hover:bg-[#F0FDFA] transition-colors shrink-0"
          >
            Open Agent Portal
          </Link>
        </div>
      </section>

      <div id="agent-contact">
        <ContactSection
          title="Start an agent conversation"
          subtitle="Tell us about your network and the markets you cover. The ECI partnerships team typically responds within three working days."
          defaultInterest="Agent / Introduction Partner"
        />
      </div>

      <Footer />
    </main>
  )
}
