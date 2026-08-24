type MapRegion = 'riyadh' | 'doha' | 'uk'

type Pin = { x: number; y: number; active?: boolean }

const REGION_PINS: Record<MapRegion, Pin[]> = {
  riyadh: [
    { x: 38, y: 58, active: false },
    { x: 52, y: 32, active: false },
  ],
  doha: [{ x: 68, y: 42, active: true }],
  uk: [{ x: 34, y: 38, active: true }],
}

const LAND_PATHS: Record<MapRegion, string> = {
  riyadh:
    'M18 52 C28 44 42 38 58 40 C72 42 82 48 88 56 C84 64 72 70 56 72 C40 74 24 68 18 52 Z',
  doha:
    'M12 58 C22 42 38 34 58 36 C78 38 92 48 96 58 C90 68 76 74 58 76 C38 78 18 70 12 58 Z',
  uk:
    'M14 54 C24 38 42 30 62 32 C82 34 94 44 96 56 C88 68 72 76 52 78 C32 80 16 68 14 54 Z',
}

function regionForSchool(id: string): MapRegion {
  if (id === 'riyadh' || id === 'riyadh-salwa') return 'riyadh'
  if (id === 'doha') return 'doha'
  return 'uk'
}

function pinsForSchool(schoolId: string, region: MapRegion): Pin[] {
  const pins = REGION_PINS[region]
  if (region !== 'riyadh') return pins

  if (schoolId === 'riyadh') {
    return [
      { x: 38, y: 58, active: true },
      { x: 52, y: 32, active: false },
    ]
  }
  return [
    { x: 38, y: 58, active: false },
    { x: 52, y: 32, active: true },
  ]
}

export default function NetworkLocationInset({ schoolId }: { schoolId: string }) {
  const region = regionForSchool(schoolId)
  const pins = pinsForSchool(schoolId, region)

  return (
    <svg
      viewBox="0 0 100 80"
      className="w-full h-full"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id={`map-bg-${schoolId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1228" />
          <stop offset="100%" stopColor="#2D1654" />
        </linearGradient>
        <radialGradient id={`map-glow-${schoolId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8A84B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C8A84B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="80" fill={`url(#map-bg-${schoolId})`} />
      <circle cx="50" cy="40" r="36" fill={`url(#map-glow-${schoolId})`} />
      <path
        d={LAND_PATHS[region]}
        fill="#4C2585"
        fillOpacity="0.55"
        stroke="#C8A84B"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      {pins.map((pin, i) => (
        <g key={i}>
          {pin.active && (
            <circle cx={pin.x} cy={pin.y} r="7" fill="#C8A84B" fillOpacity="0.22" />
          )}
          <circle
            cx={pin.x}
            cy={pin.y}
            r={pin.active ? 3.2 : 2.2}
            fill={pin.active ? '#C8A84B' : '#EDE5F7'}
            fillOpacity={pin.active ? 1 : 0.45}
          />
        </g>
      ))}
    </svg>
  )
}
