import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import GrowthHeroVideo from '@/components/GrowthHeroVideo'
import ParallaxHeroBackground from '@/components/ParallaxHeroBackground'
import {
  AGENT_HOW_IT_WORKS,
  AGENT_IDEAL_INTROS,
  AGENT_PROGRAM,
  AGENT_WHAT_YOU_DO,
} from '@/lib/content/agents'
import {
  RAINMAKER_ALIGNMENT,
  RAINMAKER_PROCESS,
  RAINMAKER_PROGRAM,
  RAINMAKER_WHAT_YOU_DO,
} from '@/lib/content/rainmakers'

export const metadata: Metadata = {
  title: 'Agents & rainmakers',
  description:
    'Introduce aligned investors and operators to Ellesmere College International. Agents and rainmakers feed one brand-licensing pipeline.',
}

export default function AgentsPage() {
  return (
    <main className="home-snap">
      <PublicNav solid />

      {/* Hero — mirrored Investors layout */}
      <section className="home-window relative min-h-[100svh] flex flex-col overflow-hidden">
        <ParallaxHeroBackground
          src="/images/agents/hero-dusk.jpg"
          alt="International campus at dusk"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#1A1228]/90 via-[#2D1654]/58 to-[#2D1654]/18" />
        <div className="relative max-w-7xl mx-auto px-6 w-full pt-28 pb-16 md:pb-20 flex-1 flex flex-col">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 flex-1 items-center">
            <div className="order-1 flex items-center justify-center lg:justify-start w-full">
              <GrowthHeroVideo
                className="w-full max-w-none"
                videoSrc="/videos/agent-intro.mp4"
                posterSrc="/videos/agent-intro-poster.jpg"
                title="Partner with Ellesmere College International"
                durationLabel="50 second video"
              />
            </div>

            <div className="order-2 flex flex-col justify-center">
              <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
                Agents &amp; rainmakers
              </p>
              <h1
                className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
              >
                Open the door
                <br />
                <em className="text-[#C8A84B] font-normal">to the right capital.</em>
              </h1>
              <p className="text-white/75 font-jost max-w-xl mb-10 leading-relaxed">
                Two introduction channels. One pipeline. Help ECI reach investors and operators
                ready to build a school under the Ellesmere brand.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href="#how-it-works"
                  className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
                >
                  How introductions work
                </a>
                <Link
                  href="/login?audience=agent"
                  className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
                >
                  Partner portal
                </Link>
                <a
                  href="#contact"
                  className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
                >
                  Register your interest
                </a>
              </div>

              <p className="font-jost text-sm text-white/50">
                Exploring brand licensing yourself?{' '}
                <Link href="/investors" className="text-[#C8A84B] hover:underline">
                  Investors
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — image + process */}
      <section
        id="how-it-works"
        className="home-window relative min-h-[100svh] flex flex-col justify-center bg-[#F8F4EF] py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="relative min-h-[22rem] lg:min-h-[34rem] overflow-hidden">
              <Image
                src="/images/campus/uk-students-campus.jpg"
                alt="Ellesmere College students on the Shropshire campus"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                How introductions work
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
              >
                One pipeline. Clear handoff.
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-6" />
              <p className="font-jost text-[#2D1654]/75 leading-relaxed mb-8 max-w-xl">
                Whether you arrive as an agent or a rainmaker, the path is the same: brief,
                introduce with context, then let ECI run diligence and structuring.
              </p>
              <ol className="space-y-6">
                {AGENT_HOW_IT_WORKS.map(step => (
                  <li key={step.step} className="flex gap-4">
                    <span className="font-jost text-xs tracking-[0.2em] text-[#C8A84B] font-bold shrink-0 pt-1">
                      {step.step}
                    </span>
                    <div>
                      <p className="font-cormorant text-2xl text-[#2D1654] font-semibold mb-1">
                        {step.title}
                      </p>
                      <p className="font-jost text-[0.95rem] text-[#2D1654]/65 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section
        id="agents"
        className="home-window relative min-h-[100svh] flex flex-col justify-center bg-white py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-12">
            <div className="order-2 lg:order-1">
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                {AGENT_PROGRAM.eyebrow}
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
              >
                {AGENT_PROGRAM.title}
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="font-jost text-[#2D1654]/80 leading-relaxed mb-4 max-w-xl">
                {AGENT_PROGRAM.summary}
              </p>
              <p className="font-cormorant text-2xl text-[#4C2585] italic mb-8">
                {AGENT_PROGRAM.punchline}
              </p>

              <div className="space-y-6 mb-10">
                {AGENT_WHAT_YOU_DO.map(item => (
                  <div key={item.title} className="border-t border-[#2D1654]/12 pt-4">
                    <h3 className="font-cormorant text-2xl text-[#2D1654] font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="font-jost text-[0.95rem] text-[#2D1654]/65 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/login?audience=agent"
                className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
              >
                Open partner portal
              </Link>
            </div>

            <div className="order-1 lg:order-2 relative min-h-[22rem] lg:min-h-[34rem] overflow-hidden">
              <Image
                src="/images/campus/students-classroom.jpg"
                alt="Students learning with a teacher in an Ellesmere classroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="border-t border-[#2D1654]/10 pt-10">
            <p className="font-jost text-xs tracking-[0.2em] uppercase text-[#C8A84B] font-bold mb-5">
              Ideal introductions
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3 max-w-4xl">
              {AGENT_IDEAL_INTROS.map(item => (
                <li key={item} className="font-jost text-[0.95rem] text-[#2D1654]/75 flex gap-2.5">
                  <span className="text-[#C8A84B] shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Rainmakers */}
      <section
        id="rainmakers"
        className="home-window relative min-h-[100svh] flex flex-col justify-center bg-[#F8F4EF] py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-12">
            <div className="relative min-h-[22rem] lg:min-h-[34rem] overflow-hidden">
              <Image
                src="/images/campus/uk-choir.jpg"
                alt="Ellesmere students in choir"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                {RAINMAKER_PROGRAM.eyebrow}
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
              >
                {RAINMAKER_PROGRAM.title}
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="font-jost text-[#2D1654]/80 leading-relaxed mb-4 max-w-xl">
                {RAINMAKER_PROGRAM.summary}
              </p>
              <p className="font-cormorant text-2xl text-[#4C2585] italic mb-8">
                {RAINMAKER_PROGRAM.punchline}
              </p>

              <div className="space-y-6">
                {RAINMAKER_WHAT_YOU_DO.map(item => (
                  <div key={item.title} className="border-t border-[#2D1654]/12 pt-4">
                    <h3 className="font-cormorant text-2xl text-[#2D1654] font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="font-jost text-[0.95rem] text-[#2D1654]/65 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
            <div>
              <p className="font-jost text-xs tracking-[0.2em] uppercase text-[#C8A84B] font-bold mb-5">
                Rainmaker process
              </p>
              <ol className="space-y-5">
                {RAINMAKER_PROCESS.map(step => (
                  <li key={step.step} className="flex gap-4">
                    <span className="font-jost text-xs tracking-[0.2em] text-[#C8A84B] font-bold shrink-0 pt-1">
                      {step.step}
                    </span>
                    <div>
                      <p className="font-cormorant text-xl text-[#2D1654] font-semibold mb-1">
                        {step.title}
                      </p>
                      <p className="font-jost text-sm text-[#2D1654]/65 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden">
                <Image
                  src="/images/campus/uk-campus-life.jpg"
                  alt="Ellesmere College heritage campus, Shropshire"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/campus/uk-learning.jpg"
                  alt="Ellesmere students in a learning space"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/schools/riyadh/playground.jpg"
                  alt="Playground at Ellesmere College Riyadh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* One standard — compact, image-backed */}
      <section className="home-window relative min-h-[70svh] flex flex-col justify-end overflow-hidden py-16 md:py-20">
        <Image
          src="/images/campus/uk-students-1.png"
          alt="Ellesmere College students"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1228] via-[#2D1654]/75 to-[#2D1654]/35" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
            Working together
          </p>
          <h2
            className="font-cormorant font-semibold text-white leading-tight mb-4 max-w-2xl"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Complementary channels. One standard.
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mb-8" />
          <ul className="max-w-2xl space-y-4 mb-10">
            {RAINMAKER_ALIGNMENT.map(line => (
              <li key={line} className="font-jost text-base text-white/80 leading-relaxed flex gap-2.5">
                <span className="text-[#C8A84B] shrink-0 mt-0.5">◆</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="inline-block bg-[#C8A84B] text-[#2D1654] px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
          >
            Register your interest
          </a>
        </div>
      </section>

      <ContactSection
        title="Become an introduction partner"
        subtitle="Tell us whether you are exploring the agent channel or the rainmaker network. We typically respond within three working days."
        defaultInterest="Agent / Introduction Partner"
        className="home-window min-h-[100svh] flex flex-col justify-center !py-20"
      />

      <Footer />
    </main>
  )
}
