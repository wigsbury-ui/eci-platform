import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import PartnerServicesSection from '@/components/PartnerServicesSection'
import {
  INVESTOR_VALUE_PROPS,
  OPENING_SOON,
  OPERATING_SCHOOLS,
  PARTNERSHIP_MODELS,
} from '@/lib/content/network'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
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
  RAINMAKER_VS_AGENT,
} from '@/lib/content/rainmakers'

export const metadata: Metadata = {
  title: 'Growth',
  description:
    'Invest with ECI, introduce partners as an agent, or join our rainmaker referral network — pathways for growing the Ellesmere international school family.',
}

const JUMP_LINKS = [
  { label: 'Investors', href: '#investors' },
  { label: 'Agents', href: '#agents' },
  { label: 'Rainmakers', href: '#rainmakers' },
]

export default function GrowthPage() {
  return (
    <main>
      <PublicNav solid />

      <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-24">
        <Image
          src="/images/schools/doha-horizon.jpg"
          alt="International campus expansion"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/95 via-[#2D1654]/82 to-[#2D1654]/40" />
        <div className="relative max-w-7xl mx-auto px-6 pb-16 w-full">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-5 font-jost font-bold">
            Growth
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Capital, introductions,
            <br />
            <em className="text-[#C8A84B] font-normal">and trusted networks.</em>
          </h1>
          <p className="text-white/75 text-lg font-jost max-w-2xl mb-10 leading-relaxed">
            Whether you invest directly, introduce aligned partners as an agent, or open doors as a
            rainmaker, ECI offers clear pathways to grow British-heritage schooling across the
            Middle East and North Africa.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            {JUMP_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="border border-white/35 text-white px-5 py-2.5 text-sm font-jost font-semibold hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="#growth-contact"
              className="bg-[#C8A84B] text-[#2D1654] px-8 py-3.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Start a conversation
            </a>
            <Link
              href="/login?audience=investor"
              className="border border-white/40 text-white px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Investor portal
            </Link>
            <Link
              href="/login?audience=agent"
              className="border border-white/40 text-white px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Agent portal
            </Link>
          </div>
        </div>
      </section>

      {/* Investors */}
      <section id="investors" className="py-24 bg-[#F8F4EF] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
              Investment partners
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Build the next Ellesmere campus with us
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <p className="text-[#2D1654]/75 font-jost leading-relaxed">
              ECI seeks aligned capital and operating partners to grow a network of British-heritage
              schools — from live campuses in Riyadh and Muscat, with Doha opening soon, across a
              ranked Top 10 destination set. Invited partners receive deeper materials inside the
              Investor Portal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {INVESTOR_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-white p-8 border-l-4 border-[#C8A84B]">
                <h3 className="font-cormorant text-2xl text-[#2D1654] mb-3 font-semibold">
                  {item.title}
                </h3>
                <p className="text-[#2D1654]/70 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-start mb-16">
            <div>
              <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-5">
                Live schools, transferable standard
              </h3>
              <ul className="space-y-4">
                {[...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => (
                  <li key={s.id} className="flex gap-4 items-start border-b border-[#2D1654]/10 pb-4">
                    <span className="text-[#C8A84B] font-cormorant text-xl mt-0.5">◆</span>
                    <div>
                      <p className="font-jost font-semibold text-[#2D1654] text-sm">{s.name}</p>
                      <p className="text-[#2D1654]/55 text-sm font-jost">
                        {s.city}, {s.country} ·{' '}
                        {s.status === 'active' ? 'Operating' : 'Opening soon'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-3">
                Partnership structures
              </h3>
              <p className="text-[#2D1654]/65 font-jost text-sm mb-6 leading-relaxed">
                Choose the engagement model that fits your ambition and operating capacity.
              </p>
              <div className="space-y-4">
                {PARTNERSHIP_MODELS.map(model => (
                  <div key={model.id} className="bg-white border border-[#2D1654]/8 p-6">
                    <h4 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">
                      {model.title}
                    </h4>
                    <p className="text-[#2D1654]/70 text-sm font-jost leading-relaxed mb-2">
                      {model.summary}
                    </p>
                    <p className="text-[#C8A84B] text-xs font-jost italic">{model.ideal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="top-destinations">
            <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-3">
              Top 10 priority destinations
            </h3>
            <p className="text-[#2D1654]/60 font-jost text-sm max-w-2xl mb-8 leading-relaxed">
              Ranked markets for partner capital — demand, income fit, regulatory openness and
              cultural alignment with the Ellesmere model.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {TOP_DESTINATIONS.map(m => (
                <div key={m.id} className="bg-white border border-[#2D1654]/8 p-5">
                  <p className="text-[#C8A84B] font-jost text-[11px] tracking-[0.2em] uppercase mb-2">
                    #{m.rank}
                  </p>
                  <h4 className="font-cormorant text-xl text-[#2D1654] mb-1 leading-snug">
                    {m.shortName}
                  </h4>
                  <p className="text-xs text-[#2D1654]/45 font-jost mb-3">{m.country}</p>
                  <p className="text-sm text-[#2D1654]/65 font-jost leading-relaxed line-clamp-4">
                    {m.publicSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/login?audience=investor"
              className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
            >
              Open Investor Portal
            </Link>
          </div>
        </div>
      </section>

      <PartnerServicesSection variant="investors" />

      {/* Agents */}
      <section id="agents" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
              {AGENT_PROGRAM.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              {AGENT_PROGRAM.title}
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <p className="text-[#2D1654]/75 font-jost leading-relaxed">{AGENT_PROGRAM.summary}</p>
            <p className="font-cormorant text-2xl text-[#4C2585] italic mt-5">
              {AGENT_PROGRAM.punchline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {AGENT_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-[#F8F4EF] p-8 border-l-4 border-[#C8A84B]">
                <h3 className="font-cormorant text-2xl text-[#2D1654] mb-3 font-semibold">
                  {item.title}
                </h3>
                <p className="text-[#2D1654]/70 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-8">How it works</h3>
          <div className="grid md:grid-cols-4 gap-5 mb-14">
            {AGENT_HOW_IT_WORKS.map(step => (
              <div key={step.step} className="border border-[#2D1654]/10 p-6">
                <p className="font-jost text-xs tracking-[0.25em] text-[#C8A84B] font-bold mb-3">
                  {step.step}
                </p>
                <h4 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-3">
                  {step.title}
                </h4>
                <p className="font-jost text-sm text-[#2D1654]/70 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-10">
            <div>
              <h3 className="font-cormorant text-3xl text-[#2D1654] font-semibold mb-5">
                Ideal introductions
              </h3>
              <ul className="space-y-3">
                {AGENT_IDEAL_INTROS.map(item => (
                  <li key={item} className="font-jost text-sm text-[#2D1654]/75 flex gap-3">
                    <span className="text-[#C8A84B] font-bold">◆</span>
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
                    <p className="text-[11px] text-[#C8A84B] font-jost tracking-widest">#{d.rank}</p>
                    <p className="font-cormorant text-lg text-[#2D1654]">{d.shortName}</p>
                    <p className="text-xs text-[#2D1654]/45 font-jost">{d.country}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/login?audience=agent"
            className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
          >
            Open Agent Portal
          </Link>
        </div>
      </section>

      {/* Rainmakers */}
      <section
        id="rainmakers"
        className="py-24 scroll-mt-24"
        style={{
          background: 'linear-gradient(165deg, #2D1654 0%, #3d1f6e 50%, #1A1228 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
              {RAINMAKER_PROGRAM.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              {RAINMAKER_PROGRAM.title}
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <p className="text-white/75 font-jost leading-relaxed">{RAINMAKER_PROGRAM.summary}</p>
            <p className="font-cormorant text-2xl text-[#C8A84B] italic mt-5">
              {RAINMAKER_PROGRAM.punchline}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {RAINMAKER_VALUE_PROPS.map(item => (
              <div key={item.title} className="border border-white/15 bg-white/5 p-8">
                <h3 className="font-cormorant text-2xl text-white mb-3 font-semibold">{item.title}</h3>
                <p className="text-white/70 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <h3 className="font-cormorant text-3xl text-white font-semibold mb-8">
            Structured referral process
          </h3>
          <div className="grid md:grid-cols-4 gap-5 mb-14">
            {RAINMAKER_PROCESS.map(step => (
              <div key={step.step} className="border border-white/12 p-6">
                <p className="font-jost text-xs tracking-[0.25em] text-[#C8A84B] font-bold mb-3">
                  {step.step}
                </p>
                <h4 className="font-cormorant text-xl text-white font-semibold mb-3">{step.title}</h4>
                <p className="font-jost text-sm text-white/65 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mb-14">
            <h3 className="font-cormorant text-3xl text-white font-semibold mb-4">
              Aligned with the agent model
            </h3>
            <p className="text-white/65 font-jost text-sm max-w-2xl mb-6 leading-relaxed">
              Rainmakers complement agents — they do not replace them. Distinct reach, coordinated
              territories, and a single central pipeline keep channels from conflicting.
            </p>
            <ul className="space-y-3 max-w-3xl">
              {RAINMAKER_ALIGNMENT.map(item => (
                <li key={item} className="font-jost text-sm text-white/75 flex gap-3">
                  <span className="text-[#C8A84B] font-bold shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-cormorant text-3xl text-white font-semibold mb-3">
              Rainmaker vs agent
            </h3>
            <p className="text-white/60 font-jost text-sm max-w-2xl mb-8 leading-relaxed">
              How the two partner-acquisition channels compare — so the right pathway is clear for
              each relationship.
            </p>
            <div className="overflow-x-auto border border-white/12">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="px-5 py-4 font-jost text-xs tracking-widest uppercase text-[#C8A84B] font-bold w-[18%]">
                      Category
                    </th>
                    <th className="px-5 py-4 font-jost text-xs tracking-widest uppercase text-[#C8A84B] font-bold">
                      Rainmaker
                    </th>
                    <th className="px-5 py-4 font-jost text-xs tracking-widest uppercase text-[#C8A84B] font-bold">
                      Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RAINMAKER_VS_AGENT.map(row => (
                    <tr key={row.category} className="border-b border-white/10 align-top">
                      <td className="px-5 py-5 font-cormorant text-lg text-white font-semibold">
                        {row.category}
                      </td>
                      <td className="px-5 py-5 font-jost text-sm text-white/70 leading-relaxed">
                        {row.rainmaker}
                      </td>
                      <td className="px-5 py-5 font-jost text-sm text-white/70 leading-relaxed">
                        {row.agent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="#growth-contact"
              className="inline-block bg-[#C8A84B] text-[#2D1654] px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Enquire about becoming a rainmaker
            </a>
          </div>
        </div>
      </section>

      <div id="growth-contact">
        <ContactSection
          title="Start a growth conversation"
          subtitle="Tell us whether you are exploring investment, introductions as an agent, or a rainmaker referral role. Our team typically responds within three working days."
          defaultInterest="Investment Opportunity"
        />
      </div>

      <Footer />
    </main>
  )
}
