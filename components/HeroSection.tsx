'use client'

import Image from 'next/image'
import Link from 'next/link'
import GrowthHeroVideo from '@/components/GrowthHeroVideo'
import { HOME_HERO_VIDEO } from '@/lib/content/home-hero-video'

export default function HeroSection() {
  return (
    <section className="home-window relative min-h-[100svh] flex flex-col overflow-hidden">
      <Image
        src="/images/campus/hero-ellesmere-authentic.jpg"
        alt="Ellesmere College historic campus and grounds in Shropshire"
        fill
        priority
        quality={80}
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/88 via-[#2D1654]/55 to-[#2D1654]/15" />

      <div className="relative max-w-7xl mx-auto px-6 w-full pt-28 pb-16 md:pb-20 flex-1 flex flex-col">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 flex-1 items-center">
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <Image
              src="/images/brand/eci-crest.png"
              alt=""
              width={72}
              height={72}
              className="mb-8 drop-shadow-lg"
              priority
            />
            <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-5 font-jost font-bold">
              Ellesmere College International
            </p>
            <h1
              className="font-cormorant font-semibold text-white leading-[1.05] mb-6 max-w-3xl"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
            >
              British excellence.
              <br />
              <em className="text-[#C8A84B] font-normal">Globally delivered.</em>
            </h1>
            <p className="text-white/75 font-jost max-w-xl mb-10 leading-relaxed">
              Founded in Shropshire in 1884, Ellesmere College is a living British boarding school,
              the source of every international campus and the Life:Ready standard behind them.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/investors"
                className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                Build an Ellesmere school
              </Link>
              <a
                href="#schools"
                className="border border-white/40 text-white px-5 py-3 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
              >
                Our schools
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end w-full">
            <GrowthHeroVideo
              className="w-full max-w-none"
              videoSrc={HOME_HERO_VIDEO.videoSrc}
              posterSrc={HOME_HERO_VIDEO.posterSrc}
              posterFallback={HOME_HERO_VIDEO.posterFallback}
              title={HOME_HERO_VIDEO.title}
              durationLabel={HOME_HERO_VIDEO.durationLabel}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
