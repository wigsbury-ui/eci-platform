'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INVESTOR_BENEFITS,
  INVESTOR_BENEFITS_INTRO,
} from '@/lib/content/investor-benefits'

const VH_PER_BENEFIT = 78

/**
 * Viewport-pinned partnership benefits.
 * Short labelled rail + large typographic mark; no icons or photography.
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
      <div
        className="sticky top-0 flex h-[100svh] max-h-[100svh] flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #2D1654 0%, #3d1f6e 46%, #1A1228 100%)',
        }}
      >
        {/* Atmosphere */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 12% 18%, rgba(200,168,75,0.18), transparent 42%), radial-gradient(ellipse at 88% 72%, rgba(76,37,133,0.55), transparent 50%)',
          }}
        />

        <div
          className="absolute inset-x-0 top-0 z-30 h-[2px] bg-white/10"
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

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl min-h-0 flex-col px-6 pt-[max(5.25rem,var(--eci-nav-offset))] pb-6 md:px-10 md:pb-8">
          {/* Title row */}
          <header className="relative shrink-0 pr-4 md:pr-28">
            <p className="mb-3 font-jost text-[11px] font-bold uppercase tracking-[0.3em] text-[#C8A84B]">
              {INVESTOR_BENEFITS_INTRO.eyebrow}
            </p>
            <h2
              className="max-w-[18ch] font-cormorant font-semibold leading-[1.02] tracking-[-0.025em] text-white"
              style={{ fontSize: 'clamp(2.75rem, 5.4vw, 4.35rem)' }}
            >
              {INVESTOR_BENEFITS_INTRO.title}
            </h2>
            <div className="mt-5 h-1 w-14 bg-[#C8A84B]" />

            {/* Typographic mark — graphic weight without icons */}
            <span
              key={mark}
              className="pointer-events-none absolute -right-1 top-0 hidden select-none font-cormorant font-semibold leading-none text-white/[0.07] md:block"
              style={{ fontSize: 'clamp(7rem, 14vw, 11rem)' }}
              aria-hidden
            >
              {mark}
            </span>
          </header>

          {/* Labelled rail — readable topics, not a bare number list */}
          <nav
            className="mt-7 flex shrink-0 gap-1 overflow-x-auto pb-1 eci-benefits-scroll md:mt-9 md:flex-wrap md:gap-x-1 md:gap-y-2 md:overflow-visible"
            aria-label="Benefit topics"
          >
            {INVESTOR_BENEFITS.map((benefit, index) => {
              const isActive = index === active
              return (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => scrollToBenefit(index)}
                  className={`shrink-0 border-b-2 px-2.5 py-2 text-left transition-colors md:px-3 ${
                    isActive
                      ? 'border-[#C8A84B] text-white'
                      : 'border-transparent text-white/40 hover:text-white/75'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className={`mb-0.5 block font-jost text-[10px] tracking-[0.16em] ${
                      isActive ? 'text-[#C8A84B]' : 'text-white/30'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="block whitespace-nowrap font-jost text-[13px] leading-tight md:text-sm">
                    {benefit.label}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="mt-2 h-px w-full bg-white/10" aria-hidden />

          {/* Active benefit */}
          <article
            key={item.id}
            className="eci-benefits-card mt-6 flex min-h-0 flex-1 flex-col justify-center md:mt-8"
          >
            <div className="max-w-3xl">
              <h3
                className="font-cormorant font-semibold leading-[1.12] tracking-[-0.02em] text-white"
                style={{ fontSize: 'clamp(1.7rem, 3.1vw, 2.55rem)' }}
              >
                {item.title}
              </h3>
              <p className="mt-4 max-w-2xl font-jost text-[15px] leading-relaxed text-white/80 md:mt-5 md:text-base">
                {item.benefit}
              </p>

              <div className="mt-6 grid max-w-2xl gap-3 border border-[#C8A84B]/35 bg-[#C8A84B]/[0.07] p-4 md:mt-7 md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-5 md:p-5">
                <p className="font-jost text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C8A84B]">
                  Evidence
                </p>
                <p className="font-jost text-sm leading-relaxed text-white/70 md:text-[15px]">
                  {item.evidence}
                </p>
              </div>

              <p className="mt-6 font-jost text-[12px] text-white/40">
                Commercial schedules stay in the{' '}
                <Link
                  href="/login?audience=investor"
                  className="text-[#C8A84B] underline-offset-2 hover:underline"
                >
                  Investor Portal
                </Link>
                .
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
