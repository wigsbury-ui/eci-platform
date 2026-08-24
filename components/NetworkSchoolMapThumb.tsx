type MapRegion = 'riyadh' | 'doha' | 'uk'

type Pin = { lat: number; lng: number; active?: boolean }

const REGIONS: Record<
  MapRegion,
  { latMin: number; latMax: number; lonMin: number; lonMax: number; label: string }
> = {
  riyadh: {
    latMin: 24.62,
    latMax: 24.82,
    lonMin: 46.55,
    lonMax: 46.85,
    label: 'Riyadh region',
  },
  doha: {
    latMin: 24.2,
    latMax: 26.1,
    lonMin: 50.2,
    lonMax: 52.0,
    label: 'Qatar',
  },
  uk: {
    latMin: 51.6,
    latMax: 53.2,
    lonMin: -3.4,
    lonMax: -1.6,
    label: 'Shropshire',
  },
}

const RIYADH_PINS: Pin[] = [
  { lat: 24.692, lng: 46.674 },
  { lat: 24.758, lng: 46.715 },
]

function regionForSchool(id: string): MapRegion {
  if (id === 'riyadh' || id === 'riyadh-salwa') return 'riyadh'
  if (id === 'doha') return 'doha'
  return 'uk'
}

function project(
  lat: number,
  lng: number,
  region: MapRegion,
  width: number,
  height: number,
) {
  const bounds = REGIONS[region]
  const x = ((lng - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) * width
  const y = ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * height
  return { x, y }
}

export default function NetworkSchoolMapThumb({
  schoolId,
  lat,
  lng,
  locationLabel,
}: {
  schoolId: string
  lat: number
  lng: number
  locationLabel?: string
}) {
  const region = regionForSchool(schoolId)
  const bounds = REGIONS[region]
  const width = 120
  const height = 72
  const pins: Pin[] =
    region === 'riyadh'
      ? RIYADH_PINS.map(pin => ({
          ...pin,
          active: pin.lat === lat && pin.lng === lng,
        }))
      : [{ lat, lng, active: true }]

  return (
    <div className="mt-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto rounded-sm border border-[#2D1654]/12 bg-[#EDE5F7]/60"
        role="img"
        aria-label={`Map showing ${locationLabel ?? bounds.label}`}
      >
        <defs>
          <pattern id={`grid-${schoolId}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M 12 0 L 0 0 0 12"
              fill="none"
              stroke="#2D1654"
              strokeOpacity="0.06"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={width} height={height} fill={`url(#grid-${schoolId})`} />
        <rect
          x="8"
          y="10"
          width={width - 16}
          height={height - 20}
          rx="4"
          fill="#2D1654"
          fillOpacity="0.04"
        />
        {pins.map((pin, i) => {
          const { x, y } = project(pin.lat, pin.lng, region, width, height)
          const active = pin.active
          return (
            <g key={i}>
              {active && (
                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="#C8A84B"
                  fillOpacity="0.25"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={active ? 4.5 : 3}
                fill={active ? '#C8A84B' : '#2D1654'}
                fillOpacity={active ? 1 : 0.35}
              />
            </g>
          )
        })}
        {region === 'riyadh' && (
          <text
            x={width - 6}
            y={height - 4}
            textAnchor="end"
            className="fill-[#2D1654]/40"
            style={{ fontSize: 7, fontFamily: 'Jost, sans-serif' }}
          >
            N
          </text>
        )}
      </svg>
      {locationLabel && (
        <p className="mt-1.5 text-[10px] font-jost font-medium tracking-wide text-[#2D1654]/55 uppercase">
          {locationLabel}
        </p>
      )}
    </div>
  )
}
