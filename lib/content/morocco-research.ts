/**
 * Investor-facing Morocco market research — refreshed March 2026.
 * Derived from ECI internal Draft 1.2 (Jul 2025) and updated public sources.
 * Voice: opportunity for capital / operators under brand licensing — not internal board instructions.
 */

export const MOROCCO_RESEARCH = {
  id: 'morocco-private-k12-2026',
  title: 'Private K–12 Education in Morocco',
  subtitle: 'Market overview & opportunity analysis for brand-licensing partners',
  version: '2.0',
  publishedLabel: 'March 2026',
  eyebrow: 'Investor research',
  fileName: 'ECI-Morocco-Private-K12-Research-2026.pdf',
  downloadPath: '/api/research/morocco-file',
  summary:
    'Morocco’s private K–12 market is large, urban, and still less mature than the Gulf. Upper-middle families are trading up from French and local bilingual options toward English-medium and British pathways — creating room for a mid-premium, values-led Ellesmere campus under brand licensing.',
  keyTakeaways: [
    'About 1.27 million students (≈15% of national enrolment) attend private schools in 2025–26 — a deep urban addressable base concentrated in the Casablanca–Rabat corridor.',
    'Published international tuition in Casablanca typically clusters around a mid-60s MAD thousand median; American/IB premiums sit well above; French mission schools remain the value benchmark.',
    'British provision has expanded (Bouskoura, Casablanca, Rabat, Tangier). The opportunity is differentiation on heritage brand, pastoral quality, and a clear MAD 60–90k mid-premium position — not an empty market.',
    'Law 59.21 and Ministry guidance tighten fee transparency and parent contracts while still allowing authorised foreign curricula — favourable for reputable operators.',
    'Priority partner locations: Rabat (visibility & fit), Bouskoura / Greater Casablanca suburbs (scale & land), Tangier (growth corridor with lighter mid-fee British density).',
  ],
  macro: {
    title: 'Macro overview',
    demographics: [
      'Population ≈38.4 million (2025), with roughly a quarter under age 15 and urbanisation around two-thirds — demand is concentrated in major cities.',
      'Key urban catchments: Greater Casablanca, Rabat–Salé–Témara, Tangier, Marrakesh, Fès, and Agadir.',
      'Compulsory schooling and near-universal primary enrolment underpin a large K–12 system; quality and language pathways drive private choice at secondary.',
    ],
    enrolment: [
      '2025–26 Ministry figures: 8.27 million students enrolled nationally — ≈7.00 million public and ≈1.27 million private.',
      'Private share is approximately 15% of total enrolment, continuing a multi-year shift toward private provision in urban corridors.',
      'Private schools remain heavily clustered along the Casablanca–Kénitra axis; secondary cities are thinner but growing with tourism, industry, and residential spillover.',
    ],
    policy: [
      'The 2022–2026 education roadmap emphasises quality, equity, and modernisation; private providers are part of capacity and choice.',
      'Law 59.21 (school education code) requires written annual parent–school contracts, published fee lists (tuition and ancillary), and bans in-year fee increases.',
      'Foreign curricula may be offered subject to authorisation and national identity requirements (Arabic / Amazigh programmes and constitutional constants).',
    ],
  },
  fees: {
    title: 'Tuition benchmarking',
    intro:
      'Fee bands vary widely by curriculum and city. Figures below are annual tuition guides from published schedules and aggregator medians (2025–26 / 2026–27). Always verify total cost (registration, transport, meals, exams).',
    bands: [
      {
        name: 'Value / French mission',
        range: '≈ MAD 40,000–55,000',
        note: 'e.g. Lycée Lyautey published bands ≈ MAD 40.8k–48.2k (2026/27). Strong academic brand at relatively accessible price.',
      },
      {
        name: 'Accessible British / bilingual international',
        range: '≈ MAD 36,000–70,000',
        note: 'e.g. London Academy Casablanca published ≈ MAD 36k–69k (2026/27). Belgian School Casablanca ≈ MAD 47k–69k.',
      },
      {
        name: 'Mid-premium international (ECI alignment)',
        range: 'MAD 60,000–90,000',
        note: 'Target band for a heritage British model between French value and American/IB premiums. Casablanca international median ≈ MAD 66.5k among schools that publish fees.',
      },
      {
        name: 'Premium American / IB',
        range: '≈ MAD 90,000–175,000+',
        note: 'e.g. Casablanca American School ≈ MAD 94k–163k; George Washington Academy ≈ MAD 99k–174k (published ranges).',
      },
    ],
    positioning:
      'A licensed Ellesmere school at MAD 60–90k sits above most French and entry British offers, well below elite American/IB pricing — the segment where many upper-middle Moroccan families are trading up for English pathways without paying ultra-premium fees.',
  },
  competition: {
    title: 'Competitive landscape',
    intro:
      'French provision still dominates private international enrolment. English-medium and British pathways have grown materially since the mid-2010s; partners should assume active competitors in Casablanca’s orbit and plan differentiation, not virgin white space.',
    points: [
      'Casablanca: dense mix of French lycées, American/IB schools (CAS, GWA, American Academy), and British options including British International School of Casablanca (BISC), London Academy (Bouskoura campus), and International School of Morocco (BSO / IB primary).',
      'Rabat: fewer full British Nursery–Y13 campuses than Casablanca; American and French options are established. London Academy also operates in Rabat. Diplomatic and professional families support mid-to-premium fees.',
      'Tangier: growing industrial and logistics economy; Cambridge-linked options include Everest School and longer-standing Anglo-Moroccan provision. Mid-fee British density remains lighter than Greater Casablanca.',
      'Marrakesh / Agadir: thinner international stacks — niche, lifestyle, and tourism-linked demand rather than volume plays.',
      'Differentiation levers for ECI partners: UK independent-school heritage, pastoral and character education, network quality assurance, and transparent mid-premium pricing.',
    ],
  },
  destinations: [
    {
      id: 'rabat',
      name: 'Rabat',
      tier: 'Priority',
      opportunity: 'Very High',
      thesis:
        'Capital-city visibility, diplomatic and professional families, and strong cultural fit for a UK-heritage brand. Ideal flagship for partners who value reputation and regulatory consistency alongside enrolment.',
      signals: [
        'High fee capacity and international outlook',
        'Supportive, predictable private-school framework',
        'Room to differentiate versus American and French incumbents',
      ],
    },
    {
      id: 'bouskoura',
      name: 'Bouskoura & Greater Casablanca suburbs',
      tier: 'Priority',
      opportunity: 'Very High',
      thesis:
        'Affluent villa and gated-community growth south of Casablanca. British competitors are present (notably BISC and London Academy), but residential growth can support additional mid-premium capacity — especially with land availability and developer partnerships that central Casablanca cannot match.',
      signals: [
        'Family catchments moving from city apartments to suburbs',
        'Easier campus delivery than saturated central districts',
        'Compete on brand depth and pastoral offer, not on “first British school” alone',
      ],
    },
    {
      id: 'tangier',
      name: 'Tangier',
      tier: 'Priority',
      opportunity: 'High',
      thesis:
        'Port, free-zone, and automotive investment continue to expand the professional class. Cambridge-oriented schools exist, but a full heritage British campus with network backing remains a clear second-wave opportunity.',
      signals: [
        'Industrial and logistics-driven family growth',
        'Lighter mid-fee British density than Casa–Rabat',
        'Strong long-term upside as a northern network node',
      ],
    },
    {
      id: 'casa-central',
      name: 'Central Casablanca',
      tier: 'Selective',
      opportunity: 'Medium',
      thesis:
        'Largest absolute demand pool, but highest saturation and site constraints. Better as a catchment for a suburban campus than as a first greenfield city-centre build.',
      signals: ['Scale', 'High competition', 'Land and traffic friction'],
    },
    {
      id: 'secondary',
      name: 'Marrakesh, Agadir, Témara–Salé, Fès, El Jadida',
      tier: 'Later / watchlist',
      opportunity: 'Moderate → Low',
      thesis:
        'Viable as later network phases or satellite campuses once a Moroccan flagship is established. Témara–Salé offers Rabat overflow; Marrakesh and Agadir suit niche tourism/expat demand; Fès and El Jadida need special partnerships or slower ramps.',
      signals: ['Smaller fee pools', 'Lower British familiarity', 'Partnership-led entry'],
    },
  ],
  matrix: {
    title: 'Location targeting snapshot',
    columns: ['Market scale', 'Income fit', 'Competition', 'Partner opportunity'],
    rows: [
      { place: 'Rabat', values: ['High', 'Strong', 'Medium', 'Very High'] },
      { place: 'Bouskoura / Casa suburbs', values: ['Medium–High', 'Strong', 'Medium', 'Very High'] },
      { place: 'Tangier', values: ['Medium–High', 'Rising', 'Low–Medium', 'High'] },
      { place: 'Central Casablanca', values: ['Very High', 'Strong', 'High', 'Medium'] },
      { place: 'Marrakesh / Agadir', values: ['Medium', 'Moderate', 'Medium / Low', 'Moderate'] },
      { place: 'Témara–Salé', values: ['Medium', 'Moderate', 'Low', 'High (overflow)'] },
      { place: 'Fès / El Jadida', values: ['Medium–Low', 'Lower', 'Low', 'Watchlist'] },
    ],
  },
  partnerModel: {
    title: 'How partners engage',
    body: 'ECI’s primary offer is brand licensing: investors and operators build and run a school under the Ellesmere name, with curriculum frameworks, quality assurance, leadership support, and network governance. Curriculum and advisory services are optional add-ons — not parallel products.',
    bullets: [
      'Capital and operating partners fund campus delivery and local operations',
      'ECI licenses brand and standards; protects quality across the network',
      'Morocco entry should plan for Arabic / cultural programmes alongside British pathways',
      'Fee transparency and annual parent contracts are now baseline regulatory expectations',
    ],
  },
  conclusion: {
    title: 'Outlook for partners',
    paragraphs: [
      'Morocco combines demographic scale, urbanising affluence, and a private sector that already educates more than a million learners — yet English-medium mid-premium British provision is still thinner than in mature Gulf markets.',
      'The strongest partner theses are Rabat (flagship visibility), Bouskoura / Greater Casablanca suburbs (scale with deliverable sites), and Tangier (northern growth). Success depends on local partnership, cultural fluency, and clear differentiation amid an expanding British and international field.',
      'For capital partners, Morocco is both a near-term campus opportunity and a long-term North African platform under a single licensed brand.',
    ],
  },
  sources: [
    {
      label: 'Ministry of National Education — 2025–26 enrolment (via Morocco World News / Express TV reporting)',
      url: 'https://www.moroccoworldnews.com/2025/09/260022/morocco-registers-over-8-2-million-students-for-2025-2026-academic-year/',
    },
    {
      label: 'Law 59.21 school education framework — private fee transparency & contracts (SNRT / La Relève)',
      url: 'https://snrtnews.com/fr/article/enseignement-prive-au-maroc-ce-que-change-la-loi-5921-142717',
    },
    {
      label: 'International Schools Database — Casablanca fee schedules 2025/26–2026/27',
      url: 'https://www.international-schools-database.com/in/casablanca',
    },
    {
      label: 'doris — Casablanca international tuition medians (2026)',
      url: 'https://www.doris.school/international-schools/morocco/casablanca/fees',
    },
    {
      label: 'Ministère de l’Éducation Nationale',
      url: 'https://www.men.gov.ma',
    },
    {
      label: 'Haut-Commissariat au Plan (demographics)',
      url: 'https://www.hcp.ma',
    },
  ],
  disclaimer:
    'This briefing is for qualified investor and operator partners. Figures are compiled from public sources and may change; they are not a prospectus or fee quote. Confirm regulation, licensing, and school-level fees locally before investment decisions.',
} as const

export type MoroccoResearch = typeof MOROCCO_RESEARCH
