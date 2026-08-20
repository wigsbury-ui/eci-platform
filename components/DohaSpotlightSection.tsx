'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DOHA_SCHOOL } from '@/lib/content/doha'

export default function DohaSpotlightSection() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section
      id="doha"
      className="home-window relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
    >
      <Image
        src={DOHA_SCHOOL.spotlightImage}
        alt="Ellesmere College Doha entrance lobby"
        fill
        className={`object-cover transition-transform duration-[2.2s] ease-out ${
          ready ? 'scale-100' : 'scale-110'
        }`}
        sizes="100vw"
        priority={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(26,18,40,0.92) 0%, rgba(45,22,84,0.72) 48%, rgba(26,18,40,0.35) 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 75% 80%, rgba(200,168,75,0.28), transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-20 pt-32 w-full">
        <div
          className={`max-w-2xl transition-all duration-1000 ${
            ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
            {DOHA_SCHOOL.eyebrow} · {DOHA_SCHOOL.city}
          </p>
          <h2
            className="font-cormorant font-semibold text-white leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            {DOHA_SCHOOL.name}
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
          <p className="text-white/80 font-jost text-lg leading-relaxed mb-8 max-w-xl">
            {DOHA_SCHOOL.spotlightBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/schools/doha"
              className="bg-[#C8A84B] text-[#2D1654] px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Explore Ellesmere College Doha
            </Link>
            <Link
              href="/#contact"
              className="border border-white/40 text-white px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Enquire about the campus
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
