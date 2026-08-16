'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HeadsMessageSection() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section
      id="heads-message"
      className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden py-20 md:py-24"
      style={{
        background:
          'linear-gradient(165deg, #2D1654 0%, #3d1f6e 48%, #1A1228 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 85% 20%, rgba(200,168,75,0.22), transparent 45%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div
          className={`grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-center transition-all duration-1000 ${
            ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="mx-auto lg:mx-0 w-full max-w-sm xl:max-w-md">
            <div className="border border-[#C8A84B]/55 p-3">
              <div className="relative aspect-[3/4] max-h-[min(58svh,480px)] overflow-hidden bg-[#1A1228]">
                <Image
                  src="/images/people/jon-shaw.jpg"
                  alt="Jon Shaw, Head of Ellesmere College"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 420px"
                />
              </div>
            </div>
            <p className="mt-4 font-jost text-[#C8A84B] text-sm tracking-wide">
              Jon Shaw
              <span className="text-white/50"> · </span>
              <span className="text-white/70">Head, Ellesmere College</span>
            </p>
          </div>

          <div>
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
              Head&apos;s message
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              A Life:Ready education,
              <br />
              <em className="text-[#C8A84B]">shared with the world.</em>
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
            <div className="space-y-4 text-white/85 font-jost leading-relaxed text-[1.02rem] max-w-xl">
              <p>
                Ellesmere has always believed that education is about more than examination
                results. Our purpose is to help young people become confident, kind and capable —
                ready for study, work and life.
              </p>
              <p>
                Through Ellesmere College International, that same care for the individual, sense of
                community and ambition for the future travels with our partner schools — from
                Riyadh today to Doha and further markets ahead.
              </p>
              <p>
                I look forward to welcoming families, partners and colleagues who share our
                conviction that a British heritage education, delivered with heart, can flourish
                anywhere.
              </p>
            </div>
            <p className="mt-7 font-cormorant text-2xl text-[#C8A84B] italic">Jon Shaw</p>
            <p className="text-white/45 text-xs font-jost mt-1">
              Sample welcome — final wording to be provided by the Head.
            </p>
            <Link
              href="https://www.ellesmere.com/about-us/headmasters-welcome"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 text-sm font-jost text-white/80 border-b border-[#C8A84B]/60 hover:text-[#C8A84B] hover:border-[#C8A84B] transition-colors pb-0.5"
            >
              Read more on ellesmere.com
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
