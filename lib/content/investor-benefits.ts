/**
 * Investor-facing partnership benefits — concrete commercial value, not soft marketing.
 * Every `evidence` line must be supportable from public ECI facts already used on the site.
 * Do not invent fee yields, IRR, or unreleased financials.
 *
 * Images are small supporting plates (not hero media): authentic campus photography
 * matched to the claim — UK heritage, live Riyadh operations, or Doha expansion.
 */

export const INVESTOR_BENEFITS_INTRO = {
  eyebrow: 'Partnership benefits',
  title: 'What an investing company actually gets',
} as const

export type InvestorBenefit = {
  id: string
  /** Short index label — not the full headline */
  label: string
  title: string
  benefit: string
  evidence: string
  image: string
  imageAlt: string
  /** Short plate caption under the image */
  imageCaption: string
}

export const INVESTOR_BENEFITS: InvestorBenefit[] = [
  {
    id: 'demand-signal',
    label: 'Demand proven',
    title: 'Proven parental demand for the brand',
    benefit:
      'You are not guessing whether families will pay for an Ellesmere campus. The brand has already attracted enrolment at pace in a live Middle East market — reducing the demand risk that kills most greenfield school launches.',
    evidence:
      'Ellesmere College Riyadh grew from a standing start to more than 600 students in just over two years, then added a second Riyadh site at Salwa Compound.',
    image: '/images/schools/riyadh/exterior.jpg',
    imageAlt: 'Exterior of Ellesmere College Riyadh',
    imageCaption: 'Ellesmere College Riyadh',
  },
  {
    id: 'brand-equity',
    label: 'Brand equity',
    title: 'Brand equity you do not have to build from zero',
    benefit:
      'Launching under Ellesmere means entering the market with a British independent-school identity already recognised by quality-conscious families — instead of spending years and marketing budget creating trust for an unknown name.',
    evidence:
      'Ellesmere College, Shropshire, was founded in 1884 and operates a 160-acre UK campus. International campuses carry that heritage under ECI brand licensing.',
    image: '/images/campus/uk-historic.jpg',
    imageAlt: 'Historic buildings on the Ellesmere College UK campus',
    imageCaption: 'Ellesmere College, Shropshire · founded 1884',
  },
  {
    id: 'transferable-product',
    label: 'School product',
    title: 'A transferable school product, not a logo licence',
    benefit:
      'Partners receive curriculum frameworks, quality assurance, leadership mentoring and network support — the operating DNA of the school — so the campus can open to a defined standard rather than inventing pedagogy, pastoral systems and brand rules alone.',
    evidence:
      'Full Partnership covers branding and identity, curriculum and assessment frameworks, QA, leadership mentoring and ongoing network support. Curriculum-only and advisory models are available where full affiliation is not required.',
    image: '/images/campus/uk-learning.jpg',
    imageAlt: 'Teaching and learning on the Ellesmere College campus',
    imageCaption: 'Curriculum and teaching standard',
  },
  {
    id: 'replication',
    label: 'Replication',
    title: 'Evidence the model can be replicated',
    benefit:
      'A single successful campus can be an anecdote. A second campus in the same city, plus a third country opening, shows the operating and brand model transfers — which matters if your thesis is multi-site or multi-market.',
    evidence:
      'Operating today: Ellesmere College Riyadh and Salwa Compound (Saudi Arabia). Opening soon: Ellesmere College Doha (Qatar), purpose-built with Education Avenue Group.',
    image: '/images/schools/doha/entrance-lobby.jpg',
    imageAlt: 'Entrance lobby at Ellesmere College Doha',
    imageCaption: 'Ellesmere College Doha · opening soon',
  },
  {
    id: 'market-map',
    label: 'Market map',
    title: 'A ranked expansion map instead of opportunistic site-picking',
    benefit:
      'Capital can underwrite a location thesis against the same criteria ECI uses — demand, income and fee-band fit, competition, regulation, UK-curriculum readiness and cultural fit — rather than chasing the loudest broker pitch in each city.',
    evidence:
      'ECI’s Top 10 open destinations are drawn from consistent analysis across seven MENA countries (Saudi Arabia, UAE, Kuwait, Oman, Bahrain, Egypt, Morocco). Allocated markets such as Riyadh are excluded from new growth bids.',
    image: '/images/schools/doha-horizon.jpg',
    imageAlt: 'Doha horizon from the Ellesmere campus context',
    imageCaption: 'MENA expansion context · Doha',
  },
  {
    id: 'local-economics',
    label: 'Campus economics',
    title: 'You keep the campus economics; we protect the brand',
    benefit:
      'The partnership model is built for investors and operators who build and run the school. ECI’s role is licensing, standards and network support — so commercial control of the campus sits with the partner, while brand and quality risk is actively managed by the licensor.',
    image: '/images/schools/riyadh/campus-home.jpg',
    imageAlt: 'Ellesmere College Riyadh campus',
    imageCaption: 'Partner-operated campus asset',
    evidence:
      'ECI’s published growth model is brand licensing: investors and operators open an Ellesmere campus; curriculum and advisory sit as add-ons, not parallel products. Diligence packs and commercial schedules are released in the Investor Portal after NDA where required.',
  },
  {
    id: 'quality-governance',
    label: 'Quality governance',
    title: 'Quality governance that protects asset value',
    benefit:
      'A premium school’s long-term value depends on reputation. Network inspection frameworks and brand protection reduce the downside of quality drift that can destroy fees, enrolment and exit optionality.',
    evidence:
      'ECI applies licensing, inspection frameworks and network governance to protect the Ellesmere name across partner campuses. Ellesmere’s High Performance Learning (HPL) philosophy underpins the academic culture transferred internationally.',
    image: '/images/campus/uk-choir.jpg',
    imageAlt: 'Ellesmere College choir on the UK campus',
    imageCaption: 'Culture and standards · UK campus',
  },
  {
    id: 'partner-infrastructure',
    label: 'Local partners',
    title: 'Local operating partners already proven in market',
    benefit:
      'Where ECI has entered, it has done so with established education groups — shortening the path from licence to a functioning school with local regulatory and operating capacity.',
    evidence:
      'Riyadh operates with Glory & Princeton International Schools Group. Doha is opening with Education Avenue Group on a purpose-built campus.',
    image: '/images/schools/doha/lobby-windows.jpg',
    imageAlt: 'Lobby windows at the purpose-built Doha campus',
    imageCaption: 'Purpose-built with Education Avenue Group',
  },
]
