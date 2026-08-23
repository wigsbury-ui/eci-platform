'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { growthMarketsForMap } from '@/lib/content/expansion-markets'

/** Map frame: Maghreb → Gulf */
const LON_MIN = -15
const LON_MAX = 62
const LAT_MIN = 10
const LAT_MAX = 38

const GROWTH_COLOUR = '#C8A84B'
const GROWTH_SOFT = 'rgba(200, 168, 75, 0.45)'

function projectPct(lat: number, lng: number) {
  const left = ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * 100
  const top = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100
  return { left, top }
}

function pathFromRing(ring: [number, number][]) {
  return (
    ring
      .map(([lat, lng], i) => {
        const x = ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * 1000
        const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 560
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ') + ' Z'
  )
}

const LAND_RINGS: [number, number][][] = [
  [
    [35.9, -5.8],
    [36.8, 3.0],
    [37.0, 10.2],
    [33.0, 11.5],
    [32.9, 22.0],
    [31.5, 27.0],
    [31.2, 32.3],
    [29.5, 34.9],
    [27.5, 33.8],
    [23.0, 35.5],
    [18.0, 38.0],
    [15.0, 40.0],
    [12.5, 43.0],
    [12.0, 36.0],
    [15.0, 25.0],
    [18.0, 12.0],
    [20.0, 0.0],
    [22.0, -12.0],
    [27.0, -13.2],
    [32.0, -9.5],
    [35.0, -6.5],
  ],
  [
    [29.5, 35.0],
    [31.5, 37.0],
    [34.5, 36.0],
    [36.5, 37.5],
    [37.0, 40.0],
    [36.0, 44.0],
    [33.0, 45.0],
    [30.0, 48.5],
    [29.0, 48.0],
    [26.0, 50.5],
    [25.0, 51.5],
    [24.5, 54.5],
    [25.5, 56.5],
    [26.5, 56.3],
    [24.0, 57.0],
    [22.5, 59.5],
    [18.0, 57.0],
    [16.0, 52.0],
    [14.0, 48.0],
    [12.5, 44.5],
    [16.0, 42.0],
    [20.0, 39.0],
    [24.0, 37.0],
    [27.0, 35.5],
  ],
]

function zoomForLocation(id: string) {
  if (['abu-dhabi', 'bahrain-north', 'bahrain-south', 'sohar', 'sharjah'].includes(id)) return 1.85
  if (id === 'jeddah') return 1.75
  if (['new-cairo', 'october-sheikh-zayed', 'rabat', 'bouskoura'].includes(id)) return 1.7
  return 1.65
}

export default function ExpansionSection({
  asModule = false,
  sectionId = 'growth-markets',
  ctaHref = '/#contact',
}: {
  asModule?: boolean
  sectionId?: string
  ctaHref?: string
}) {
  const markets = useMemo(() => growthMarketsForMap(), [])
  const [activeId, setActiveId] = useState(markets[0]?.id ?? '')
  const [zoomed, setZoomed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const points = useMemo(
    () =>
      markets.map((loc, i) => ({
        ...loc,
        ...projectPct(loc.lat, loc.lng),
        index: i,
      })),
    [markets]
  )

  const active = points.find(p => p.id === activeId) ?? points[0]
  const scale = zoomed && active ? zoomForLocation(active.id) : 1

  const mapTransform =
    zoomed && active
      ? `translate(50%, 50%) scale(${scale}) translate(${-active.left}%, ${-active.top}%)`
      : 'translate(0, 0) scale(1)'

  const landPaths = useMemo(() => LAND_RINGS.map(pathFromRing), [])

  function selectLocation(id: string) {
    setActiveId(id)
    setZoomed(true)
  }

  if (!active) return null

  const mapHeight = asModule ? 'min(200px, 24vh)' : 'min(280px, 36vh)'

  return (
    <section
      id={sectionId}
      className={
        asModule
          ? 'home-window relative flex flex-col justify-center items-center overflow-hidden bg-[#0E0A18] text-white min-h-[calc(100svh-var(--eci-nav-offset))] max-h-[calc(100svh-var(--eci-nav-offset))] py-6 md:py-8'
          : 'relative py-20 md:py-24 overflow-hidden bg-[#0E0A18] text-white'
      }
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 20%, rgba(76,37,133,0.45), transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(200,168,75,0.08), transparent 45%)',
        }}
      />

      <div
        className={`relative w-full max-w-3xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <header className="mb-4 md:mb-5 w-full">
          <p className="text-[#C8A84B] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-2 font-jost font-bold">
            Growth markets
          </p>
          <h2
            className="font-cormorant font-semibold leading-tight mb-2"
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)' }}
          >
            Where the network grows next
          </h2>
          <p className="text-white/60 font-jost text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            {points.length} open markets across the Middle East and North Africa.
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-[10px] sm:text-xs font-jost text-white/50">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: GROWTH_COLOUR, boxShadow: `0 0 8px ${GROWTH_SOFT}` }}
            />
            Open for partners
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 md:mb-5 max-w-2xl">
          {points.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectLocation(p.id)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-jost border transition-colors ${
                p.id === activeId
                  ? 'border-[#C8A84B] text-[#C8A84B] bg-[#C8A84B]/10'
                  : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white'
              }`}
            >
              {p.shortName}
            </button>
          ))}
        </div>

        <div className="w-full max-w-2xl grid sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
          <div
            className="relative rounded-sm border border-white/10 bg-[#120e1c] overflow-hidden w-full"
            style={{ height: mapHeight }}
          >
            <div
              className="absolute inset-0 eci-map-stage"
              style={{ transform: mapTransform, transformOrigin: '50% 50%' }}
            >
              <svg
                viewBox="0 0 1000 560"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                <defs>
                  <radialGradient id="ocean" cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="#1a1430" />
                    <stop offset="100%" stopColor="#0a0712" />
                  </radialGradient>
                  <linearGradient id="landFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3d2468" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#2a1848" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
                <rect width="1000" height="560" fill="url(#ocean)" />
                {landPaths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="url(#landFill)"
                    stroke="rgba(200,168,75,0.28)"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>

              <div className="absolute inset-0">
                {points.map(p => {
                  const selected = p.id === activeId
                  const dimmed = zoomed && !selected
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectLocation(p.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none eci-map-pin"
                      style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        animationDelay: `${150 + p.index * 60}ms`,
                        zIndex: selected ? 40 : 10,
                        opacity: dimmed ? 0.45 : 1,
                      }}
                      aria-label={`${p.shortName}, open for partners`}
                      aria-pressed={selected}
                    >
                      {selected && (
                        <span
                          className="absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full eci-map-ripple"
                          style={{ border: `1px solid ${GROWTH_COLOUR}` }}
                        />
                      )}
                      <span
                        className={`relative block rounded-full transition-transform duration-300 ${
                          selected ? 'scale-125' : 'scale-100 group-hover:scale-110'
                        }`}
                        style={{
                          width: selected ? 11 : 8,
                          height: selected ? 11 : 8,
                          background: GROWTH_COLOUR,
                          boxShadow: selected
                            ? `0 0 0 2px rgba(14,10,24,0.9), 0 0 14px ${GROWTH_SOFT}`
                            : `0 0 0 2px rgba(14,10,24,0.85), 0 0 8px ${GROWTH_SOFT}`,
                        }}
                      />
                      {selected && (
                        <span
                          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap font-jost text-[10px] font-semibold text-white bg-[#0E0A18]/90 px-1.5 py-0.5"
                        >
                          {p.shortName}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-2 z-40">
              <p className="text-[9px] font-jost text-white/35 truncate">
                {zoomed ? active.shortName : 'MENA'}
              </p>
              <button
                type="button"
                onClick={() => setZoomed(z => !z)}
                className="text-[9px] font-jost font-semibold px-2 py-0.5 border border-white/20 bg-[#0E0A18]/85 text-white/75 hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors shrink-0"
              >
                {zoomed ? 'Show all' : 'Zoom in'}
              </button>
            </div>
          </div>

          <aside
            className="border border-white/10 bg-[#171225]/95 p-4 sm:p-5 relative text-left flex flex-col"
          >
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ background: GROWTH_COLOUR }}
            />
            <p
              className="text-[9px] sm:text-[10px] font-jost font-semibold tracking-[0.2em] uppercase mb-1.5"
              style={{ color: GROWTH_COLOUR }}
            >
              {active.country}
            </p>
            <h3 className="font-cormorant text-xl sm:text-2xl text-white mb-2 leading-tight">
              {active.name}
            </h3>
            <p className="text-white/65 font-jost text-xs sm:text-sm leading-relaxed mb-4 flex-1">
              {active.detail}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex self-start bg-[#C8A84B] text-[#2D1654] px-4 py-2 font-jost font-semibold text-xs sm:text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Partner on this market
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
