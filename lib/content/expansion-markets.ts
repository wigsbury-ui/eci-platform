/** Top expansion destinations — investor-facing rewrite of ECI market targeting analysis. */

export type MarketSignal = 'Low' | 'Moderate' | 'High' | 'Very High'

export type ScoreDimension =
  | 'demand'
  | 'incomeFit'
  | 'feeAlignment'
  | 'regulatory'
  | 'competition'
  | 'ukCurriculum'
  | 'culturalFit'

/** 1–5 scorecard inputs used for investor visuals (higher is stronger opportunity, except competition where higher = more saturated). */
export type DestinationScores = Record<ScoreDimension, 1 | 2 | 3 | 4 | 5>

export type TopDestination = {
  id: string
  rank: number
  /** Composite 0–100 from multi-criteria targeting — for portal context only. */
  compositeScore: number
  name: string
  shortName: string
  country: string
  cityLabel: string
  lat: number
  lng: number
  /** Public one-liner for map / homepage. */
  publicSummary: string
  /** Investor opportunity narrative (not internal board language). */
  investorThesis: string
  whyNow: string[]
  partnerFit: string
  opportunity: MarketSignal
  scores: DestinationScores
  /** Network status overlay when ECI already has presence. */
  networkStatus?: 'operating' | 'opening'
}

export const SCORE_LABELS: Record<ScoreDimension, string> = {
  demand: 'Demand potential',
  incomeFit: 'Income fit',
  feeAlignment: 'Fee-band alignment',
  regulatory: 'Regulatory & investment climate',
  competition: 'Competitive intensity',
  ukCurriculum: 'UK curriculum readiness',
  culturalFit: 'Cultural fit with ECI',
}

export const MARKET_METHODOLOGY = {
  eyebrow: 'Market intelligence',
  title: 'How priority destinations are selected',
  summary:
    'ECI’s expansion map is grounded in consistent, cross-market analysis across seven MENA countries — so partners can compare opportunities on the same terms.',
  countries: ['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Oman', 'Bahrain', 'Egypt', 'Morocco'],
  criteria: [
    'Family demand for quality international schooling',
    'Income and fee-band fit for the Ellesmere model',
    'Competitive intensity and white-space for differentiation',
    'Regulatory openness and investment climate',
    'UK curriculum familiarity and cultural alignment with ECI’s ethos',
  ],
  note:
    'Rankings blend local scorecards with strategic weight — scale, brand visibility and regional influence — so high-impact cities sit alongside clear first-mover corridors.',
}

