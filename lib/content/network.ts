/** Canonical public network content for ECI — used when DB is empty or as seed source of truth. */

import {
  expansionPinDestinations,
  TOP_DESTINATIONS,
} from '@/lib/content/expansion-markets'

export type NetworkSchoolCard = {
  id: string
  name: string
  city: string
  country: string
  status: 'active' | 'setting_up' | 'prospect'
  short_bio: string
  description: string
  curriculum: string[]
  year_joined?: number
  website?: string
  image: string
  highlight?: string
}

export const OPERATING_SCHOOLS: NetworkSchoolCard[] = [
  {
    id: 'riyadh',
    name: 'Ellesmere College Riyadh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    status: 'active',
    year_joined: 2024,
    website: 'https://ellesmerecollegeriyadh.com',
    image: '/images/schools/riyadh-campus.webp',
    curriculum: ['Early Years', 'IGCSE', 'IB Pathways', 'American Diploma'],
    highlight: 'Open now — including the new Salwa Compound campus',
    short_bio:
      'British-heritage education for ages 3–18 in the heart of Riyadh, delivering High Performance Learning in a nurturing, inclusive community.',
    description:
      'Ellesmere College Riyadh brings the Ellesmere educational philosophy to the Kingdom of Saudi Arabia through partnership with the Glory & Princeton International Schools Group. Pupils enjoy Early Years through pre-university pathways, with a focus on academic excellence, wellbeing, and character.',
  },
  {
    id: 'muscat',
    name: 'Ellesmere College Muscat',
    city: 'Muscat',
    country: 'Oman',
    status: 'active',
    year_joined: 2023,
    image: '/images/campus/uk-learning.jpg',
    curriculum: ['IB Continuum', 'Early Years to Grade 12'],
    highlight: 'Opened 2023',
    short_bio:
      'A vibrant international school combining the International Baccalaureate with Ellesmere’s Life:Ready ethos in Oman’s capital.',
    description:
      'Opened in 2023, Ellesmere College Muscat serves students from early years to Grade 12, fostering critical thinking, creativity and global-minded leadership while preparing learners to be Life:Ready.',
  },
]

export const OPENING_SOON: NetworkSchoolCard[] = [
  {
    id: 'doha',
    name: 'Ellesmere College Doha',
    city: 'Doha',
    country: 'Qatar',
    status: 'setting_up',
    image: '/images/schools/doha/lobby-windows.jpg',
    curriculum: ['Early Years', 'British Primary'],
    highlight: 'Purpose-built campus — founding year',
    short_bio:
      'Purpose-built British-heritage campus in Qatar offering EYFS and Primary pathways, with English and Arabic teaching languages and the Ellesmere Life:Ready ethos.',
    description:
      'Ellesmere College Doha is the newest addition to the Ellesmere international family, in partnership with the Education Avenue Group. The purpose-built campus offers British education with outstanding facilities and a broad academic and co-curricular programme designed to cultivate critical thinking, creativity and leadership.',
  },
]

/** @deprecated Prefer TOP_DESTINATIONS — kept as a thin adapter for existing imports. */
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
      'Operating campus — including the Salwa Compound site. This market is already allocated to an investment partner and is not open for new growth bids.',
    lat: 24.7136,
    lng: 46.6753,
    status: 'open' as const,
    rank: undefined as number | undefined,
  },
  {
    id: 'muscat',
    name: 'Ellesmere College Muscat',
    shortName: 'Muscat',
    detail: 'Operating campus delivering the Ellesmere Life:Ready ethos in Oman.',
    lat: 23.588,
    lng: 58.3829,
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
    id: 'brand',
    title: 'Brand licensing',
    primary: true,
    summary:
      'Work with ECI to build and operate a school under the Ellesmere brand: curriculum frameworks, quality assurance, leadership mentoring, and ongoing network support.',
    ideal: 'Investors and operators building a new Ellesmere campus.',
  },
  {
    id: 'curriculum',
    title: 'Curriculum support',
    primary: false,
    summary:
      'An optional add-on for partners who need Ellesmere curriculum and assessment frameworks without full brand affiliation.',
    ideal: 'Selected partners seeking curriculum depth alongside a wider relationship.',
  },
  {
    id: 'advisory',
    title: 'Advisory support',
    primary: false,
    summary:
      'An optional add-on for quality assurance, inspection readiness, and professional development where full brand licensing is not the primary path.',
    ideal: 'Selected partners needing specialist advisory support.',
  },
] as const

/** The central investor offer: build a school under the Ellesmere brand. */
export const PRIMARY_PARTNERSHIP = PARTNERSHIP_MODELS.find(m => m.primary)!

export const PARTNERSHIP_ADDONS = PARTNERSHIP_MODELS.filter(m => !m.primary)

export const INVESTOR_VALUE_PROPS = [
  {
    title: 'Proven British heritage',
    body: 'Ellesmere College, Shropshire — founded 1884 — provides the academic DNA, quality culture, and Life:Ready philosophy behind every branded international campus.',
  },
  {
    title: 'Operating proof points',
    body: 'Live campuses in Riyadh and Muscat, with Doha opening soon, show that the Ellesmere standard transfers across the Middle East.',
  },
  {
    title: 'Brand licensing, done properly',
    body: 'You invest and build under the Ellesmere name. ECI protects standards through licensing, quality assurance, leadership support, and network governance.',
  },
  {
    title: 'Clear growth markets',
    body: 'A ranked Top 10 destination set helps aim capital where demand, income fit, regulation, and cultural alignment support an Ellesmere school.',
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
