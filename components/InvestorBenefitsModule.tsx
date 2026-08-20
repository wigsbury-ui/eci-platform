'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INVESTOR_BENEFITS,
  INVESTOR_BENEFITS_INTRO,
} from '@/lib/content/investor-benefits'

/** Viewport-heights of page scroll allotted per benefit while the frame is pinned. */
const VH_PER_BENEFIT = 80

/**
 * Partnership benefits stay locked to the screen. Slim index + large title on the
 * left; authentic campus photography and copy on the right advance with scroll.
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
  const runwayVh = count * VH_PER_BENEFIT

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="home-window relative"
      style={{ height: `${runwayVh}vh` }}
      aria-label="Partnership benefits"
    >
      <div className="sticky top-0 h-[100svh] max-h-[100svh] overflow-hidden bg-[#1A1228]">
        {/* Progress */}
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

        <div className="relative z-10 grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(15rem,22%)_minmax(0,1fr)]">
          {/* Slim left rail */}
          <aside className="relative flex min-h-0 flex-col border-b border-white/10 bg-[#2D1654] px-5 pt-[max(5.25rem,var(--eci-nav-offset))] pb-4 lg:border-b-0 lg:border-r lg:border-white/10 lg:px-6 lg:pb-6">
            <p className="mb-2 font-jost text-[10px] font-bold uppercase tracking-[0.28em] text-[#C8A84B]">
              {INVESTOR_BENEFITS_INTRO.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.35rem)' }}
            >
              {INVESTOR_BENEFITS_INTRO.title}
            </h2>
            <div className="mt-4 mb-3 h-1 w-12 bg-[#C8A84B]" />
            <p className="mb-5 hidden max-w-[16rem] font-jost text-[13px] leading-relaxed text-white/65 xl:block">
              {INVESTOR_BENEFITS_INTRO.summary}
            </p>

            <nav
              className="hidden min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto eci-benefits-scroll lg:flex"
              aria-label="Benefit index"
            >
              {INVESTOR_BENEFITS.map((benefit, index) => {
                const isActive = index === active
                return (
                  <button
                    key={benefit.id}
                    type="button"
                    onClick={() => scrollToBenefit(index)}
                    className={`group flex items-baseline gap-2.5 py-1.5 text-left transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/75'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span
                      className={`w-5 shrink-0 font-jost text-[10px] tracking-[0.14em] ${
                        isActive ? 'text-[#C8A84B]' : 'text-white/35 group-hover:text-white/55'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`min-w-0 font-jost text-[12px] leading-snug line-clamp-2 ${
                        isActive ? 'border-b border-[#C8A84B]/70 pb-px' : ''
                      }`}
                    >
                      {benefit.title}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-3 flex gap-1.5 lg:hidden" aria-hidden>
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
          </aside>

          {/* Photo + copy */}
          <div className="relative flex min-h-0 flex-col lg:flex-row">
            <div className="relative min-h-[38svh] flex-1 lg:min-h-0 lg:w-[48%]">
              {INVESTOR_BENEFITS.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    index === active ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={index !== active}
                >
                  <Image
                    src={benefit.image}
                    alt={benefit.imageAlt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                  />
                </div>
              ))}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1228]/55 via-transparent to-[#1A1228]/25 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#1A1228]/35"
                aria-hidden
              />
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col justify-center bg-[#1A1228] px-5 py-5 md:px-8 md:py-8 lg:w-[52%] lg:px-10 lg:py-10 lg:pt-[max(5.25rem,var(--eci-nav-offset))]">
              <div key={item.id} className="eci-benefits-card max-w-xl">
                <p className="mb-3 font-jost text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A84B]">
                  {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </p>
                <h3
                  className="font-cormorant font-semibold leading-[1.12] tracking-[-0.02em] text-white"
                  style={{ fontSize: 'clamp(1.55rem, 2.4vw, 2.15rem)' }}
                >
                  {item.title}
                </h3>
                <p className="mt-4 font-jost text-[15px] leading-relaxed text-white/78 md:text-base">
                  {item.benefit}
                </p>
                <div className="mt-6 border-l-2 border-[#C8A84B] pl-4">
                  <p className="mb-1.5 font-jost text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A84B]">
                    Evidence
                  </p>
                  <p className="font-jost text-sm leading-relaxed text-white/60">{item.evidence}</p>
                </div>
                <p className="mt-6 font-jost text-[12px] leading-relaxed text-white/40">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
