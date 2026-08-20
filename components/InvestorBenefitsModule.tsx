'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Award,
  Building2,
  Copy,
  Layers,
  MapPinned,
  Scale,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import {
  INVESTOR_BENEFITS,
  INVESTOR_BENEFITS_INTRO,
  type InvestorBenefit,
} from '@/lib/content/investor-benefits'

const ICONS: Record<InvestorBenefit['id'], LucideIcon> = {
  'demand-signal': TrendingUp,
  'brand-equity': Award,
  'transferable-product': Layers,
  replication: Copy,
  'market-map': MapPinned,
  'local-economics': Scale,
  'quality-governance': ShieldCheck,
  'partner-infrastructure': Building2,
}

/** Viewport-heights of page scroll allotted per benefit while the frame is pinned. */
const VH_PER_BENEFIT = 85

/**
 * Partnership benefits stay locked to the screen: a tall scroll runway pins a
 * full-viewport frame, and page scroll advances which benefit is shown inside it.
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
    const idx = Math.min(count - 1, Math.floor(p * count + 1e-6))
    setActive(idx)
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
    const target = el.offsetTop + (index / count) * total + 1
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const item = INVESTOR_BENEFITS[active]
  const Icon = ICONS[item.id]
  const runwayVh = count * VH_PER_BENEFIT

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="home-window relative"
      style={{ height: `${runwayVh}vh` }}
      aria-label="Partnership benefits"
    >
      {/* Pinned frame — stays in the viewport for the full runway */}
      <div className="sticky top-0 h-[100svh] max-h-[100svh] overflow-hidden bg-[#2D1654] flex flex-col">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div
            className="absolute -top-24 -left-16 h-72 w-72 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(200,168,75,0.22), transparent 68%)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 h-96 w-96"
            style={{
              background: 'radial-gradient(circle, rgba(76,37,133,0.55), transparent 65%)',
            }}
          />
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <pattern id="eci-benefits-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0H0V48" fill="none" stroke="#C8A84B" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#eci-benefits-grid)" />
          </svg>
        </div>

        {/* Progress rail along the top of the frame */}
        <div
          className="absolute inset-x-0 top-0 z-20 h-[3px] bg-white/10"
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

        <div className="relative z-10 flex h-full min-h-0 flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 pt-[max(5.25rem,var(--eci-nav-offset))] pb-5 md:pb-6 gap-5 lg:gap-10">
          {/* Left: briefing + index */}
          <aside className="lg:w-[min(22rem,34%)] shrink-0 flex flex-col min-h-0 lg:py-2">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              {INVESTOR_BENEFITS_INTRO.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight mb-3"
              style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.5rem)' }}
            >
              {INVESTOR_BENEFITS_INTRO.title}
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-4" />
            <p className="hidden md:block font-jost text-sm text-white/70 leading-relaxed mb-5 max-w-sm">
              {INVESTOR_BENEFITS_INTRO.summary}
            </p>

            {/* Relationship diagram */}
            <div className="hidden xl:block mb-5 border border-white/15 bg-white/[0.04] p-4">
              <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#C8A84B] mb-3">
                How value splits
              </p>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center text-center">
                <div className="border border-[#C8A84B]/35 bg-[#C8A84B]/10 px-2 py-3">
                  <p className="font-cormorant text-lg text-white">You</p>
                  <p className="font-jost text-[11px] text-white/60 mt-1 leading-snug">
                    Capital · campus · operations
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#C8A84B]" aria-hidden>
                  <span className="h-8 w-px bg-[#C8A84B]/50" />
                  <span className="font-jost text-[10px] tracking-wider">LICENCE</span>
                  <span className="h-8 w-px bg-[#C8A84B]/50" />
                </div>
                <div className="border border-white/20 bg-white/[0.06] px-2 py-3">
                  <p className="font-cormorant text-lg text-white">ECI</p>
                  <p className="font-jost text-[11px] text-white/60 mt-1 leading-snug">
                    Brand · standards · network
                  </p>
                </div>
              </div>
            </div>

            <nav
              className="hidden lg:flex flex-col gap-1 overflow-y-auto min-h-0 pr-1 eci-benefits-scroll"
              aria-label="Benefit index"
            >
              {INVESTOR_BENEFITS.map((benefit, index) => {
                const NavIcon = ICONS[benefit.id]
                const isActive = index === active
                return (
                  <button
                    key={benefit.id}
                    type="button"
                    onClick={() => scrollToBenefit(index)}
                    className={`flex items-center gap-3 text-left px-2.5 py-2 transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                        isActive ? 'bg-[#C8A84B] text-[#2D1654]' : 'bg-white/10 text-[#C8A84B]'
                      }`}
                    >
                      <NavIcon size={15} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0">
                      <span className="font-jost text-[10px] tracking-[0.18em] uppercase block opacity-70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-jost text-xs leading-snug line-clamp-2">
                        {benefit.title}
                      </span>
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* Mobile / tablet progress dots */}
            <div className="flex lg:hidden gap-1.5 mt-1 mb-1" aria-hidden>
              {INVESTOR_BENEFITS.map((benefit, index) => (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => scrollToBenefit(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === active ? 'w-5 bg-[#C8A84B]' : 'w-1.5 bg-white/25'
                  }`}
                  aria-label={`Benefit ${index + 1}`}
                />
              ))}
            </div>
          </aside>

          {/* Right: active benefit (stays inside the frame) */}
          <div className="relative flex-1 min-h-0 flex flex-col justify-center">
            <article
              key={item.id}
              className="eci-benefits-card border border-white/12 bg-white/[0.04] p-5 md:p-8 lg:p-10"
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#C8A84B] text-[#2D1654]">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-jost text-[11px] tracking-[0.22em] uppercase text-[#C8A84B] mb-1.5">
                    Benefit {String(active + 1).padStart(2, '0')} of{' '}
                    {String(count).padStart(2, '0')}
                  </p>
                  <h3 className="font-cormorant text-[1.65rem] md:text-[2.05rem] text-white font-semibold leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              <p className="font-jost text-base md:text-[1.05rem] text-white/80 leading-relaxed mb-6 md:pl-[4rem]">
                {item.benefit}
              </p>

              <div className="md:ml-[4rem] border-l-2 border-[#C8A84B]/55 bg-[#C8A84B]/[0.07] pl-4 pr-3 py-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C8A84B]" aria-hidden />
                  <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-[#C8A84B] font-semibold">
                    Evidence
                  </p>
                </div>
                <p className="font-jost text-sm text-white/65 leading-relaxed">{item.evidence}</p>
              </div>
            </article>

            <p className="mt-5 font-jost text-sm text-white/45 leading-relaxed max-w-2xl">
              Commercial schedules stay in the{' '}
              <Link
                href="/login?audience=investor"
                className="text-[#C8A84B] hover:underline underline-offset-2"
              >
                Investor Portal
              </Link>
              . Keep scrolling for the next benefit
              {active < count - 1 ? '' : ' — or continue down the page'}.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
