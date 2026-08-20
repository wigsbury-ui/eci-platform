'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { MAP_LOCATIONS } from '@/lib/content/network'

/** Map frame: Maghreb → Gulf */
const LON_MIN = -15
const LON_MAX = 62
const LAT_MIN = 10
const LAT_MAX = 38

function projectPct(lat: number, lng: number) {
  const left = ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * 100
  const top = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100
  return { left, top }
}

function projectSvg(lat: number, lng: number, w = 1000, h = 560) {
  return {
    x: ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * w,
    y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * h,
  }
}

function pathFromRing(ring: [number, number][]) {
  return (
    ring
      .map(([lat, lng], i) => {
        const { x, y } = projectSvg(lat, lng)
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

const STATUS_META = {
  open: {
    label: 'Operating',
    colour: '#34D399',
    soft: 'rgba(52, 211, 153, 0.35)',
  },
  opening: {
    label: 'Opening soon',
    colour: '#F0E4B0',
    soft: 'rgba(240, 228, 176, 0.4)',
  },
  expansion: {
    label: 'Expansion',
    colour: '#C8A84B',
    soft: 'rgba(200, 168, 75, 0.45)',
  },
} as const

/** Tighter zoom for Gulf cluster; wider for Maghreb / Egypt. */
function zoomForLocation(id: string) {
  if (
    ['abu-dhabi', 'doha', 'bahrain-north', 'bahrain-south', 'sohar', 'sharjah'].includes(
      id
    )
  )
    return 3.4
  if (['riyadh', 'jeddah'].includes(id)) return 2.6
  if (['new-cairo', 'october-sheikh-zayed'].includes(id)) return 2.5
  if (['rabat', 'bouskoura'].includes(id)) return 2.5
  return 2.3
}

function curvePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2
  const my = Math.min(a.y, b.y) - 40 - Math.abs(a.x - b.x) * 0.035
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`
}

export default function ExpansionSection({
  asModule = false,
  sectionId = 'expansion',
  ctaHref = '/#contact',
}: {
  asModule?: boolean
  sectionId?: string
  ctaHref?: string
}) {
  const [activeId, setActiveId] = useState('new-cairo')
  const [zoomed, setZoomed] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const points = useMemo(
    () =>
      MAP_LOCATIONS.map(loc => ({
        ...loc,
        ...projectPct(loc.lat, loc.lng),
        svg: projectSvg(loc.lat, loc.lng),
      })),
    []
  )

  const active = points.find(p => p.id === activeId) ?? points[0]
  const hub = points.find(p => p.id === 'riyadh')
  const scale = zoomed ? zoomForLocation(active.id) : 1

  const mapTransform = zoomed
    ? `translate(50%, 50%) scale(${scale}) translate(${-active.left}%, ${-active.top}%)`
    : 'translate(0, 0) scale(1)'

  const arcs = useMemo(() => {
    if (!hub) return []
    return points
      .filter(p => p.status === 'expansion')
      .map(p => ({
        id: p.id,
        d: curvePath(hub.svg, p.svg),
        active: p.id === activeId,
      }))
  }, [points, hub, activeId])

  const landPaths = useMemo(() => LAND_RINGS.map(pathFromRing), [])

  function selectLocation(id: string) {
    setActiveId(id)
    setZoomed(true)
  }

  return (
    <section
      id={sectionId}
      className={
        asModule
          ? 'home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#0E0A18] text-white py-16 md:py-20'
          : 'relative py-24 md:py-28 overflow-hidden bg-[#0E0A18] text-white'
      }
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgba(76,37,133,0.4), transparent 45%), radial-gradient(ellipse at 85% 90%, rgba(200,168,75,0.1), transparent 40%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
              Top 10 destinations
            </p>
            <h2
              className="font-cormorant font-semibold leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Where the network grows next
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mb-4" />
            <p className="text-white/70 font-jost leading-relaxed">
              Ten open growth markets ranked for demand, income fit, regulatory openness and cultural
              alignment with Ellesmere. Operating campuses stay on the map for context — select any
              destination to focus the region.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-xs font-jost">
            {(
              [
                ['open', 'Operating'],
                ['opening', 'Opening soon'],
                ['expansion', 'Top 10'],
              ] as const
            ).map(([key, label]) => (
              <span key={key} className="inline-flex items-center gap-2 text-white/70">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: STATUS_META[key].colour,
                    boxShadow: `0 0 12px ${STATUS_META[key].soft}`,
                  }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.55fr_0.95fr] gap-8 items-stretch">
          <div
            className={`relative rounded-sm border border-white/10 bg-[#120e1c] overflow-hidden min-h-[380px] transition-opacity duration-1000 ${
              asModule ? 'lg:min-h-[560px]' : 'lg:min-h-[480px]'
            } ${visible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div
              className="absolute inset-0 eci-map-stage"
              style={{ transform: mapTransform }}
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

                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={(1000 / 8) * i}
                    y1={0}
                    x2={(1000 / 8) * i}
                    y2={560}
                    stroke="rgba(255,255,255,0.035)"
                  />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1={0}
                    y1={(560 / 5) * i}
                    x2={1000}
                    y2={(560 / 5) * i}
                    stroke="rgba(255,255,255,0.035)"
                  />
                ))}

                {landPaths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="url(#landFill)"
                    stroke="rgba(200,168,75,0.28)"
                    strokeWidth="1.5"
                  />
                ))}

                {arcs.map(arc => (
                  <path
                    key={arc.id}
                    d={arc.d}
                    fill="none"
                    stroke={arc.active ? '#C8A84B' : 'rgba(200,168,75,0.22)'}
                    strokeWidth={arc.active ? 2 : 1.2}
                    strokeDasharray="5 7"
                    className="eci-map-arc"
                    opacity={zoomed && !arc.active ? 0.25 : arc.active ? 1 : 0.7}
                  />
                ))}
              </svg>

              <div className="absolute inset-0">
                {points.map((p, i) => {
                  const meta = STATUS_META[p.status]
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
                        animationDelay: `${150 + i * 80}ms`,
                        zIndex: selected ? 40 : 10,
                        opacity: dimmed ? 0.35 : 1,
                      }}
                      aria-label={`${p.shortName}, ${meta.label}`}
                      aria-pressed={selected}
                    >
                      {selected && (
                        <>
                          <span
                            className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full eci-map-ripple"
                            style={{ border: `1px solid ${meta.colour}` }}
                          />
                          <span
                            className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full eci-map-ripple eci-map-ripple-2"
                            style={{ border: `1px solid ${meta.colour}` }}
                          />
                        </>
                      )}
                      <span
                        className={`relative block rounded-full transition-transform duration-300 ${
                          selected ? 'scale-150' : 'scale-100 group-hover:scale-125'
                        }`}
                        style={{
                          width: selected ? 16 : 11,
                          height: selected ? 16 : 11,
                          background: meta.colour,
                          boxShadow: selected
                            ? `0 0 0 4px rgba(14,10,24,0.9), 0 0 28px ${meta.soft}`
                            : `0 0 0 3px rgba(14,10,24,0.85), 0 0 14px ${meta.soft}`,
                        }}
                      />
                      {/* Labels only for selected pin (or hover) to avoid Gulf-cluster collisions */}
                      <span
                        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap font-jost text-sm font-semibold tracking-wide px-2 py-0.5 transition-opacity duration-200 ${
                          selected
                            ? 'opacity-100 text-white bg-[#0E0A18]/85'
                            : 'opacity-0 group-hover:opacity-100 text-white bg-[#0E0A18]/90 z-50'
                        }`}
                      >
                        {p.rank ? `#${p.rank} ` : ''}
                        {p.shortName}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 z-40 pointer-events-none">
              <p className="text-[10px] font-jost text-white/35 tracking-wide">
                {zoomed
                  ? `Focused on ${active.shortName}`
                  : 'Middle East & North Africa · illustrative'}
              </p>
              <button
                type="button"
                onClick={() => setZoomed(z => !z)}
                className="pointer-events-auto text-[11px] font-jost font-semibold px-3 py-1.5 border border-white/20 bg-[#0E0A18]/80 text-white/80 hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
              >
                {zoomed ? 'Show full region' : 'Zoom to selection'}
              </button>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="flex-1 border border-white/10 bg-[#171225]/95 p-7 md:p-8 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-1 h-full transition-colors duration-300"
                style={{ background: STATUS_META[active.status].colour }}
              />
              <p
                className="text-[10px] font-jost font-semibold tracking-[0.25em] uppercase mb-3"
                style={{ color: STATUS_META[active.status].colour }}
              >
                {active.rank
                  ? `Priority #${active.rank} · ${STATUS_META[active.status].label}`
                  : STATUS_META[active.status].label}
              </p>
              <h3 className="font-cormorant text-3xl text-white mb-2 leading-tight">
                {active.name}
              </h3>
              <p className="text-white/45 text-sm font-jost mb-5">{active.shortName}</p>
              <p className="text-white/70 font-jost leading-relaxed mb-8">{active.detail}</p>

              <div className="flex flex-wrap gap-2 mb-8 max-h-36 overflow-y-auto">
                {points
                  .filter(p => p.status === 'expansion')
                  .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                  .map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectLocation(p.id)}
                      className={`px-3 py-1.5 text-xs font-jost border transition-colors ${
                        p.id === activeId
                          ? 'border-[#C8A84B] text-[#C8A84B] bg-[#C8A84B]/10'
                          : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white'
                      }`}
                    >
                      {p.rank ? `${p.rank}. ` : ''}
                      {p.shortName}
                    </button>
                  ))}
              </div>

              {active.status === 'expansion' ? (
                <Link
                  href={ctaHref}
                  className="inline-flex bg-[#C8A84B] text-[#2D1654] px-6 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
                >
                  Partner on this market
                </Link>
              ) : (
                <Link
                  href={ctaHref}
                  className="inline-flex bg-[#C8A84B] text-[#2D1654] px-6 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
                >
                  Explore open growth markets
                </Link>
              )}
            </div>

            <ul className="grid grid-cols-3 gap-2 text-center">
              {[
                { n: points.filter(p => p.status === 'open').length, l: 'Open' },
                { n: points.filter(p => p.status === 'opening').length, l: 'Soon' },
                { n: 10, l: 'Top 10' },
              ].map(stat => (
                <li key={stat.l} className="border border-white/10 bg-white/[0.03] py-3">
                  <p className="font-cormorant text-2xl text-[#C8A84B]">{stat.n}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/45 font-jost">
                    {stat.l}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
