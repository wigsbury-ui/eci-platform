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

const MAP_HEIGHT = 'min(320px, 42vh)'

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

/** Moderate zoom — keeps the pin visible without blowing past the map frame. */
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

  return (
    <section
      id={sectionId}
      className={
        asModule
          ? 'relative overflow-hidden bg-[#0E0A18] text-white py-14 md:py-16'
          : 'relative py-20 md:py-24 overflow-hidden bg-[#0E0A18] text-white'
      }
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgba(76,37,133,0.4), transparent 45%), radial-gradient(ellipse at 85% 90%, rgba(200,168,75,0.1), transparent 40%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div
          className={`mb-8 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                Growth markets
              </p>
              <h2
                className="font-cormorant font-semibold leading-tight mb-3"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
              >
                Where the network grows next
              </h2>
              <p className="text-white/65 font-jost text-sm leading-relaxed max-w-xl">
                {points.length} open markets across the Middle East and North Africa. Select a pin
                or a name below — operating campuses are covered elsewhere on the site.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-jost text-white/60 shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: GROWTH_COLOUR, boxShadow: `0 0 8px ${GROWTH_SOFT}` }}
              />
              Open for partners
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {points.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectLocation(p.id)}
                className={`px-2.5 py-1 text-xs font-jost border transition-colors ${
                  p.id === activeId
                    ? 'border-[#C8A84B] text-[#C8A84B] bg-[#C8A84B]/10'
                    : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white'
                }`}
              >
                {p.shortName}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`grid lg:grid-cols-2 gap-6 items-start transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="relative rounded-sm border border-white/10 bg-[#120e1c] overflow-hidden"
            style={{ height: MAP_HEIGHT }}
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
                          className="absolute left-1/2 top-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full eci-map-ripple"
                          style={{ border: `1px solid ${GROWTH_COLOUR}` }}
                        />
                      )}
                      <span
                        className={`relative block rounded-full transition-transform duration-300 ${
                          selected ? 'scale-125' : 'scale-100 group-hover:scale-110'
                        }`}
                        style={{
                          width: selected ? 12 : 9,
                          height: selected ? 12 : 9,
                          background: GROWTH_COLOUR,
                          boxShadow: selected
                            ? `0 0 0 3px rgba(14,10,24,0.9), 0 0 16px ${GROWTH_SOFT}`
                            : `0 0 0 2px rgba(14,10,24,0.85), 0 0 10px ${GROWTH_SOFT}`,
                        }}
                      />
                      {selected && (
                        <span
                          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap font-jost text-xs font-semibold text-white bg-[#0E0A18]/90 px-2 py-0.5"
                        >
                          {p.shortName}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 z-40">
              <p className="text-[10px] font-jost text-white/35">
                {zoomed ? `Focused on ${active.shortName}` : 'MENA · all growth markets'}
              </p>
              <button
                type="button"
                onClick={() => setZoomed(z => !z)}
                className="text-[10px] font-jost font-semibold px-2.5 py-1 border border-white/20 bg-[#0E0A18]/85 text-white/75 hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
              >
                {zoomed ? 'Show all' : 'Zoom in'}
              </button>
            </div>
          </div>

          <aside className="border border-white/10 bg-[#171225]/95 p-6 md:p-7 relative">
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ background: GROWTH_COLOUR }}
            />
            <p
              className="text-[10px] font-jost font-semibold tracking-[0.25em] uppercase mb-2"
              style={{ color: GROWTH_COLOUR }}
            >
              Growth market · {active.country}
            </p>
            <h3 className="font-cormorant text-2xl md:text-3xl text-white mb-2 leading-tight">
              {active.name}
            </h3>
            <p className="text-white/70 font-jost text-sm leading-relaxed mb-6">{active.detail}</p>
            <Link
              href={ctaHref}
              className="inline-flex bg-[#C8A84B] text-[#2D1654] px-5 py-2.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Partner on this market
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
