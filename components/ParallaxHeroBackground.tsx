'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  alt: string
  /** How strongly the background lags behind scroll (0–1). */
  strength?: number
  priority?: boolean
  className?: string
}

/**
 * Full-bleed hero background that drifts slower than page scroll,
 * giving a mild spatial-depth (parallax) effect as the user leaves the hero.
 */
export default function ParallaxHeroBackground({
  src,
  alt,
  strength = 0.35,
  priority = false,
  className = '',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReduceMotion(mq.matches)
    syncMotion()
    mq.addEventListener('change', syncMotion)
    return () => mq.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setOffset(0)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const el = rootRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Only shift while the hero is crossing the viewport.
      const scrolled = Math.min(Math.max(-rect.top, 0), rect.height)
      setOffset(scrolled * strength)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reduceMotion, strength])

  return (
    <div ref={rootRef} className={`absolute inset-0 overflow-hidden ${className}`.trim()} aria-hidden>
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          // Scale so translated edges never flash empty.
          transform: `translate3d(0, ${offset}px, 0) scale(1.12)`,
          transformOrigin: 'center top',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  )
}