/** Investor-facing Top 10 growth destinations (allocated operating markets such as Riyadh are excluded). */
export const TOP_DESTINATIONS: TopDestination[] = [
  {
    id: 'new-cairo',
    rank: 1,
    compositeScore: 92,
    name: 'New Cairo / New Administrative Capital',
    shortName: 'New Cairo',
    country: 'Egypt',
    cityLabel: 'New Cairo & NAC',
    lat: 30.028,
    lng: 31.47,
    publicSummary:
      'Egypt’s leading growth corridor — affluent families, strong British-school demand, and improving investment-zone clarity.',
    investorThesis:
      'A flagship-scale Egyptian opportunity where affluent Egyptian and international families are concentrating. Demand for a mid-premium British model is deep, and New Administrative Capital planning improves the investment environment for a purpose-built campus.',
    whyNow: [
      'Very large private K–12 market with aspirational parents',
      'Strong income fit for a premium-with-purpose British offer',
      'Clearer regulatory pathways in designated investment zones',
      'Room to differentiate even where competition is established',
    ],
    partnerFit:
      'Ideal for capital and operating partners seeking a high-visibility Egyptian campus with multi-phase enrolment potential.',
    opportunity: 'Very High',
    scores: {
      demand: 5,
      incomeFit: 5,
      feeAlignment: 5,
      regulatory: 4,
      competition: 3,
      ukCurriculum: 5,
      culturalFit: 5,
    },
  },
  {
    id: 'bahrain-north',
    rank: 2,
    compositeScore: 90,
    name: 'Northern Governorate (Saar / Budaiya)',
    shortName: 'Northern Bahrain',
    country: 'Bahrain',
    cityLabel: 'Saar · Budaiya · Janabiya',
    lat: 26.185,
    lng: 50.465,
    publicSummary:
      'High-income family districts with an underserved mid-premium British segment and a stable regulatory climate.',
    investorThesis:
      'Bahrain’s northern residential belt offers affluent local families and a clear gap for a mid-premium UK model. The private-education framework is established and supportive, making this one of the strongest first-campus opportunities in the Gulf outside the mega-cities.',
    whyNow: [
      'Concentrated affluent catchments in Saar, Budaiya and Janabiya',
      'Mid-premium British segment still underserved',
      'Supportive, predictable private-school regulation',
      'High strategic fit with ECI’s ethos and fee positioning',
    ],
    partnerFit:
      'Attractive for partners seeking a compact, high-income Gulf market with faster route-to-enrolment dynamics.',
    opportunity: 'Very High',
    scores: {
      demand: 5,
      incomeFit: 5,
      feeAlignment: 5,
      regulatory: 5,
      competition: 3,
      ukCurriculum: 4,
      culturalFit: 5,
    },
  },
  {
    id: 'rabat',
    rank: 3,
    compositeScore: 89,
    name: 'Rabat',
    shortName: 'Rabat',
    country: 'Morocco',
    cityLabel: 'Rabat',
    lat: 34.0209,
    lng: -6.8416,
    publicSummary:
      'Diplomatic and professional capital — strong investor access and cultural alignment with a UK-heritage model.',
    investorThesis:
      'Rabat combines elite and diplomatic family demand with consistent regulatory frameworks and high brand visibility. Cultural affinity with British education makes it a natural North African flagship for partners who value reputation as much as enrolment scale.',
    whyNow: [
      'Diplomatic and professional parent base with strong fee capacity',
      'Reliable regulatory environment for private investment',
      'High cultural alignment with Ellesmere’s educational ethos',
      'Capital-city visibility that lifts network brand across Morocco',
    ],
    partnerFit:
      'Best for partners prioritising prestige, cultural fit and a durable Moroccan platform.',
    opportunity: 'Very High',
    scores: {
      demand: 5,
      incomeFit: 5,
      feeAlignment: 5,
      regulatory: 5,
      competition: 3,
      ukCurriculum: 4,
      culturalFit: 5,
    },
  },
  {
    id: 'october-sheikh-zayed',
    rank: 4,
    compositeScore: 88,
    name: '6th of October / Sheikh Zayed',
    shortName: 'Sheikh Zayed',
    country: 'Egypt',
    cityLabel: '6th of October · Sheikh Zayed',
    lat: 29.9381,
    lng: 30.9138,
    publicSummary:
      'Suburban Cairo growth belt — strong income fit, family clusters, and room to differentiate on a mid-fee British offer.',
    investorThesis:
      'West Cairo’s planned suburbs concentrate family demand with mid-fee sensitivity and multiple school zones. Competition is more moderate than core New Cairo, creating space for a clearly positioned Ellesmere campus with scalable phased growth.',
    whyNow: [
      'Dense suburban family catchments with rising aspirations',
      'Fee bands that align well with ECI’s mid-premium positioning',
      'Multiple zoning options for campus delivery',
      'Clear differentiation opportunity versus legacy providers',
    ],
    partnerFit:
      'Strong second Egyptian campus or primary entry for partners focused on suburban scale.',
    opportunity: 'Very High',
    scores: {
      demand: 5,
      incomeFit: 5,
      feeAlignment: 5,
      regulatory: 4,
      competition: 3,
      ukCurriculum: 4,
      culturalFit: 5,
    },
  },
  {
    id: 'abu-dhabi',
    rank: 5,
    compositeScore: 87,
    name: 'Abu Dhabi',
    shortName: 'Abu Dhabi',
    country: 'United Arab Emirates',
    cityLabel: 'Abu Dhabi',
    lat: 24.4539,
    lng: 54.3773,
    publicSummary:
      'High-income UAE capital with regulatory support and sustained demand for quality UK school brands.',
    investorThesis:
      'Abu Dhabi’s large private-student base and ADEK’s openness to quality private provision create a premium UAE platform. Competition is real, but demand for distinctive mid-to-upper British brands remains strong — especially with a clear quality and pastoral differentiator.',
    whyNow: [
      'Sizeable affluent and expat family market',
      'Regulator welcomes reputable private-sector entrants',
      'UK curriculum penetration already high — parents recognise the category',
      'Regional brand value across the wider UAE corridor',
    ],
    partnerFit:
      'For partners ready to compete on quality in a sophisticated, well-regulated market.',
    opportunity: 'High',
    scores: {
      demand: 5,
      incomeFit: 5,
      feeAlignment: 5,
      regulatory: 5,
      competition: 3,
      ukCurriculum: 5,
      culturalFit: 5,
    },
  },
  {
    id: 'bouskoura',
    rank: 6,
    compositeScore: 86,
    name: 'Bouskoura (Casablanca suburbs)',
    shortName: 'Bouskoura',
    country: 'Morocco',
    cityLabel: 'Bouskoura · Greater Casablanca',
    lat: 33.448,
    lng: -7.65,
    publicSummary:
      'Modern suburban Casablanca — limited British competition and strong residential appeal for family campuses.',
    investorThesis:
      'Bouskoura sits in Casablanca’s affluent growth belt with modern residential development and comparatively light British-school competition. It offers a first-mover suburban play adjacent to Morocco’s largest commercial population — without the saturation of the city centre.',
    whyNow: [
      'Affluent suburban catchment with family-oriented housing growth',
      'Lower competitive intensity than central Casablanca',
      'Supportive investment-zone dynamics',
      'Natural pairing with a Rabat or Casablanca network strategy',
    ],
    partnerFit:
      'Excellent for partners seeking suburban land efficiency and a clear white-space narrative.',
    opportunity: 'Very High',
    scores: {
      demand: 4,
      incomeFit: 5,
      feeAlignment: 5,
      regulatory: 4,
      competition: 2,
      ukCurriculum: 3,
      culturalFit: 5,
    },
  },
  {
    id: 'sohar',
    rank: 7,
    compositeScore: 85,
    name: 'Sohar',
    shortName: 'Sohar',
    country: 'Oman',
    cityLabel: 'Sohar',
    lat: 24.347,
    lng: 56.73,
    publicSummary:
      'Oman’s northern economic hub — limited competition and strong cultural alignment with the Ellesmere ethos.',
    investorThesis:
      'Sohar is a regional diversification play with genuine white space for an international British campus. Supportive regional development policy and close cultural fit make it a compelling market for a first British-heritage campus in northern Oman.',
    whyNow: [
      'Clear competitive white space in a growing industrial city',
      'Industrial and port economy supporting mid-income family demand',
      'Government interest in regional education diversification',
      'Strong cultural alignment with the Ellesmere ethos',
    ],
    partnerFit:
      'Appeals to partners who want Oman exposure with a first-mover regional story.',
    opportunity: 'High',
    scores: {
      demand: 3,
      incomeFit: 3,
      feeAlignment: 4,
      regulatory: 4,
      competition: 2,
      ukCurriculum: 2,
      culturalFit: 5,
    },
  },
  {
    id: 'jeddah',
    rank: 8,
    compositeScore: 84,
    name: 'Jeddah',
    shortName: 'Jeddah',
    country: 'Saudi Arabia',
    cityLabel: 'Jeddah',
    lat: 21.4858,
    lng: 39.1925,
    publicSummary:
      'Saudi Arabia’s western gateway — established private sector, strong fee alignment, and appetite for trusted brands.',
    investorThesis:
      'Jeddah offers a mature private-education market with proven willingness to pay for quality international schooling. As the Kingdom’s Red Sea gateway, it pairs commercial scale with brand appetite — a natural second Saudi city for partners building a multi-campus KSA strategy with Riyadh.',
    whyNow: [
      'Well-established private K–12 sector and fee capacity',
      'Strong demand for recognised international brands',
      'Strategic western-Kingdom coverage alongside Riyadh',
      'Supportive national investment climate under Vision 2030',
    ],
    partnerFit:
      'Ideal follow-on Saudi market for partners already aligned with ECI’s Kingdom strategy.',
    opportunity: 'High',
    scores: {
      demand: 5,
      incomeFit: 4,
      feeAlignment: 5,
      regulatory: 4,
      competition: 4,
      ukCurriculum: 4,
      culturalFit: 5,
    },
  },
  {
    id: 'bahrain-south',
    rank: 9,
    compositeScore: 83,
    name: 'Southern Governorate (Riffa)',
    shortName: 'Southern Bahrain',
    country: 'Bahrain',
    cityLabel: 'Riffa · Isa Town',
    lat: 26.13,
    lng: 50.555,
    publicSummary:
      'Emerging family districts with growing mid-fee demand and social compatibility with the Ellesmere community model.',
    investorThesis:
      'Southern Bahrain’s expanding residential zones — notably Riffa and Isa Town — are building mid-fee family demand with room for new investment. It pairs well with a Northern Governorate campus as a Bahrain network strategy, or stands alone as an accessible growth market.',
    whyNow: [
      'Expanding residential catchments and young family growth',
      'More accessible land and campus options than denser Manama',
      'Supportive climate for new private-school investment',
      'Complements Northern Bahrain for dual-campus coverage',
    ],
    partnerFit:
      'Strong for partners seeking a growth-oriented Bahrain entry with flexible site options.',
    opportunity: 'High',
    scores: {
      demand: 4,
      incomeFit: 4,
      feeAlignment: 5,
      regulatory: 4,
      competition: 3,
      ukCurriculum: 3,
      culturalFit: 5,
    },
  },

  {
    id: 'sharjah',
    rank: 10,
    compositeScore: 82,
    name: 'Sharjah',
    shortName: 'Sharjah',
    country: 'United Arab Emirates',
    cityLabel: 'Sharjah',
    lat: 25.3463,
    lng: 55.4209,
    publicSummary:
      'A more accessible UAE market with rising demand for quality schooling at moderate fees — and room for a distinctive British offer.',
    investorThesis:
      'Sharjah combines a large private-student base with more moderate fee expectations than Abu Dhabi or Dubai. Fewer premium British options today create space for an Ellesmere campus positioned on quality, pastoral care and fee realism — a strong UAE corridor play alongside Abu Dhabi.',
    whyNow: [
      'Large and growing private K–12 enrolment base',
      'Demand for quality at mid-fee price points remains underserved',
      'Cultural fit with ECI’s ethos and family-centred model',
      'Complements an Abu Dhabi strategy across the northern Emirates',
    ],
    partnerFit:
      'Attractive for partners seeking UAE exposure with clearer white space than Dubai’s saturated premium tier.',
    opportunity: 'High',
    scores: {
      demand: 4,
      incomeFit: 3,
      feeAlignment: 3,
      regulatory: 4,
      competition: 4,
      ukCurriculum: 3,
      culturalFit: 4,
    },
  },

]

export function topDestinationById(id: string) {
  return TOP_DESTINATIONS.find(d => d.id === id)
}

/** Destinations shown as expansion / growth pins on the public map. */
export function expansionPinDestinations() {
  return TOP_DESTINATIONS
}

export function signalFromScore(score: number, invertCompetition = false): MarketSignal {
  const s = invertCompetition ? 6 - score : score
  if (s >= 5) return 'Very High'
  if (s >= 4) return 'High'
  if (s >= 3) return 'Moderate'
  return 'Low'
}
