'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { HERITAGE } from '@/lib/content/network'
import { TEAM_MEMBERS } from '@/lib/content/team'

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function Avatar({
  member,
  size = 128,
}: {
  member: (typeof TEAM_MEMBERS)[number]
  size?: number
}) {
  if (member.image) {
    return (
      <Image
        src={member.image}
        alt={member.name}
        width={size}
        height={size}
        className="rounded-full object-cover object-top"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full bg-[#2D1654] text-[#C8A84B] flex items-center justify-center font-cormorant font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-hidden
    >
      {member.initials}
    </div>
  )
}

export default function AboutSection() {
  const [index, setIndex] = useState(0)
  const [entered, setEntered] = useState(false)
  const [, startTransition] = useTransition()
  const member = TEAM_MEMBERS[index]

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => setIndex(i => (i + 1) % TEAM_MEMBERS.length))
    }, 5200)
    return () => clearInterval(id)
  }, [startTransition])

  return (
    <section
      id="about"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#F8F4EF]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 45% 50% at 85% 40%, rgba(200,168,75,0.12) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left — About ECI */}
          <div
            className={`transition-all duration-700 ${
              entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
              About ECI
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-5"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.4rem)' }}
            >
              140 years of Ellesmere.
              <br />
              <em className="text-[#4C2585]">A growing international family.</em>
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-6" />
            <p className="text-[#2D1654]/80 leading-relaxed mb-4 font-jost text-[1.05rem]">
              Ellesmere College International is the global licensing and partnership arm of
              Ellesmere College, Shropshire — founded in {HERITAGE.founded} on a{' '}
              {HERITAGE.campusAcres}-acre campus in the English countryside. Our philosophy is
              simple and demanding:{' '}
              <strong className="text-[#2D1654] font-semibold">{HERITAGE.tagline}</strong> —
              academic excellence with character, confidence and care.
            </p>
            <p className="text-[#2D1654]/75 leading-relaxed mb-10 font-jost">
              Through carefully selected partnerships we extend Ellesmere&apos;s curriculum
              frameworks, High Performance Learning culture, and quality standards to schools across
              the Middle East and beyond.
            </p>

            <div className="grid grid-cols-3 gap-5">
              {[
                { k: '1884', v: 'Founded in Shropshire' },
                { k: 'HPL', v: 'World Class School' },
                { k: '30+', v: 'Nationalities at UK campus' },
              ].map(item => (
                <div key={item.k} className="border-t-2 border-[#C8A84B] pt-3">
                  <p className="font-cormorant text-3xl md:text-4xl text-[#2D1654] font-semibold">
                    {item.k}
                  </p>
                  <p className="text-xs md:text-sm text-[#2D1654]/65 font-jost mt-1 font-medium leading-snug">
                    {item.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — rotating team bio */}
          <div
            className={`lg:pl-8 transition-all duration-700 delay-150 ${
              entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white border-2 border-[#2D1654]/10 p-8 md:p-10 shadow-[0_16px_48px_rgba(45,22,84,0.08)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8A84B]" />

              <p className="text-[#C8A84B] text-xs tracking-[0.28em] uppercase mb-6 font-jost font-bold">
                Meet our team
              </p>

              <div key={member.id} className="psf-panel">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    <div className="rounded-full ring-2 ring-[#C8A84B]/50 ring-offset-4 ring-offset-white">
                      <Avatar member={member} size={120} />
                    </div>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] transition-colors shadow-sm"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-[#2D1654] leading-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="font-jost text-sm text-[#4C2585] font-medium mb-3">
                      {member.title}
                    </p>
                    <p className="font-jost text-sm text-[#2D1654]/70 leading-relaxed">
                      {member.shortBio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#2D1654]/10">
                <div className="flex gap-1.5">
                  {TEAM_MEMBERS.map((m, i) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => startTransition(() => setIndex(i))}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? 'w-6 bg-[#C8A84B]' : 'w-1.5 bg-[#2D1654]/20 hover:bg-[#2D1654]/40'
                      }`}
                      aria-label={`Show ${m.name}`}
                      aria-current={i === index}
                    />
                  ))}
                </div>
                <Link
                  href="/#team"
                  className="font-jost text-sm font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
                >
                  Full team profiles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
