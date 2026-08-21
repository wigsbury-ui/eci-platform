'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Neil Tomalin message — mirrors Head’s Message layout with the portrait on the right.
 */
export default function NeilMessageSection() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section
      id="from-neil"
      className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-[max(5.5rem,var(--eci-nav-offset))] pb-20 md:pb-24"
      style={{
        background: 'linear-gradient(165deg, #2D1654 0%, #3d1f6e 48%, #1A1228 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 15% 25%, rgba(200,168,75,0.2), transparent 45%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div
          className={`grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16 transition-all duration-1000 ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <div className="order-2 lg:order-1">
            <p className="mb-4 font-jost text-xs font-bold uppercase tracking-[0.3em] text-[#C8A84B]">
              From the Director
            </p>
            <h2
              className="mb-5 font-cormorant font-semibold leading-tight text-white"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Beyond the transaction —
              <br />
              <em className="font-normal text-[#C8A84B]">schools families love.</em>
            </h2>
            <div className="mb-5 h-1 w-14 bg-[#C8A84B]" />
            <div className="max-w-xl space-y-4 font-jost text-[1.02rem] leading-relaxed text-white/85">
              <p>
                Brand licensing is how we grow — but the real work is building schools that
                students and families love to be part of. A campus that feels like Ellesmere is not
                only a commercial agreement; it is a living community with high standards, warm
                pastoral care and a clear sense of belonging.
              </p>
              <p>
                Ellesmere College International exists to add value beyond the transactional. We
                bring curriculum, quality assurance, leadership support and a network of partner
                schools so that each new campus joins something larger — an extended Ellesmere
                family that families recognise and want to stay inside.
              </p>
              <p>
                When partners succeed, it is because the school becomes a place people are proud
                of. That is the measure I care about most: not only that a campus opens, but that
                students and families love it — and love being part of the wider network.
              </p>
            </div>
            <p className="mt-7 font-cormorant text-2xl italic text-[#C8A84B]">Neil Tomalin</p>
            <p className="mt-1 font-jost text-sm text-white/55">
              Director of International Strategy &amp; School Development
            </p>
            <p className="mt-0.5 font-jost text-xs text-white/40">
              Ellesmere College International
            </p>
            <Link
              href="https://www.linkedin.com/in/neil-tomalin/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block border-b border-[#C8A84B]/60 pb-0.5 font-jost text-sm text-white/80 transition-colors hover:border-[#C8A84B] hover:text-[#C8A84B]"
            >
              Connect on LinkedIn
            </Link>
          </div>

          <div className="order-1 mx-auto w-fit max-w-full lg:order-2 lg:mx-0 lg:justify-self-end">
            <div className="w-fit max-w-full border border-[#C8A84B]/60 p-2.5">
              <div className="relative aspect-[3/4] w-[min(100vw-3rem,18.5rem)] overflow-hidden bg-[#1A1228] sm:w-[19rem] xl:w-[20.5rem]">
                <Image
                  src="/images/people/neil-tomalin.jpg"
                  alt="Neil Tomalin, Director of International Strategy & School Development, Ellesmere College International"
                  fill
                  className="object-cover object-top"
                  sizes="328px"
                  priority
                />
              </div>
            </div>
            <p className="mt-4 font-jost text-sm tracking-wide text-[#C8A84B]">
              Neil Tomalin
              <span className="text-white/50"> · </span>
              <span className="text-white/70">
                Director of International Strategy &amp; School Development
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
