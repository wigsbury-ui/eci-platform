'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { MAP_LOCATIONS } from '@/lib/content/network'

const LON_MIN = -12
const LON_MAX = 64
const LAT_MIN = 12
const LAT_MAX = 38
const W = 1000
const H = 560

function project(lat: number, lng: number) {
  const x = ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * W
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H
  return { x, y }
}

const STATUS_META = {
  open: {
    label: 'Operating',
    colour: '#34D399',
    ring: 'rgba(52, 211, 153, 0.45)',
  },
  opening: {
    label: 'Opening soon',
    colour: '#F0E4B0',
    ring: 'rgba(240, 228, 176, 0.45)',
  },
  expansion: {
    label: 'Expansion',
    colour: '#C8A84B',
    ring: 'rgba(200, 168, 75, 0.5)',
  },
} as const

/** Simplified MENA land silhouettes for atmosphere (not cartographically exact). */
const LAND_PATHS = [
  // North Africa band
  'M40,210 C90,180 150,175 210,190 C280,210 320,230 380,250 C430,265 470,280 510,300 C480,340 430,360 370,355 C300,348 230,330 170,310 C110,290 60,260 40,210 Z',
  // Arabia / Levant mass
  'M520,160 C560,140 610,145 650,170 C700,205 730,250 760,300 C790,350 800,390 770,420 C730,450 680,445 640,410 C600,375 575,330 555,280 C540,240 525,195 520,160 Z',
  // Gulf / Oman tip
  'M780,300 C820,285 860,295 890,330 C910,360 905,395 875,410 C845,425 810,410 790,380 C775,350 772,320 780,300 Z',
  // Maghreb west
  'M30,250 C70,230 95,250 110,290 C95,330 60,340 35,310 C20,285 18,265 30,250 Z',
]

function curvePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2
  const my = Math.min(a.y, b.y) - 55 - Math.abs(a.x - b.x) * 0.04
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`
}

export default function ExpansionSection() {
  const [activeId, setActiveId] = useState<string>('egypt')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const points = useMemo(
    () =>
      MAP_LOCATIONS.map(loc => ({
        ...loc,
        ...project(loc.lat, loc.lng),
      })),
    []
  )

  const active = points.find(p => p.id === activeId) ?? points[0]
  const hub = points.find(p => p.id === 'riyadh')
  const arcs = useMemo(() => {
    if (!hub) return []
    return points
      .filter(p => p.id !== hub.id && p.status === 'expansion')
      .map(p => ({ id: p.id, d: curvePath(hub, p), active: p.id === activeId }))
  }, [points, hub, activeId])

  return (
    <section id="expansion" className="relative py-24 md:py-28 overflow-hidden bg-[#0E0A18] text-white">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(76,37,133,0.35), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(200,168,75,0.12), transparent 45%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-2xl">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
              Where we are going
            </p>
            <h2
              className="font-cormorant font-light leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Expansion in motion
            </h2>
            <p className="text-white/60 font-jost leading-relaxed">
              Live campuses, openings ahead, and priority markets across the Middle East and North
              Africa. Select a point to explore each opportunity.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-jost">
            {(
              [
                ['open', 'Operating'],
                ['opening', 'Opening soon'],
                ['expansion', 'Expansion'],
              ] as const
            ).map(([key, label]) => (
              <span key={key} className="inline-flex items-center gap-2 text-white/65">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: STATUS_META[key].colour, boxShadow: `0 0 10px ${STATUS_META[key].ring}` }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.55fr_0.95fr] gap-8 items-stretch">
          <div
            className={`relative rounded-sm border border-white/10 bg-[#14101f]/80 overflow-hidden transition-all duration-1000 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto min-h-[320px]"
              role="img"
              aria-label="Map of Ellesmere College International campuses and expansion markets"
            >
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#4C2585" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0E0A18" stopOpacity="0" />
                </radialGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width={W} height={H} fill="url(#mapGlow)" />

              {LAND_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="rgba(76,37,133,0.22)"
                  stroke="rgba(200,168,75,0.18)"
                  strokeWidth="1.2"
                />
              ))}

              {/* Latitude hints */}
              {[0.25, 0.5, 0.75].map(t => (
                <line
                  key={t}
                  x1={40}
                  x2={W - 40}
                  y1={H * t}
                  y2={H * t}
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="4 10"
                />
              ))}

              {arcs.map((arc, i) => (
                <path
                  key={arc.id}
                  d={arc.d}
                  fill="none"
                  stroke={arc.active ? '#C8A84B' : 'rgba(200,168,75,0.28)'}
                  strokeWidth={arc.active ? 1.8 : 1}
                  strokeDasharray="6 8"
                  className="eci-map-arc"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              ))}

              {points.map((p, i) => {
                const meta = STATUS_META[p.status]
                const selected = p.id === activeId
                return (
                  <g
                    key={p.id}
                    transform={`translate(${p.x}, ${p.y})`}
                    className="cursor-pointer eci-map-marker"
                    style={{ animationDelay: `${180 + i * 90}ms` }}
                    onClick={() => setActiveId(p.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveId(p.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${p.shortName}, ${meta.label}`}
                  >
                    <circle
                      r={selected ? 28 : 22}
                      fill="none"
                      stroke={meta.ring}
                      strokeWidth="1"
                      className="eci-map-pulse"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    />
                    <circle
                      r={selected ? 18 : 14}
                      fill="none"
                      stroke={meta.ring}
                      strokeWidth="1"
                      className="eci-map-pulse eci-map-pulse-delay"
                      style={{ animationDelay: `${i * 0.4 + 0.6}s` }}
                    />
                    <circle
                      r={selected ? 7 : 5.5}
                      fill={meta.colour}
                      filter="url(#softGlow)"
                      className="transition-all duration-300"
                    />
                    <circle r={2.2} fill="#fff" opacity={0.9} />
                    <text
                      y={selected ? -18 : -14}
                      textAnchor="middle"
                      className="fill-white font-jost"
                      style={{
                        fontSize: selected ? 13 : 11,
                        fontWeight: 500,
                        opacity: selected ? 1 : 0.75,
                      }}
                    >
                      {p.shortName}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <aside className="flex flex-col">
            <div className="flex-1 border border-white/10 bg-[#171225]/90 p-7 md:p-8 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ background: STATUS_META[active.status].colour }}
              />
              <p
                className="text-[10px] font-jost font-semibold tracking-[0.25em] uppercase mb-3"
                style={{ color: STATUS_META[active.status].colour }}
              >
                {STATUS_META[active.status].label}
              </p>
              <h3 className="font-cormorant text-3xl text-white mb-2 leading-tight">
                {active.name}
              </h3>
              <p className="text-white/45 text-sm font-jost mb-5">{active.shortName}</p>
              <p className="text-white/70 font-jost leading-relaxed mb-8">{active.detail}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {points
                  .filter(p => p.status === 'expansion')
                  .map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveId(p.id)}
                      className={`px-3 py-1.5 text-xs font-jost border transition-colors ${
                        p.id === activeId
                          ? 'border-[#C8A84B] text-[#C8A84B] bg-[#C8A84B]/10'
                          : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white'
                      }`}
                    >
                      {p.shortName}
                    </button>
                  ))}
              </div>

              <Link
                href="/investors"
                className="inline-flex bg-[#C8A84B] text-[#2D1654] px-6 py-3 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                Partner on this market
              </Link>
            </div>

            <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { n: points.filter(p => p.status === 'open').length, l: 'Open' },
                { n: points.filter(p => p.status === 'opening').length, l: 'Soon' },
                { n: points.filter(p => p.status === 'expansion').length, l: 'Targets' },
              ].map(stat => (
                <li key={stat.l} className="border border-white/10 bg-white/[0.03] py-3">
                  <p className="font-cormorant text-2xl text-[#C8A84B]">{stat.n}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/45 font-jost">{stat.l}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
