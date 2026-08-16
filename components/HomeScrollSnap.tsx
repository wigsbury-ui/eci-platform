'use client'

import { useEffect } from 'react'

/**
 * Light scroll resistance between homepage full-viewport windows.
 * Accumulates small wheel deltas near a window edge, then snaps flush
 * to the next/prev window (top of frame — fixed nav overlays the panel).
 */
export default function HomeScrollSnap() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    if (!mq.matches) return

    const THRESHOLD = 72
    const COOLDOWN_MS = 720
    let intent = 0
    let cooling = false
    let cooldownTimer = 0

    const windows = () =>
      Array.from(document.querySelectorAll<HTMLElement>('main.home-snap > section.home-window'))

    const sectionTop = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      return rect.top + window.scrollY
    }

    const nearestIndex = (list: HTMLElement[]) => {
      const y = window.scrollY
      let best = 0
      let bestDist = Infinity
      list.forEach((el, i) => {
        const d = Math.abs(sectionTop(el) - y)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    }

    const nearEdge = (el: HTMLElement, dir: 1 | -1) => {
      const top = sectionTop(el)
      const bottom = top + el.offsetHeight
      const viewTop = window.scrollY
      const viewBottom = window.scrollY + window.innerHeight
      if (dir > 0) return viewBottom > bottom - window.innerHeight * 0.28
      return viewTop < top + window.innerHeight * 0.28
    }

    const snapTo = (el: HTMLElement) => {
      cooling = true
      intent = 0
      // Scroll exactly to section top so the window fills the frame (no top strip)
      window.scrollTo({ top: Math.max(0, sectionTop(el)), behavior: 'smooth' })
      window.clearTimeout(cooldownTimer)
      cooldownTimer = window.setTimeout(() => {
        cooling = false
      }, COOLDOWN_MS)
    }

    const onWheel = (e: WheelEvent) => {
      if (!mq.matches || cooling || Math.abs(e.deltaY) < 1) return
      const list = windows()
      if (list.length < 2) return

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1
      const i = nearestIndex(list)
      const current = list[i]
      if (!current || !nearEdge(current, dir)) {
        intent = 0
        return
      }

      const target = list[i + dir]
      if (!target) {
        intent = 0
        return
      }

      intent += e.deltaY
      if (Math.abs(intent) < THRESHOLD) {
        // Soft resistance: damp the first part of a flick at the window edge
        if (Math.abs(e.deltaY) < 48) e.preventDefault()
        return
      }

      e.preventDefault()
      snapTo(target)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.clearTimeout(cooldownTimer)
    }
  }, [])

  return null
}
