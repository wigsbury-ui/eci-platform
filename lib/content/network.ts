/** Canonical public network content for ECI, used when DB is empty or as seed source of truth. */

import {
  expansionPinDestinations,
  TOP_DESTINATIONS,
} from '@/lib/content/expansion-markets'

export type NetworkSchoolCard = {
  id: string
  name: string
  city: string
  country: string
  status: 'active' | 'setting_up' | 'prospect' | 'heritage'
  short_bio: string
  description: string
  curriculum: string[]
  year_joined?: number
  website?: string
  href?: string
  image: string
  highlight?: string
  /** Short location line for cards (e.g. Al Hamra, central Riyadh). */
  locationLabel?: string
  mapLat?: number
  mapLng?: number
}

export type PartnerSchoolCard = Omit<NetworkSchoolCard, 'status'> & {
  status: Exclude<NetworkSchoolCard['status'], 'heritage'>
}

export const HERITAGE_CAMPUS: NetworkSchoolCard = {
  id: 'shropshire',
  name: 'Ellesmere College',
  city: 'Ellesmere',
  country: 'United Kingdom',
  status: 'heritage',
  year_joined: 1884,
  website: 'https://www.ellesmere.com',
  image: '/images/campus/uk-160-acre.jpg',
  curriculum: ['GCSE', 'A Level', 'BTEC', 'Boarding'],
  highlight: 'Founded 1884, the source campus',
  locationLabel: 'Shropshire · United Kingdom',
  mapLat: 52.882,
  mapLng: -2.886,
  short_bio:
    'Founded 1884 in Shropshire — 160 acres and the source of every international campus.',
  description:
    'Ellesmere College, Shropshire, was founded in 1884. It remains the academic and pastoral source of Ellesmere College International. Curriculum quality, character education, and the Life:Ready ambition are carried by partner campuses.',
}

export const OPERATING_SCHOOLS: PartnerSchoolCard[] = [
  {
    id: 'riyadh',
    name: 'Ellesmere College Riyadh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    status: 'active',
    year_joined: 2024,
    website: 'https://ellesmerecollegeriyadh.com',
    image: '/images/schools/riyadh/exterior.jpg',
    curriculum: ['Early Years', 'IGCSE', 'IB Pathways', 'American Diploma'],
    highlight: 'Open now',
    locationLabel: 'Al Hamra · central Riyadh',
    mapLat: 24.692,
    mapLng: 46.674,
    short_bio:
      'Ages 3–18 in Al Hamra — British heritage, High Performance Learning, and a nurturing city-centre community.',
    description:
      'Ellesmere College Riyadh brings the Ellesmere educational philosophy to the Kingdom of Saudi Arabia through partnership with the Glory & Princeton International Schools Group. Pupils enjoy Early Years through pre-university pathways, with a focus on academic excellence, wellbeing, and character.',
  },
  {
    id: 'riyadh-salwa',
    name: 'Ellesmere College Riyadh, Salwa',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    status: 'active',
    year_joined: 2025,
    website: 'https://ellesmerecollegeriyadh.com',
    image: '/images/schools/riyadh-campus-full.webp',
    curriculum: ['Early Years', 'Primary', 'Secondary'],
    highlight: 'Open now',
    locationLabel: 'Salwa · north of Riyadh',
    mapLat: 24.758,
    mapLng: 46.715,
    short_bio:
      'North of central Riyadh — the same Ellesmere standards for families in the Salwa community.',
    description:
      'Ellesmere College Riyadh’s Salwa Compound campus is a second operating site in the Kingdom, delivering the same Ellesmere standards, High Performance Learning culture and Life:Ready ethos as the principal Riyadh campus.',
  },
]

export const OPENING_SOON: PartnerSchoolCard[] = [
  {
    id: 'doha',
    name: 'Ellesmere College Doha',
    city: 'Doha',
    country: 'Qatar',
    status: 'setting_up',
    image: '/images/schools/doha/lobby-windows.jpg',
    href: '/schools/doha',
    curriculum: ['Early Years', 'British Primary'],
    highlight: 'Opening soon',
    locationLabel: 'Doha · Qatar',
    mapLat: 25.2854,
    mapLng: 51.531,
    short_bio:
      'Purpose-built campus in Qatar — EYFS and Primary pathways with the Life:Ready ethos.',
    description:
      'Ellesmere College Doha is the newest addition to the Ellesmere international family, in partnership with the Education Avenue Group. The purpose-built campus offers British education with outstanding facilities and a broad academic and co-curricular programme designed to cultivate critical thinking, creativity and leadership.',
  },
]

