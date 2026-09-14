/** Public + portal content for ECI introduction agents (investor connectors). */

export const AGENT_PROGRAM = {
  eyebrow: 'Introduction agents',
  title: 'Introduce capital that can build',
  summary:
    'Invited agents open doors to investors and operators who can fund and run a British-heritage campus. ECI briefs you, qualifies the introduction, and leads the partnership.',
  punchline: 'You open the door. We deliver the partnership.',
}

/** Keep this short, agents need a clear brief, not a brochure. */
export const AGENT_WHAT_YOU_DO = [
  {
    title: 'Who to introduce',
    body: 'Family offices, education funds, experienced operators, and developers with land or campus projects in our ranked growth markets.',
  },
  {
    title: 'What you get',
    body: 'Portal briefing, approved materials, ranked destinations, and a named ECI contact. Status on every referral stays visible.',
  },
] as const

export const AGENT_VALUE_PROPS = AGENT_WHAT_YOU_DO

export const AGENT_HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Get invited',
    body: 'ECI grants portal access to agents who know education investment and our MENA focus.',
  },
  {
    step: '02',
    title: 'Brief yourself',
    body: 'Partnership models, Top 10 destinations, and the services framework, ready to use in conversation.',
  },
  {
    step: '03',
    title: 'Introduce with context',
    body: 'Submit the investor or operator with market interest, capacity, and timing, not a cold name dump.',
  },
  {
    step: '04',
    title: 'ECI leads',
    body: 'Diligence and structuring sit with us. You stay informed as the introduction moves.',
  },
] as const

export const AGENT_IDEAL_INTROS = [
  'Family offices and education-focused funds seeking MENA school platforms',
  'Operators exploring British-heritage affiliation',
  'Developers with education land in priority destinations',
  'Partners with regulatory access in Egypt, KSA, Bahrain, Morocco, UAE or Oman',
]

export const AGENT_PORTAL_HIGHLIGHTS = [
  {
    title: 'Opportunity briefing',
    body: 'Talking points, partnership models, and how to work with ECI.',
    href: '/agent/briefing',
  },
  {
    title: 'Toolkit',
    body: 'Ranked markets and approved materials for investor conversations.',
    href: '/agent/toolkit',
  },
  {
    title: 'Referral desk',
    body: 'Submit and track investor introductions through a structured referral form.',
    href: '/agent/referrals',
  },
] as const

export const DEMO_AGENT_REFERRALS = [
  {
    id: 'ref-1',
    organisation: 'Horizon Education Capital',
    contact: 'Sara Al-Harthy',
    market: 'New Cairo / Egypt',
    status: 'In review' as const,
    submitted: '2026-07-12',
  },
  {
    id: 'ref-2',
    organisation: 'Gulf Campus Partners',
    contact: 'James Whitfield',
    market: 'Abu Dhabi / UAE',
    status: 'Introduced' as const,
    submitted: '2026-06-28',
  },
  {
    id: 'ref-3',
    organisation: 'Atlas Family Office',
    contact: 'Nadia Benali',
    market: 'Rabat / Morocco',
    status: 'Qualified' as const,
    submitted: '2026-05-19',
  },
]
