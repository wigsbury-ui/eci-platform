'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INVESTOR_BENEFITS,
  INVESTOR_BENEFITS_INTRO,
} from '@/lib/content/investor-benefits'

const VH_PER_BENEFIT = 68

/**
 * Viewport-pinned partnership benefits. Copy column and image plate share
 * the same row height so the frame scales with the text block beside it.
 */
export default function InvestorBenefitsModule() {
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [copyHeight, setCopyHeight] = useState(0)
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

  useEffect(() => {
    const el = copyRef.current
    if (!el) return

    const syncCopyHeight = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        setCopyHeight(0)
        return
      }
      setCopyHeight(el.getBoundingClientRect().height)
    }

    syncCopyHeight()
    const observer = new ResizeObserver(syncCopyHeight)
    observer.observe(el)
    window.addEventListener('resize', syncCopyHeight, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncCopyHeight)
    }
  }, [active])

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

        <div
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl min-h-0 flex-col px-6 pt-[max(5.75rem,calc(var(--eci-nav-offset)+1rem))] pb-5 md:pb-6"
        >
          <header className="shrink-0">
            <p className="mb-1 font-jost text-[11px] font-bold uppercase tracking-[0.3em] text-[#C8A84B]">
              {INVESTOR_BENEFITS_INTRO.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold leading-[1.05] tracking-[-0.02em] text-[#2D1654]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
            >
              {INVESTOR_BENEFITS_INTRO.title}
            </h2>
            <div className="mt-2.5 h-1 w-14 bg-[#C8A84B]" />
          </header>

          <nav
            className="mt-3 shrink-0 overflow-x-auto pb-0.5 eci-benefits-scroll md:mt-4 md:flex md:flex-wrap md:gap-x-1 md:gap-y-0.5"
            aria-label="Benefit topics"
          >
            {INVESTOR_BENEFITS.map((benefit, index) => {
              const isActive = index === active
              return (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => scrollToBenefit(index)}
                  className={`shrink-0 border-b-2 px-2.5 py-1.5 text-left transition-colors md:px-3 md:py-2 ${
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

          <div className="mt-2 h-px w-full shrink-0 bg-[#2D1654]/10" aria-hidden />

          <div className="flex min-h-0 flex-1 flex-col py-3 md:py-4">
            <article
              className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(16rem,21rem)] lg:items-start lg:gap-10 xl:gap-12"
            >
              <div ref={copyRef} className="min-w-0 order-2 flex flex-col lg:order-1">
                <p className="mb-2 font-jost text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A84B]">
                  {mark} / {String(count).padStart(2, '0')}
                </p>
                <p className="mb-4 font-jost text-[15px] leading-relaxed text-[#2D1654]/72 md:mb-5 md:text-base md:leading-relaxed lg:max-w-[34rem]">
                  {INVESTOR_BENEFITS_INTRO.summary}
                </p>
                <div key={item.id} className="eci-benefits-card flex flex-col">
                  <h3
                    className="font-cormorant font-semibold leading-[1.1] tracking-[-0.02em] text-[#2D1654]"
                    style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 font-jost text-[16px] leading-[1.65] text-[#2D1654]/82 md:mt-4 md:text-[17px] md:leading-[1.68] lg:max-w-[34rem]">
                    {item.benefit}
                  </p>
                  <p className="mt-4 font-jost text-[13px] text-[#2D1654]/45 md:mt-5">
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
              </div>

              <figure
                key={item.id}
                className="eci-benefits-card order-1 flex min-h-[11rem] flex-col lg:order-2 lg:min-h-0"
              >
                <div
                  className="flex min-h-[10.5rem] flex-col border border-[#C8A84B]/55 bg-white p-2 shadow-[0_10px_32px_rgba(45,22,84,0.08)] lg:min-h-0"
                  style={
                    copyHeight > 0
                      ? { height: `${copyHeight}px`, maxHeight: `${copyHeight}px` }
                      : undefined
                  }
                >
                  <div className="relative min-h-0 flex-1 overflow-hidden bg-[#2D1654]/5">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 296px"
                      className="object-cover object-center"
                      priority={active === 0}
                    />
                  </div>
                </div>
                <figcaption className="mt-2 shrink-0 text-center font-jost text-[11px] leading-snug text-[#2D1654]/55 md:text-xs lg:text-right">
                  {item.imageCaption}
                </figcaption>
              </figure>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
