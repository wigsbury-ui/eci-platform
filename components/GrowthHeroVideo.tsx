'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

const VIDEO_SRC = '/videos/investor-intro.mp4'
const POSTER_SRC = '/images/schools/doha-horizon.jpg'

export default function GrowthHeroVideo() {
  const [open, setOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const close = useCallback(() => {
    const el = videoRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const el = videoRef.current
    if (!el) return
    const play = async () => {
      try {
        await el.play()
      } catch {
        /* Autoplay may require a gesture; click already opened the modal. */
      }
    }
    void play()
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full max-w-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A84B] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label="Play introducing Ellesmere College International — 90 second video"
      >
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#1A1228]/55 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="relative aspect-video overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={POSTER_SRC}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1228]/90 via-[#2D1654]/35 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C8A84B] text-[#2D1654] shadow-lg transition group-hover:scale-105 group-hover:bg-[#F0E4B0]">
                <Play size={28} fill="currentColor" className="ml-1" />
              </span>
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="font-cormorant text-xl font-semibold leading-snug text-white sm:text-2xl">
              Introducing Ellesmere College International
            </p>
            <p className="mt-1 font-jost text-sm text-[#C8A84B]">90 second video</p>
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1228]/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Introducing Ellesmere College International"
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black"
              controls
              playsInline
              preload="auto"
              poster={POSTER_SRC}
              src={VIDEO_SRC}
            />
          </div>
        </div>
      )}
    </>
  )
}
