/**
 * Investor-facing partnership benefits — concrete commercial value, not soft marketing.
 * Every `evidence` line must be supportable from public ECI facts already used on the site.
 * Do not invent fee yields, IRR, or unreleased financials.
 *
 * Plates are UK campus imagery exclusive to this module (not reused elsewhere on the site).
 * Captions name the UK brand behind the licence; evidence may cite live international campuses.
 */

export const INVESTOR_BENEFITS_INTRO = {
  eyebrow: 'Partnership benefits',
  title: 'What the partnership delivers',
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
      'You are not guessing whether families will pay for an Ellesmere campus. The brand has already drawn enrolment at pace in a live Middle East market — cutting the demand risk that sinks most greenfield school launches.',
    evidence:
      'Ellesmere College Riyadh grew from a standing start to more than 600 students in just over two years, then opened a second Riyadh site at Salwa Compound.',
    image: '/images/campus/uk-campus-1.png',
    imageAlt: 'Students on the lawn in front of the main building at Ellesmere College, Shropshire',
    imageCaption: 'The UK brand families recognise · Ellesmere College, Shropshire',
  },
  {
    id: 'brand-equity',
    label: 'Brand equity',
    title: 'Brand recognition from day one',
    benefit:
      'You enter the market under a British independent-school name already trusted by quality-conscious families — instead of spending years building credibility for an unknown brand.',
    evidence:
      'Ellesmere College, Shropshire, was founded in 1884 and runs a 160-acre UK campus. International campuses carry that heritage under ECI brand licensing.',
    image: '/images/campus/benefits/benefits-uk-grounds.jpg',
    imageAlt: 'Historic brick campus and grounds of Ellesmere College',
    imageCaption: 'Ellesmere College, Shropshire · founded 1884',
  },
  {
    id: 'transferable-product',
    label: 'School product',
    title: 'A full school product, not just a name',
    benefit:
      'Partners receive curriculum frameworks, quality assurance, leadership mentoring and network support — the operating DNA of the school — so the campus opens to a defined standard rather than inventing systems from scratch.',
    evidence:
      'Full Partnership covers branding and identity, curriculum and assessment frameworks, QA, leadership mentoring and ongoing network support. Curriculum-only and advisory models are available where full affiliation is not required.',
    image: '/images/campus/uk-lower-school.jpg',
    imageAlt: 'Lower school pupils learning together at Ellesmere College',
    imageCaption: 'Teaching standard · Ellesmere College',
  },
  {
    id: 'replication',
    label: 'Replication',
    title: 'A model that transfers across sites',
    benefit:
      'One successful campus can be an anecdote. A second campus in the same city, plus a third country opening, shows the brand and operating model can transfer — which matters if your thesis is multi-site or multi-market.',
    evidence:
      'Operating today: Ellesmere College Riyadh and Salwa Compound (Saudi Arabia). Opening soon: Ellesmere College Doha (Qatar), purpose-built with Education Avenue Group.',
    image: '/images/campus/uk-sixth-form.jpg',
    imageAlt: 'Sixth-form student in a science laboratory at Ellesmere College',
    imageCaption: 'The academic model transferred internationally · Ellesmere College',
  },
  {
    id: 'market-map',
    label: 'Market map',
    title: 'A clear expansion map',
    benefit:
      'Capital can underwrite a location against the same criteria ECI uses — demand, fee-band fit, competition, regulation, UK-curriculum readiness and cultural fit — rather than chasing the loudest broker pitch in each city.',
    evidence:
      'ECI’s Top 10 open destinations are drawn from consistent analysis across seven MENA countries (Saudi Arabia, UAE, Kuwait, Oman, Bahrain, Egypt, Morocco). Allocated markets such as Riyadh are excluded from new growth bids.',
    image: '/images/campus/benefits/benefits-uk-sport.jpg',
    imageAlt: 'Students on the playing fields at a British independent school campus',
    imageCaption: '160-acre UK campus · the standard the network extends from',
  },
  {
    id: 'local-economics',
    label: 'Campus economics',
    title: 'You keep the campus economics',
    benefit:
      'You build and run the school. ECI licences the brand, upholds standards and supports the network — so commercial control of the campus stays with the partner.',
    evidence:
      'ECI’s published growth model is brand licensing: investors and operators open an Ellesmere campus; curriculum and advisory sit as add-ons, not parallel products. Fee schedules and diligence packs are shared in the Investor Portal after NDA where required.',
    image: '/images/campus/uk-boarding.jpg',
    imageAlt: 'Boarders in a house common room at Ellesmere College',
    imageCaption: 'Campus life the partner operates · Ellesmere College',
  },
  {
    id: 'quality-governance',
    label: 'Quality governance',
    title: 'Standards that protect long-term value',
    benefit:
      'A premium school’s value rests on reputation. Network inspection and brand protection reduce the risk of quality drift that can damage fees, enrolment and exit options.',
    evidence:
      'ECI applies licensing, inspection frameworks and network governance to protect the Ellesmere name across partner campuses. Ellesmere’s High Performance Learning (HPL) philosophy underpins the academic culture transferred internationally.',
    image: '/images/campus/benefits/benefits-uk-study.jpg',
    imageAlt: 'Students studying in a British independent school library',
    imageCaption: 'Academic standards · Ellesmere College',
  },
  {
    id: 'partner-infrastructure',
    label: 'Local partners',
    title: 'Proven local operating partners',
    benefit:
      'Where ECI has entered a market, it has done so with established education groups — shortening the path from licence to a working school with local regulatory and operating capacity.',
    evidence:
      'Riyadh operates with Glory & Princeton International Schools Group. Doha is opening with Education Avenue Group on a purpose-built campus.',
    image: '/images/campus/benefits/benefits-uk-lab.jpg',
    imageAlt: 'Students in a science laboratory at a British independent school',
    imageCaption: 'Operating standard delivered with local partners · Ellesmere College',
  },
]
