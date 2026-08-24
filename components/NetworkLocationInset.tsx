type MapRegion = 'riyadh' | 'doha' | 'uk'

type Pin = {
  x: number
  y: number
  active?: boolean
  label?: string
}

const LAND_PATHS: Record<MapRegion, string> = {
  riyadh:
    'M14 54 C24 42 38 36 54 38 C70 40 86 48 92 58 C86 68 72 74 54 76 C36 78 18 70 14 54 Z',
  doha:
    'M10 58 C20 40 38 32 58 34 C78 36 94 46 98 58 C92 70 76 76 58 78 C36 80 14 72 10 58 Z',
  uk:
    'M12 56 C22 38 40 30 60 32 C80 34 94 44 96 56 C88 68 72 76 52 78 C32 80 14 70 12 56 Z',
}

function regionForSchool(id: string): MapRegion {
  if (id === 'riyadh' || id === 'riyadh-salwa') return 'riyadh'
  if (id === 'doha') return 'doha'
  return 'uk'
}

function pinsForSchool(schoolId: string, region: MapRegion): Pin[] {
  if (region === 'riyadh') {
    const hamra: Pin = { x: 40, y: 62, label: 'Hamra' }
    const salwa: Pin = { x: 54, y: 30, label: 'Salwa' }
    if (schoolId === 'riyadh') {
      return [
        { ...hamra, active: true },
        { ...salwa, active: false },
      ]
    }
    return [
      { ...hamra, active: false },
      { ...salwa, active: true },
    ]
  }
  if (region === 'doha') {
    return [{ x: 62, y: 44, active: true, label: 'Doha' }]
  }
  return [{ x: 38, y: 40, active: true, label: 'UK' }]
}

export default function NetworkLocationInset({ schoolId }: { schoolId: string }) {
  const region = regionForSchool(schoolId)
  const pins = pinsForSchool(schoolId, region)

  return (
    <svg
      viewBox="0 0 120 88"
      className="w-full h-full"
      role="img"
      aria-label={`Location map for ${schoolId}`}
    >
      <rect width="120" height="88" fill="#F8F4EF" />
      <rect x="0.5" y="0.5" width="119" height="87" fill="none" stroke="#2D1654" strokeOpacity="0.12" />

      <path
        d={LAND_PATHS[region]}
        fill="#EDE5F7"
        stroke="#2D1654"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {region === 'riyadh' && (
        <text
          x="108"
          y="12"
          textAnchor="middle"
          fill="#2D1654"
          fillOpacity="0.5"
          style={{ fontSize: 8, fontFamily: 'Jost, sans-serif', fontWeight: 700 }}
        >
          N
        </text>
      )}

      {pins.map((pin, i) => (
        <g key={i}>
          {pin.active && (
            <circle cx={pin.x} cy={pin.y} r="9" fill="#C8A84B" fillOpacity="0.35" />
          )}
          <circle
            cx={pin.x}
            cy={pin.y}
            r={pin.active ? 4.5 : 3}
            fill={pin.active ? '#2D1654' : '#2D1654'}
            fillOpacity={pin.active ? 1 : 0.28}
          />
          {pin.active && (
            <circle
              cx={pin.x}
              cy={pin.y}
              r="4.5"
              fill="none"
              stroke="#C8A84B"
              strokeWidth="1.2"
            />
          )}
          {pin.label && pin.active && (
            <text
              x={pin.x}
              y={pin.y + 14}
              textAnchor="middle"
              fill="#2D1654"
              style={{ fontSize: 7.5, fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
            >
              {pin.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
