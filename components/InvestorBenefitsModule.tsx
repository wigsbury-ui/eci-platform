'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INVESTOR_BENEFITS,
  INVESTOR_BENEFITS_INTRO,
} from '@/lib/content/investor-benefits'

const VH_PER_BENEFIT = 75

/**
 * Viewport-pinned benefits: large title, slim numbered index, one benefit at a time.
 * No icons, diagrams, or photography.
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

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="home-window relative"
      style={{ height: `${count * VH_PER_BENEFIT}vh` }}
      aria-label="Partnership benefits"
    >
      <div className="sticky top-0 flex h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-[#2D1654]">
        <div
          className="absolute inset-x-0 top-0 z-20 h-[2px] bg-white/10"
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

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl min-h-0 flex-col px-6 pt-[max(5.5rem,var(--eci-nav-offset))] pb-8 md:px-10">
          <header className="shrink-0 max-w-3xl">
            <p className="mb-3 font-jost text-[11px] font-bold uppercase tracking-[0.3em] text-[#C8A84B]">
              {INVESTOR_BENEFITS_INTRO.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)' }}
            >
              {INVESTOR_BENEFITS_INTRO.title}
            </h2>
            <div className="mt-5 h-1 w-14 bg-[#C8A84B]" />
          </header>

          <div className="mt-8 flex min-h-0 flex-1 flex-col gap-8 lg:mt-10 lg:flex-row lg:gap-14">
            <nav
              className="hidden w-44 shrink-0 flex-col gap-1 lg:flex"
              aria-label="Benefit index"
            >
              {INVESTOR_BENEFITS.map((benefit, index) => {
                const isActive = index === active
                return (
                  <button
                    key={benefit.id}
                    type="button"
                    onClick={() => scrollToBenefit(index)}
                    className={`text-left font-jost text-[12px] tracking-[0.08em] transition-colors ${
                      isActive ? 'text-[#C8A84B]' : 'text-white/35 hover:text-white/70'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                )
              })}
            </nav>

            <div className="flex gap-1.5 lg:hidden" aria-hidden>
              {INVESTOR_BENEFITS.map((benefit, index) => (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => scrollToBenefit(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === active ? 'w-5 bg-[#C8A84B]' : 'w-1.5 bg-white/25'
                  }`}
                  aria-label={`Benefit ${index + 1}`}
                />
              ))}
            </div>

            <article key={item.id} className="eci-benefits-card min-h-0 max-w-2xl flex-1">
              <p className="mb-3 font-jost text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A84B]">
                {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <h3
                className="font-cormorant font-semibold leading-[1.12] tracking-[-0.02em] text-white"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                {item.title}
              </h3>
              <p className="mt-5 font-jost text-base leading-relaxed text-white/80 md:text-[1.05rem]">
                {item.benefit}
              </p>
              <div className="mt-7 border-l-2 border-[#C8A84B] pl-4">
                <p className="mb-1.5 font-jost text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A84B]">
                  Evidence
                </p>
                <p className="font-jost text-sm leading-relaxed text-white/60">{item.evidence}</p>
              </div>
              <p className="mt-8 font-jost text-[12px] text-white/40">
                Commercial schedules stay in the{' '}
                <Link
                  href="/login?audience=investor"
                  className="text-[#C8A84B] underline-offset-2 hover:underline"
                >
                  Investor Portal
                </Link>
                .
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
