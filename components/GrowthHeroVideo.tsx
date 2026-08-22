'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

const DEFAULT_VIDEO_SRC = '/videos/investor-intro.mp4'
const DEFAULT_POSTER_SRC = '/videos/investor-intro-poster.jpg'
const POSTER_FALLBACK = '/images/schools/doha-horizon.jpg'

type GrowthHeroVideoProps = {
  /** card = titled hero tile; frame = video + play only (for module placeholders). */
  variant?: 'card' | 'frame'
  className?: string
  videoSrc?: string
  posterSrc?: string
  title?: string
  durationLabel?: string
}

export default function GrowthHeroVideo({
  variant = 'card',
  className = '',
  videoSrc = DEFAULT_VIDEO_SRC,
  posterSrc = DEFAULT_POSTER_SRC,
  title = 'Introducing Ellesmere College International',
  durationLabel = '90 second video',
}: GrowthHeroVideoProps) {
  const [open, setOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isFrame = variant === 'frame'

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
        className={`group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A84B] focus-visible:ring-offset-2 ${
          className || (isFrame ? '' : 'max-w-xl')
        }`}
        aria-label={`Play ${title}`}
      >
        <div
          className={`overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ${
            isFrame
              ? 'border border-[#2D1654]/12 bg-black'
              : 'border border-white/35 bg-[#2D1654] shadow-black/50'
          }`}
        >
          <div className="relative aspect-video overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterSrc}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              onError={e => {
                const img = e.currentTarget
                if (img.src.endsWith(POSTER_FALLBACK)) return
                img.src = POSTER_FALLBACK
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C8A84B] text-[#2D1654] shadow-lg transition group-hover:scale-105 group-hover:bg-[#F0E4B0]">
                <Play size={28} fill="currentColor" className="ml-1" />
              </span>
            </span>
          </div>
          {!isFrame && (
            <div className="px-5 py-4">
              <p className="font-cormorant whitespace-nowrap text-lg font-semibold leading-none text-white sm:text-xl">
                {title}
              </p>
              <p className="mt-1.5 font-jost text-sm text-[#C8A84B]">{durationLabel}</p>
            </div>
          )}
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
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
              poster={posterSrc}
              src={videoSrc}
            />
          </div>
        </div>
      )}
    </>
  )
}
