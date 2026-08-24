'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import GrowthHeroVideo from '@/components/GrowthHeroVideo'
import { HOME_HERO_VIDEO } from '@/lib/content/home-hero-video'

export default function HeroSection() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section className="home-window relative min-h-[100svh] flex flex-col overflow-hidden">
      <Image
        src="/images/campus/hero-ellesmere-authentic.jpg"
        alt=""
        fill
        priority
        quality={80}
        className={`object-cover object-[center_40%] transition-transform duration-[2.4s] ease-out ${ready ? 'scale-100' : 'scale-110'}`}
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(26,18,40,0.88) 0%, rgba(45,22,84,0.72) 42%, rgba(45,22,84,0.35) 70%, rgba(26,18,40,0.45) 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 80%, rgba(200,168,75,0.25), transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full pt-28 pb-16 md:pb-20 flex-1 flex flex-col">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 flex-1 items-center">
          <div
            className={`order-2 lg:order-1 transition-all duration-1000 ${
              ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
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
              className="font-cormorant font-semibold text-white leading-[1.05] mb-6 max-w-xl"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
            >
              British excellence.
              <br />
              <em className="text-[#C8A84B] font-normal">Globally delivered.</em>
            </h1>
            <p className="text-white/85 text-lg leading-relaxed mb-10 font-jost max-w-xl">
              Founded in Shropshire in 1884, Ellesmere College is a living British boarding school
              — the source of every international campus and the Life:Ready standard behind them.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/investors"
                className="bg-[#C8A84B] text-[#2D1654] px-8 py-3.5 rounded-sm font-jost font-bold text-sm hover:bg-[#F0E4B0] transition-colors shadow-lg shadow-black/20"
              >
                Build an Ellesmere school
              </Link>
              <a
                href="#schools"
                className="border-2 border-[#C8A84B]/70 text-white px-8 py-3.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#C8A84B] hover:text-[#2D1654] transition-colors"
              >
                Our schools
              </a>
            </div>
          </div>

          <div
            className={`order-1 lg:order-2 flex items-center justify-center lg:justify-end w-full transition-all duration-1000 delay-150 ${
              ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
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
