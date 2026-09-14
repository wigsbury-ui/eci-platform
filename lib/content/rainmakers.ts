/** Public content for ECI rainmaker referral network. */

export const RAINMAKER_PROGRAM = {
  eyebrow: 'Rainmakers',
  title: 'Warm introductions from people who know Ellesmere',
  summary:
    'Alumni, former parents and friends of the College who can open doors formal outreach often misses, motivated by loyalty to the school, not volume.',
  punchline: 'Personal trust. One clear offer.',
}

export const RAINMAKER_WHAT_YOU_DO = [
  {
    title: 'Your role',
    body: 'Identify investors who fit ECI’s standard, register the lead before outreach, then make a warm introduction once ECI confirms the prospect is free.',
  },
  {
    title: 'How you are recognised',
    body: 'Successful referrals can attract a share of the initial licensing fee and milestone recognition when a school opens, terms sit in a Referral Partner Agreement.',
  },
] as const

/** @deprecated Prefer RAINMAKER_WHAT_YOU_DO on the public page */
export const RAINMAKER_VALUE_PROPS = [
  {
    title: 'Ambassadors, not brokers',
    body: 'Notable alumni, former parents or industry allies with deep local networks. Motivated by loyalty to Ellesmere’s mission, not fees alone.',
  },
  {
    title: 'High-trust introductions',
    body: 'Gently vet investors for financial solidity and education values, then open the door with personal endorsement.',
  },
  {
    title: 'Structured incentives',
    body: 'A calibrated share of the initial licensing fee, with milestone recognition when a school opens or hits early enrolment.',
  },
  {
    title: 'Clear eligibility',
    body: 'Trustworthy, professionally reputable and values-aligned. Each rainmaker signs a Referral Partner Agreement.',
  },
] as const

export const RAINMAKER_PROCESS = [
  {
    step: '01',
    title: 'Register the lead',
    body: 'Log the prospect with ECI before any outreach.',
  },
  {
    step: '02',
    title: 'Confirm it is new',
    body: 'ECI checks no agent or rainmaker already holds the same name.',
  },
  {
    step: '03',
    title: 'Warm introduction',
    body: 'Once cleared, you open the door; ECI leads the partnership talks.',
  },
  {
    step: '04',
    title: 'Stay as the bridge',
    body: 'Remain involved as relationship bridge while the central pipeline tracks outcomes.',
  },
] as const

export const RAINMAKER_VS_AGENT = [
  {
    category: 'Incentives',
    rainmaker:
      'Success-based rewards, share of licensing revenue, milestone bonuses, and recognition.',
    agent: 'Commission or finder’s fees, typically a percentage of licensing fees.',
  },
  {
    category: 'Reach & network',
    rainmaker: 'Personal, high-trust connections into alumni and local circles.',
    agent: 'Broader market coverage, lists, expos and structured outreach.',
  },
  {
    category: 'Control & alignment',
    rainmaker: 'Independent but ethos-aligned; brand risk is personal reputation.',
    agent: 'Formal control via contract; may represent multiple brands.',
  },
  {
    category: 'Scalability',
    rainmaker: 'Selective and high-impact, a few trusted referrers per region.',
    agent: 'Easier to scale in number across markets, with more oversight.',
  },
] as const

export const RAINMAKER_ALIGNMENT = [
  'Agents cover markets without an alumni presence; rainmakers unlock introductions in circles of trust.',
  'Territories are coordinated so the same prospect is never approached twice.',
  'All prospects feed one central ECI pipeline, regardless of source.',
] as const