/** @deprecated Prefer TOP_DESTINATIONS, kept as a thin adapter for existing imports. */
export const EXPANSION_MARKETS = TOP_DESTINATIONS.map(d => ({
  id: d.id,
  name: d.name,
  city: d.shortName,
  detail: d.publicSummary,
  lat: d.lat,
  lng: d.lng,
  rank: d.rank,
  country: d.country,
}))

/** Network + pipeline locations for the expansion map. */
export const MAP_LOCATIONS = [
  {
    id: 'riyadh',
    name: 'Ellesmere College Riyadh',
    shortName: 'Riyadh',
    detail:
      'Operating campus, including the Salwa Compound site. This market is already allocated to an investment partner and is not open for new growth bids.',
    lat: 24.7136,
    lng: 46.6753,
    status: 'open' as const,
    rank: undefined as number | undefined,
  },
  {
    id: 'doha',
    name: 'Ellesmere College Doha',
    shortName: 'Doha',
    detail: 'Purpose-built campus opening soon in partnership with Education Avenue Group.',
    lat: 25.2854,
    lng: 51.531,
    status: 'opening' as const,
    rank: undefined as number | undefined,
  },
  ...expansionPinDestinations().map(d => ({
    id: d.id,
    name: d.name,
    shortName: d.shortName,
    detail: d.publicSummary,
    lat: d.lat,
    lng: d.lng,
    status: 'expansion' as const,
    rank: d.rank as number | undefined,
  })),
] as const

export const PARTNERSHIP_MODELS = [
  {
    id: 'full',
    title: 'Full Partnership',
    summary:
      'Complete ECI branding, curriculum frameworks, quality assurance, leadership mentoring, and ongoing network support for new or established schools.',
    ideal: 'New school investors and operators seeking full Ellesmere affiliation.',
  },
  {
    id: 'curriculum',
    title: 'Curriculum Licensing',
    summary:
      'License Ellesmere curriculum and assessment frameworks while retaining your existing school brand and identity.',
    ideal: 'Established schools adopting British curriculum standards.',
  },
  {
    id: 'advisory',
    title: 'Advisory Partnership',
    summary:
      'Access ECI expertise, inspection readiness support, and professional development without full brand integration.',
    ideal: 'Schools seeking quality assurance and leadership development.',
  },
] as const

export const PRIMARY_PARTNERSHIP = PARTNERSHIP_MODELS.find(m => m.id === 'full')!

export const PARTNERSHIP_ADDONS = PARTNERSHIP_MODELS.filter(m => m.id !== 'full')

export const INVESTOR_VALUE_PROPS = [
  {
    title: 'Proven British heritage',
    body: 'Ellesmere College, Shropshire, founded 1884, provides the academic DNA, quality culture, and Life:Ready philosophy behind every international campus.',
  },
  {
    title: 'Operating proof points',
    body: 'Live campuses in Riyadh, including Salwa Compound, with Doha opening soon, demonstrate transferable standards across the Middle East.',
  },
  {
    title: 'Defined expansion map',
    body: 'A ranked Top 10 growth set, from New Cairo and Northern Bahrain to Rabat, Abu Dhabi, Jeddah and Sharjah, selected through consistent multi-country market analysis. Allocated campuses such as Riyadh are excluded.',
  },
  {
    title: 'Quality & brand protection',
    body: 'Licensing, inspection frameworks, and network governance protect the Ellesmere name while enabling local partnership.',
  },
] as const

export const HERITAGE = {
  founded: 1884,
  campusAcres: 160,
  charityNumber: '1087175',
  address: 'Ellesmere College, Ellesmere, Shropshire, SY12 9AB, United Kingdom',
  email: 'international@ellesmere.com',
  phone: '+44 (0)1691 622321',
  ukSite: 'https://www.ellesmere.com',
  tagline: 'Life:Ready',
} as const

/** Public network page: Shropshire, two Riyadh campuses, Doha. */
export const PUBLIC_CAMPUSES: NetworkSchoolCard[] = [
  HERITAGE_CAMPUS,
  ...OPERATING_SCHOOLS,
  ...OPENING_SOON,
]

/** Homepage “Our network” module: two Riyadh campuses, Doha, and the UK heritage school. */
export const HOMEPAGE_NETWORK_SCHOOLS: NetworkSchoolCard[] = [
  ...OPERATING_SCHOOLS,
  ...OPENING_SOON,
  HERITAGE_CAMPUS,
]
