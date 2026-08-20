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
  PRIMARY_PARTNERSHIP,
} from '@/lib/content/network'

export const metadata: Metadata = {
  title: 'Investors',
  description:
    'Partner with Ellesmere College International to build a school under the Ellesmere brand.',
}

export default function InvestorsPage() {
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
            <div className="order-2 lg:order-1 flex flex-col justify-end pb-4 lg:pb-8 lg:-translate-y-10">
              <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
                Investors
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
                <Link href="/agents" className="text-[#C8A84B] hover:underline">
                  Agents &amp; rainmakers
                </Link>
              </p>
            </div>

            <div className="order-1 lg:order-2 flex items-start justify-center lg:justify-end pt-8 lg:pt-20">
              <GrowthHeroVideo />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Investors: core offer + proof */}
      <section
        id="investors"
        className="home-window relative min-h-[100svh] flex flex-col justify-center bg-[#F8F4EF] py-16 md:py-20"
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
                Brand licensing and more…
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
              <div>
                <a
                  href="#contact"
                  className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
                >
                  Register your interest
                </a>
                <p className="mt-3 font-jost text-sm text-[#2D1654]/55">
                  <Link
                    href="/login?audience=investor"
                    className="text-[#4C2585] hover:text-[#2D1654] hover:underline underline-offset-2"
                  >
                    Gain access to the investor portal
                  </Link>
                </p>
              </div>
            </div>

            <div className="w-full self-center">
              <GrowthHeroVideo
                variant="frame"
                videoSrc="/videos/brand-licensing.mp4"
                posterSrc="/videos/brand-licensing-poster.jpg"
                title="Brand licensing with Ellesmere College International"
                durationLabel="90 second video"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INVESTOR_VALUE_PROPS.map(item => (
              <div key={item.title} className="border-t-2 border-[#C8A84B] pt-4">
                <h3 className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2 whitespace-nowrap">
                  {item.title}
                </h3>
                <p className="text-[#2D1654]/70 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Riyadh success story */}
      <section
        id="riyadh"
        className="home-window relative min-h-[100svh] flex flex-col justify-center bg-white py-16 md:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(237,229,247,0.55), transparent 55%), radial-gradient(ellipse 70% 50% at 0% 100%, rgba(248,244,239,0.8), transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center mb-10 md:mb-12">
            <div className="eci-fade-up">
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                Success story
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
              >
                Ellesmere College Riyadh
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="text-[#2D1654]/80 font-jost leading-relaxed mb-5 max-w-xl">
                From a standing start to more than{' '}
                <span className="text-[#2D1654] font-semibold">600 students</span> in just over two
                years — a clear signal that families recognise the Ellesmere standard, and that brand
                licensing can scale with pace.
              </p>
              <p className="text-[#2D1654]/55 font-jost text-sm leading-relaxed max-w-xl mb-6">
                Operating today across campuses in the Kingdom, including Al Hamra and Salwa Compound,
                with British-heritage pathways and the Life:Ready ethos at the centre.
              </p>
              <a
                href="https://ellesmerecollegeriyadh.com"
                target="_blank"
                rel="noreferrer"
                className="font-jost text-sm text-[#4C2585] hover:text-[#2D1654] hover:underline underline-offset-2"
              >
                Visit the school website
              </a>
            </div>

            <div
              className="w-full eci-fade-up"
              style={{ animationDelay: '120ms' }}
              aria-label="Riyadh school video placeholder"
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#1A1228] border border-[#2D1654]/10">
                <Image
                  src="/images/schools/riyadh/exterior.jpg"
                  alt=""
                  fill
                  className="object-cover opacity-45"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#1A1228]/55" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/35 text-white mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <p className="font-cormorant text-xl text-white">Video coming soon</p>
                  <p className="font-jost text-xs text-white/55 mt-1.5 tracking-wide">
                    Ellesmere College Riyadh
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              {
                src: '/images/schools/riyadh/classroom-bright.jpg',
                alt: 'Bright classroom at Ellesmere College Riyadh',
                delay: '180ms',
              },
              {
                src: '/images/schools/riyadh/playground.jpg',
                alt: 'Shaded playground at Ellesmere College Riyadh',
                delay: '260ms',
              },
              {
                src: '/images/schools/riyadh/classroom.jpg',
                alt: 'Students learning together at Ellesmere College Riyadh',
                delay: '340ms',
              },
            ].map(img => (
              <div
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden eci-fade-up"
                style={{ animationDelay: img.delay }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Expansion map */}
      <ExpansionSection asModule sectionId="top-destinations" ctaHref="/investors#investors" />

      {/* 5 — Contact */}
      <ContactSection
        title="Start a growth conversation"
        subtitle="Tell us about markets, capital profile, and timing if you want to build under the Ellesmere brand. We typically respond within three working days."
        defaultInterest="Brand licensing / new Ellesmere school"
        className="home-window min-h-[100svh] flex flex-col justify-center !py-20"
      />

      <Footer />
    </main>
  )
}
