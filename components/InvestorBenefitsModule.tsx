'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INVESTOR_BENEFITS,
  INVESTOR_BENEFITS_INTRO,
} from '@/lib/content/investor-benefits'

const VH_PER_BENEFIT = 70

/**
 * Viewport-pinned partnership benefits on a light ground.
 * Copy-led left column + compact landscape plate on the right.
 */
export default function InvestorBenefitsModule() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const count = INVESTOR_BENEFITS.length

  const syncFromScroll = useCallback(() => {
    const el = sectionRef.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) {
      setProgress(0)
      setActive(0)
      return
    }
    const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total)
    const p = scrolled / total
    setProgress(p)
    setActive(Math.min(count - 1, Math.floor(p * count + 1e-6)))
  }, [count])

  useEffect(() => {
    syncFromScroll()
    window.addEventListener('scroll', syncFromScroll, { passive: true })
    window.addEventListener('resize', syncFromScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', syncFromScroll)
      window.removeEventListener('resize', syncFromScroll)
    }
  }, [syncFromScroll])

  const scrollToBenefit = (index: number) => {
    const el = sectionRef.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({
      top: el.offsetTop + (index / count) * total + 1,
      behavior: 'smooth',
    })
  }

  const item = INVESTOR_BENEFITS[active]
  const mark = String(active + 1).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="home-window relative"
      style={{ height: `${count * VH_PER_BENEFIT}vh` }}
      aria-label="Partnership benefits"
    >
      <div className="sticky top-0 flex h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-[#F8F4EF]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 55% at 100% 0%, rgba(237,229,247,0.9), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(200,168,75,0.08), transparent 50%)',
          }}
        />

        <div
          className="absolute inset-x-0 top-0 z-30 h-[2px] bg-[#2D1654]/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Benefits scroll progress"
        >
          <div
            className="h-full bg-[#C8A84B] transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl min-h-0 flex-col px-6 pt-[max(6.25rem,calc(var(--eci-nav-offset)+1.5rem))] pb-5 md:pb-6">
          <header className="relative shrink-0 max-w-3xl">
            <p className="mb-1.5 font-jost text-[11px] font-bold uppercase tracking-[0.3em] text-[#C8A84B]">
              {INVESTOR_BENEFITS_INTRO.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold leading-[1.05] tracking-[-0.02em] text-[#2D1654]"
              style={{ fontSize: 'clamp(2rem, 3.35vw, 3rem)' }}
            >
              {INVESTOR_BENEFITS_INTRO.title}
            </h2>
            <p className="mt-3 font-jost text-[15px] leading-relaxed text-[#2D1654]/70 md:text-base md:leading-relaxed">
              {INVESTOR_BENEFITS_INTRO.summary}
            </p>
            <div className="mt-3 h-1 w-14 bg-[#C8A84B]" />
          </header>

          <nav
            className="mt-3 flex shrink-0 gap-0.5 overflow-x-auto pb-0.5 eci-benefits-scroll md:mt-3.5 md:flex-wrap md:gap-x-1 md:gap-y-1.5 md:overflow-visible"
            aria-label="Benefit topics"
          >
            {INVESTOR_BENEFITS.map((benefit, index) => {
              const isActive = index === active
              return (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => scrollToBenefit(index)}
                  className={`shrink-0 border-b-2 px-2 py-1.5 text-left transition-colors md:px-2.5 ${
                    isActive
                      ? 'border-[#C8A84B] text-[#2D1654]'
                      : 'border-transparent text-[#2D1654]/40 hover:text-[#2D1654]/75'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="block whitespace-nowrap font-jost text-[12px] leading-tight md:text-[13px]">
                    {benefit.label}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="mt-1 h-px w-full bg-[#2D1654]/10" aria-hidden />

          <article
            key={item.id}
            className="eci-benefits-card mt-3 grid min-h-0 flex-1 grid-cols-1 items-center gap-6 md:mt-4 lg:grid-cols-[minmax(0,1.28fr)_minmax(10.5rem,0.48fr)] lg:gap-10 xl:gap-12"
          >
            <div className="min-w-0 lg:py-1">
              <p className="mb-2 font-jost text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A84B]">
                {mark} / {String(count).padStart(2, '0')}
              </p>
              <h3
                className="font-cormorant font-semibold leading-[1.1] tracking-[-0.02em] text-[#2D1654]"
                style={{ fontSize: 'clamp(1.95rem, 3.6vw, 2.85rem)' }}
              >
                {item.title}
              </h3>
              <p className="mt-4 max-w-2xl font-jost text-[17px] leading-[1.65] text-[#2D1654]/82 md:mt-5 md:text-lg md:leading-[1.7]">
                {item.benefit}
              </p>

              <p className="mt-5 font-jost text-[13px] text-[#2D1654]/45 md:mt-6">
                For fee schedules and full terms, open the{' '}
                <Link
                  href="/login?audience=investor"
                  className="text-[#4C2585] underline-offset-2 hover:underline"
                >
                  Investor Portal
                </Link>
                .
              </p>
            </div>

            {/* Compact landscape plate, vertically centred with copy */}
            <figure className="mx-auto w-full max-w-[15rem] justify-self-center lg:mx-0 lg:max-w-[13.5rem] lg:justify-self-end xl:max-w-[14.5rem]">
              <div className="border border-[#C8A84B]/55 p-1.5 bg-white">
                <div className="relative aspect-[5/3] overflow-hidden bg-[#2D1654]/5">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 240px, 260px"
                    className="object-cover object-center"
                    priority={active === 0}
                  />
                </div>
              </div>
              <figcaption className="mt-2 font-jost text-[11px] leading-snug text-[#2D1654]/55 md:text-xs">
                {item.imageCaption}
              </figcaption>
            </figure>
          </article>
        </div>
      </div>
    </section>
  )
}
