import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
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
  title: 'Agents',
  description:
    'Introduce aligned investors and operators to Ellesmere College International, or join the rainmaker referral network.',
}

export default function AgentsPage() {
  return (
    <main className="home-snap">
      <PublicNav solid />

      <section className="home-window relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <Image
          src="/images/campus/students-classroom.jpg"
          alt="Ellesmere classroom"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/95 via-[#2D1654]/78 to-[#2D1654]/35" />
        <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-20 w-full pt-28">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
            {AGENT_PROGRAM.eyebrow}
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
          >
            {AGENT_PROGRAM.title}
          </h1>
          <p className="text-white/75 font-jost max-w-xl mb-8 leading-relaxed">
            {AGENT_PROGRAM.summary}
          </p>
          <p className="font-cormorant text-2xl text-[#C8A84B] italic mb-10">
            {AGENT_PROGRAM.punchline}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Enquire as an agent
            </a>
            <Link
              href="/login?audience=agent"
              className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Agent portal
            </Link>
          </div>
        </div>
      </section>

      <section
        id="agents"
        className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#F8F4EF] py-20"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {AGENT_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-white p-5 border-t-2 border-[#C8A84B]">
                <h2 className="font-cormorant text-lg text-[#2D1654] font-semibold mb-1.5">
                  {item.title}
                </h2>
                <p className="font-jost text-xs text-[#2D1654]/65 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_HOW_IT_WORKS.map(step => (
              <div key={step.step} className="bg-white/80 border border-[#2D1654]/8 p-4">
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
        className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden py-20"
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {RAINMAKER_PROCESS.map(step => (
              <div key={step.step} className="border border-white/10 px-4 py-3">
                <p className="font-jost text-[10px] tracking-[0.2em] text-[#C8A84B] font-bold">
                  {step.step} · {step.title}
                </p>
                <p className="font-jost text-xs text-white/60 mt-1 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="inline-block bg-[#C8A84B] text-[#2D1654] px-6 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
          >
            Enquire as a rainmaker
          </a>
        </div>
      </section>

      <section className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl mb-8">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Channel design
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-3"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3rem)' }}
            >
              Rainmaker vs agent
            </h2>
            <p className="text-[#2D1654]/65 font-jost text-sm leading-relaxed">
              Complementary channels — distinct reach, coordinated so they do not conflict, feeding
              one central ECI pipeline.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#2D1654]/10">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[#2D1654]/10 bg-[#F8F4EF]">
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
                  <tr key={row.category} className="border-b border-[#2D1654]/8 align-top">
                    <td className="px-5 py-4 font-cormorant text-lg text-[#2D1654] font-semibold">
                      {row.category}
                    </td>
                    <td className="px-5 py-4 font-jost text-sm text-[#2D1654]/70 leading-relaxed">
                      {row.rainmaker}
                    </td>
                    <td className="px-5 py-4 font-jost text-sm text-[#2D1654]/70 leading-relaxed">
                      {row.agent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ContactSection
        title="Introduce a partner to ECI"
        subtitle="Tell us whether you are exploring an agent role or a rainmaker referral. Our team typically responds within three working days."
        defaultInterest="Agent / Introduction Partner"
        className="home-window min-h-[100svh] flex flex-col justify-center !py-20"
      />

      <Footer />
    </main>
  )
}
