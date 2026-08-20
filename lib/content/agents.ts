/** Public + portal content for ECI introduction agents (investor connectors). */

export const AGENT_PROGRAM = {
  eyebrow: 'Introduction agents',
  title: 'Connect investors with Ellesmere',
  summary:
    'ECI works with trusted agents who introduce aligned investors and operators ready to build a school under the Ellesmere brand, with clear briefing materials and a dedicated portal.',
  punchline: 'You open the door. We deliver the partnership.',
}

export const AGENT_VALUE_PROPS = [
  {
    title: 'A clear offer to introduce',
    body: 'Brand licensing to build an Ellesmere school: British heritage, live campuses, and quality protection. Conversations start with substance.',
  },
  {
    title: 'Serious counterparties only',
    body: 'We seek capital and operators who value educational quality and long-term brand stewardship. Your introductions are qualified against that standard.',
  },
  {
    title: 'Supported engagement',
    body: 'Invited agents receive briefing packs, market summaries, and a direct channel into the ECI team — so every introduction is briefed and tracked.',
  },
  {
    title: 'Transparent process',
    body: 'From first introduction through qualification and handoff, the agent portal keeps status visible. Commercial terms for successful introductions are agreed separately with ECI.',
  },
] as const

export const AGENT_HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Become an invited agent',
    body: 'ECI grants portal access to agents who understand education investment and our MENA focus.',
  },
  {
    step: '02',
    title: 'Brief yourself on the offer',
    body: 'Use the portal for the brand-licensing pitch, priority destinations, and approved talking points.',
  },
  {
    step: '03',
    title: 'Introduce aligned investors',
    body: 'Submit qualified investor or operator introductions with context — market interest, capacity, and timing.',
  },
  {
    step: '04',
    title: 'ECI leads the partnership',
    body: 'Our team takes diligence and structuring. You stay informed as the introduction progresses.',
  },
] as const

export const AGENT_IDEAL_INTROS = [
  'Family offices and education-focused funds seeking MENA school platforms',
  'Experienced school operators exploring British-heritage affiliation',
  'Developers with education land or campus projects in priority destinations',
  'Strategic partners with regulatory access in Egypt, KSA, Bahrain, Morocco, UAE or Oman',
]

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
