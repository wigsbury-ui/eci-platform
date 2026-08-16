'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { HERITAGE } from '@/lib/content/network'
import { TEAM_MEMBERS } from '@/lib/content/team'

function LinkedInIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function Avatar({
  member,
  size = 72,
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
      style={{ width: size, height: size, fontSize: size * 0.3 }}
      aria-hidden
    >
      {member.initials}
    </div>
  )
}

export default function AboutSection() {
  const [index, setIndex] = useState(0)
  const [, startTransition] = useTransition()
  const member = TEAM_MEMBERS[index]

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => setIndex(i => (i + 1) % TEAM_MEMBERS.length))
    }, 5200)
    return () => clearInterval(id)
  }, [startTransition])

  return (
    <section
      id="about"
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[#F8F4EF] py-16 md:py-20 lg:py-24"
    >
      {/* Full-bleed campus image on the right half — fills section height */}
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <Image
          src="/images/campus/uk-160-acre.jpg"
          alt="Ellesmere College Shropshire campus"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F4EF] via-[#F8F4EF]/55 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-end lg:pb-8">
        {/* Main About copy — lower half of the window */}
        <div className="max-w-xl">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            About ECI
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            140 years of Ellesmere.
            <br />
            <em className="text-[#4C2585]">A growing international family.</em>
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
          <p className="text-[#2D1654]/80 leading-relaxed mb-4 font-jost">
            Ellesmere College International is the global licensing and partnership arm of Ellesmere
            College, Shropshire — founded in {HERITAGE.founded} on a {HERITAGE.campusAcres}-acre
            campus in the English countryside. Our philosophy is simple and demanding:{' '}
            <strong className="text-[#2D1654] font-semibold">{HERITAGE.tagline}</strong> —
            academic excellence with character, confidence and care.
          </p>
          <p className="text-[#2D1654]/75 leading-relaxed mb-8 font-jost">
            Through carefully selected partnerships we extend Ellesmere&apos;s curriculum frameworks,
            High Performance Learning culture, and quality standards to schools across the Middle East
            and beyond.
          </p>

          <div className="grid grid-cols-3 gap-5">
            {[
              { k: '1884', v: 'Founded in Shropshire' },
              { k: 'HPL', v: 'World Class School' },
              { k: '30+', v: 'Nationalities at UK campus' },
            ].map(item => (
              <div key={item.k} className="border-t-2 border-[#C8A84B] pt-3">
                <p className="font-cormorant text-3xl text-[#2D1654] font-semibold">{item.k}</p>
                <p className="text-xs text-[#2D1654]/65 font-jost mt-1 font-medium leading-snug">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: team rotator under copy */}
        <div className="lg:hidden mt-10 bg-white/95 border border-[#2D1654]/10 p-5 shadow-sm max-w-md">
          <TeamRotatorPanel
            member={member}
            index={index}
            setIndex={i => startTransition(() => setIndex(i))}
          />
        </div>
      </div>

      {/* Desktop: discreet team module — bottom right of the campus image */}
      <div className="hidden lg:block absolute bottom-8 right-8 xl:bottom-10 xl:right-10 w-[min(22rem,calc(50vw-3rem))] z-10">
        <div className="bg-white/95 backdrop-blur-sm border border-[#2D1654]/10 p-5 shadow-md">
          <TeamRotatorPanel
            member={member}
            index={index}
            setIndex={i => startTransition(() => setIndex(i))}
          />
        </div>
      </div>
    </section>
  )
}

function TeamRotatorPanel({
  member,
  index,
  setIndex,
}: {
  member: (typeof TEAM_MEMBERS)[number]
  index: number
  setIndex: (i: number) => void
}) {
  return (
    <>
      <p className="text-[#C8A84B] text-[10px] tracking-[0.25em] uppercase mb-3 font-jost font-bold">
        Meet our team
      </p>

      <div key={member.id} className="psf-panel flex gap-3.5 items-start">
        <div className="relative shrink-0">
          <Avatar member={member} size={64} />
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] transition-colors"
            aria-label={`${member.name} on LinkedIn`}
          >
            <LinkedInIcon className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="font-cormorant text-lg font-semibold text-[#2D1654] leading-tight">
            {member.name}
          </h3>
          <p className="font-jost text-[11px] text-[#4C2585] font-medium mt-0.5 mb-1.5">
            {member.title}
          </p>
          <p className="font-jost text-xs text-[#2D1654]/65 leading-relaxed line-clamp-3">
            {member.shortBio}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#2D1654]/8">
        <div className="flex gap-1">
          {TEAM_MEMBERS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? 'w-4 bg-[#C8A84B]' : 'w-1 bg-[#2D1654]/20 hover:bg-[#2D1654]/35'
              }`}
              aria-label={`Show ${m.name}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <Link
          href="/#team"
          className="font-jost text-xs font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
        >
          Full team →
        </Link>
      </div>
    </>
  )
}
