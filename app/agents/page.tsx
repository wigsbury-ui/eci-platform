import type { Metadata } from 'next'
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
import {
  RAINMAKER_ALIGNMENT,
  RAINMAKER_PROCESS,
  RAINMAKER_PROGRAM,
  RAINMAKER_VALUE_PROPS,
} from '@/lib/content/rainmakers'

export const metadata: Metadata = {
  title: 'Agents & rainmakers',
  description:
    'Introduce aligned investors and operators to Ellesmere College International. Agents and rainmakers feed one brand-licensing pipeline.',
}

export default function AgentsPage() {
  return (
    <main>
      <PublicNav solid />

      {/* Hero */}
      <section className="relative min-h-[70svh] flex flex-col justify-end overflow-hidden bg-[#2D1654] pt-28 pb-16 md:pb-20">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 85% 15%, rgba(200,168,75,0.22), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(76,37,133,0.45), transparent 55%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
            Introduction partners
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
          >
            Agents &amp; rainmakers
          </h1>
          <div className="w-14 h-1 bg-[#C8A84B] mb-6" />
          <p className="text-white/75 font-jost leading-relaxed max-w-xl mb-8">
            Help us reach the right investors and operators. Agents and rainmakers are introduction
            channels into one pipeline — brand licensing conversations with capital ready to build
            under the Ellesmere name.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login?audience=agent"
              className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Partner portal
            </Link>
            <a
              href="#contact"
              className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Register your interest
            </a>
            <Link
              href="/investors"
              className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Brand licensing offer
            </Link>
          </div>
        </div>
      </section>

      {/* Shared process */}
      <section className="relative bg-[#F8F4EF] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
            How introductions work
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4 max-w-2xl"
            style={{ fontSize: 'clamp(1.85rem, 3vw, 2.75rem)' }}
          >
            One pipeline. Two ways in.
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {AGENT_HOW_IT_WORKS.map(step => (
              <div key={step.step}>
                <p className="font-jost text-xs tracking-[0.2em] text-[#C8A84B] font-bold mb-2">
                  {step.step}
                </p>
                <p className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">{step.title}</p>
                <p className="font-jost text-sm text-[#2D1654]/65 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="relative bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              {AGENT_PROGRAM.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-3"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.85rem)' }}
            >
              {AGENT_PROGRAM.title}
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-4" />
            <p className="font-jost text-[#2D1654]/75 leading-relaxed mb-3">{AGENT_PROGRAM.summary}</p>
            <p className="font-cormorant text-xl text-[#4C2585] italic">{AGENT_PROGRAM.punchline}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 mb-12">
            {AGENT_VALUE_PROPS.map(item => (
              <div key={item.title} className="border-t border-[#2D1654]/12 pt-4">
                <h3 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">{item.title}</h3>
                <p className="font-jost text-sm text-[#2D1654]/65 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <p className="font-jost text-xs tracking-[0.2em] uppercase text-[#C8A84B] font-bold mb-3">
              Ideal introductions
            </p>
            <ul className="space-y-2.5">
              {AGENT_IDEAL_INTROS.map(item => (
                <li key={item} className="font-jost text-sm text-[#2D1654]/75 flex gap-2.5">
                  <span className="text-[#C8A84B] shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Rainmakers */}
      <section id="rainmakers" className="relative bg-[#F8F4EF] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              {RAINMAKER_PROGRAM.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-3"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.85rem)' }}
            >
              {RAINMAKER_PROGRAM.title}
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-4" />
            <p className="font-jost text-[#2D1654]/75 leading-relaxed mb-3">
              {RAINMAKER_PROGRAM.summary}
            </p>
            <p className="font-cormorant text-xl text-[#4C2585] italic">{RAINMAKER_PROGRAM.punchline}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 mb-12">
            {RAINMAKER_VALUE_PROPS.map(item => (
              <div key={item.title} className="border-t border-[#2D1654]/12 pt-4">
                <h3 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">{item.title}</h3>
                <p className="font-jost text-sm text-[#2D1654]/65 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="font-jost text-xs tracking-[0.2em] uppercase text-[#C8A84B] font-bold mb-6">
            Rainmaker process
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {RAINMAKER_PROCESS.map(step => (
              <div key={step.step}>
                <p className="font-jost text-xs tracking-[0.2em] text-[#C8A84B] font-bold mb-2">
                  {step.step}
                </p>
                <p className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">{step.title}</p>
                <p className="font-jost text-sm text-[#2D1654]/65 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alignment */}
      <section className="relative bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
            Working together
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4 max-w-2xl"
            style={{ fontSize: 'clamp(1.85rem, 3vw, 2.75rem)' }}
          >
            Complementary channels, one standard
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mb-8" />
          <ul className="max-w-3xl space-y-3">
            {RAINMAKER_ALIGNMENT.map(line => (
              <li key={line} className="font-jost text-sm text-[#2D1654]/75 leading-relaxed flex gap-2.5">
                <span className="text-[#C8A84B] shrink-0 mt-0.5">◆</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactSection
        title="Become an introduction partner"
        subtitle="Tell us whether you are exploring the agent channel or the rainmaker network. We typically respond within three working days."
        defaultInterest="Agent / Introduction Partner"
      />

      <Footer />
    </main>
  )
}
