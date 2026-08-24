/**
 * Investor-facing partnership benefits drawn from ECI's Ellesmere Difference framework:
 * what a full partnership delivers beyond a transactional licence.
 * Do not invent fee yields, IRR, or unreleased financials.
 *
 * Plates are UK campus imagery exclusive to this module (not reused elsewhere on the site).
 */

export const INVESTOR_BENEFITS_INTRO = {
  eyebrow: 'Partnership benefits',
  title: 'The Ellesmere difference',
  summary:
    'A high-involvement partnership model: sustained collaboration across brand, curriculum, people, quality and pupil experience, not a logo licence with occasional check-ins.',
} as const

export type InvestorBenefit = {
  id: string
  /** Short index label for the topic rail */
  label: string
  title: string
  benefit: string
  image: string
  imageAlt: string
  /** Short plate caption under the image */
  imageCaption: string
}

export const INVESTOR_BENEFITS: InvestorBenefit[] = [
  {
    id: 'active-partnership',
    label: 'Active partnership',
    title: 'High involvement, not a distant licence',
    benefit:
      'ECI operates as an active partner. Each year, Ellesmere UK and the campus agree a defined set of focus areas so support stays targeted and relevant. Strategic decisions are made jointly: Ellesmere brings institutional knowledge; the partner brings local market and regulatory expertise. Investors and operators get named UK contacts and shared accountability, not a brand fee with an annual survey.',
    image: '/images/campus/uk-boarding.jpg',
    imageAlt: 'Boarders in a house common room at Ellesmere College',
    imageCaption: 'Partnership in practice · Ellesmere College',
  },
  {
    id: 'brand-framework',
    label: 'Brand & digital',
    title: 'Brand representation you can launch with',
    benefit:
      'Ellesmere supports each partner school in adapting the Ellesmere UK website framework for local use, so families see a credible identity from day one. Content is co-developed for the local market, with set-up support, training and ongoing monitoring from the UK. That shortens the path from licence to a recognisable school brand without building digital presence from scratch.',
    image: '/images/campus/benefits/benefits-uk-grounds.jpg',
    imageAlt: 'Historic brick campus and grounds of a British independent school',
    imageCaption: 'UK campus heritage',
  },
  {
    id: 'curriculum',
    label: 'Curriculum',
    title: 'Curriculum routes with UK depth',
    benefit:
      'ECI provides expert guidance on curriculum routes and subject choices, drawing on Ellesmere’s experience in the UK independent sector. Design is adapted in partnership to meet local regulatory requirements and market expectations, so the academic offer is credible for families and defensible to authorities. Partners are not left to invent pathways alone.',
    image: '/images/campus/uk-lower-school.jpg',
    imageAlt: 'Lower school pupils learning together at Ellesmere College',
    imageCaption: 'Teaching and learning · Ellesmere College',
  },
  {
    id: 'staffing',
    label: 'Staffing',
    title: 'Leadership recruitment and staff development',
    benefit:
      'Through established recruitment partners, Ellesmere can support the hiring of key leadership staff, initially Heads and Deputy Heads, alongside whole-staff training and ongoing professional development. That helps partners attract and retain the people who make a premium school work, rather than navigating international recruitment without a network behind them.',
    image: '/images/campus/benefits/benefits-uk-study.jpg',
    imageAlt: 'Students studying in a British independent school library',
    imageCaption: 'Academic culture · UK campus',
  },
  {
    id: 'facilities',
    label: 'Facilities',
    title: 'Facilities planning from UK experience',
    benefit:
      'The Ellesmere team can assist in planning school buildings and facilities across all age groups. Advice is grounded in best practice and long experience of academic and facilities planning in boarding and day school settings. Whether the campus is purpose-built or repurposed, partners gain informed guidance on layout and functionality for the intended school model.',
    image: '/images/campus/benefits/benefits-uk-sport.jpg',
    imageAlt: 'Students on the playing fields of a British independent school campus',
    imageCaption: '160-acre UK campus setting',
  },
  {
    id: 'uk-support',
    label: 'UK support',
    title: 'Embedded support from Ellesmere UK',
    benefit:
      'Direct support is structured and multi-layered: staff training and mentoring, departmental links between UK and partner teams, resource sharing, appraisals for Heads and Deputy Heads, recruitment advice, and further guidance as required. This is access to the wider Ellesmere community of staff and departments, not a single relationship manager.',
    image: '/images/campus/benefits/benefits-uk-lab.jpg',
    imageAlt: 'Students in a science laboratory at a British independent school',
    imageCaption: 'Science and practical learning · UK campus',
  },
  {
    id: 'quality-assurance',
    label: 'Quality',
    title: 'Quality assurance that protects reputation',
    benefit:
      'Quality assurance within the partnership is an ongoing, collaborative process. Regular review and reflection let both parties assess progress, identify development areas and adjust plans. Ambitious, aligned targets are set against honest evaluation. For investors, that reduces the risk of quality drift that can damage fees, enrolment and long-term asset value.',
    image: '/images/campus/uk-sixth-form.jpg',
    imageAlt: 'Sixth-form student in a science laboratory at Ellesmere College',
    imageCaption: 'Sixth Form · Ellesmere College',
  },
  {
    id: 'marketing-growth',
    label: 'Marketing',
    title: 'Marketing and admissions support',
    benefit:
      'Ellesmere supports partner marketing and admissions through published guidance, shared materials and strategic advice on campaign planning. ECI also provides regular online support and agreed in-person visits to work directly with Admissions and Marketing staff. Partners benefit from Ellesmere’s experience of school marketing and pupil recruitment, adapted for local context.',
    image: '/images/campus/uk-campus-1.png',
    imageAlt: 'Students on the lawn in front of the main building at Ellesmere College, Shropshire',
    imageCaption: 'Ellesmere College, Shropshire',
  },
  {
    id: 'pupil-distinction',
    label: 'Pupil experience',
    title: 'Exchange, immersion and community',
    benefit:
      'Partner schools can plan visits to Ellesmere UK for academic, sporting and cultural experiences, with reciprocal visits where possible. Groups can also arrange week-long language immersion stays: pupils join regular lessons, sports and activities alongside Ellesmere students and stay in purpose-built boarding accommodation. ECI advises on parent and community engagement so partners build reputation and recruitment through an engaged family network.',
    image: '/images/campus/uk-campus-life.jpg',
    imageAlt: 'Pupils on campus at Ellesmere College',
    imageCaption: 'Boarding and campus life · UK',
  },
  {
    id: 'long-term-commitment',
    label: 'Long-term',
    title: 'A partnership built to last',
    benefit:
      'Ellesmere College was founded in 1884. That heritage reflects an institutional culture of continuity, trust and long-term relationships. Any partnership with ECI is conceived with permanence in mind: the relationship is designed to deepen over time, not to be managed at arm’s length once the school is open. Investors underwriting a campus can align with a licensor that treats international work as core, not experimental.',
    image: '/images/campus/uk-historic.jpg',
    imageAlt: 'Historic buildings at Ellesmere College',
    imageCaption: 'Founded 1884 · Ellesmere College',
  },
]
