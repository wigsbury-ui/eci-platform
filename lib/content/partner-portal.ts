/** Content tailored for introduction agents and rainmakers — portal tiers only. */

import { HERITAGE, OPERATING_SCHOOLS, OPENING_SOON, PRIMARY_PARTNERSHIP } from '@/lib/content/network'
import { Document } from '@/lib/types'

export const PARTNER_ABOUT = {
  eyebrow: 'About ECI',
  title: 'Ellesmere College International',
  summary:
    'ECI extends Ellesmere College — a British independent school founded in 1884 — through brand licensing. Investors build and operate schools under the Ellesmere name; we protect standards.',
  facts: [
    { label: 'Founded', value: String(HERITAGE.founded) },
    { label: 'Heritage campus', value: `${HERITAGE.campusAcres} acres, Shropshire` },
    { label: 'Ethos', value: HERITAGE.tagline },
    { label: 'Contact', value: HERITAGE.email },
  ],
  campuses: [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    name: s.name,
    place: `${s.city}, ${s.country}`,
    status: s.status === 'active' ? 'Operating' : 'Opening soon',
  })),
  coreOffer: {
    title: PRIMARY_PARTNERSHIP.title,
    body: PRIMARY_PARTNERSHIP.summary,
  },
} as const

export const PARTNER_WHY = {
  eyebrow: 'Why partner',
  title: 'Why introduce investors to ECI',
  summary:
    'Your introductions should be easy to explain. Keep the case to three points: heritage quality, live campuses, and a licensing model that protects the brand.',
  points: [
    {
      title: 'A clear product',
      body: 'Brand licensing to build an Ellesmere school — not a catalogue of equal options. Curriculum and advisory are add-ons only when needed.',
    },
    {
      title: 'Proof, not a paper franchise',
      body: 'Riyadh and Muscat operate today; Doha is opening. Investors can see the standard transferring across the Middle East.',
    },
    {
      title: 'Quality protection',
      body: 'ECI licenses the name, supports leadership, and governs standards so the brand stays worth introducing.',
    },
    {
      title: 'Defined markets',
      body: 'A ranked destination set helps you aim introductions where demand and cultural fit support an Ellesmere campus.',
    },
  ],
  agentAngle:
    'Agents: introduce capital and operators who want to build under the brand. ECI leads diligence and structuring.',
  rainmakerAngle:
    'Rainmakers: open warm doors from trusted networks. You endorse the fit; ECI runs the partnership conversation.',
} as const

export const PARTNER_CONTRACTS = {
  eyebrow: 'Sample contracts',
  title: 'Agreements before you join',
  summary:
    'Review the sample terms for your channel. These are illustrative. Final commercial terms are agreed with ECI when you are accepted as a partner.',
  agent: {
    title: 'Introduction Agent Agreement (sample)',
    body: 'Covers territory expectations, qualified introduction criteria, confidentiality, brand representation, and success-based fees for completed introductions.',
    highlights: [
      'Role: qualified introductions of investors and operators',
      'ECI leads negotiation, diligence, and delivery',
      'Fees only on accepted, completed introductions',
      'Brand and messaging must follow approved materials',
    ],
  },
  rainmaker: {
    title: 'Rainmaker Referral Partner Agreement (sample)',
    body: 'Covers ethics, confidentiality, warm-introduction process, conflict checks against existing leads, and success-based recognition for referrals that complete.',
    highlights: [
      'Role: high-trust warm introductions, not broad brokerage',
      'Register leads with ECI before outreach',
      'No conflicting claim on the same prospect',
      'Recognition tied to completed licensing outcomes',
    ],
  },
} as const

export const DEMO_PARTNER_CONTRACTS: Document[] = [
  {
    id: 'pc-agent',
    title: 'Sample Introduction Agent Agreement',
    description: PARTNER_CONTRACTS.agent.body,
    category_id: null,
    doc_type: 'template',
    access_level: 'agent',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Contracts',
    parent_folder_id: null,
    file_url: null,
    file_name: 'ECI-Sample-Agent-Agreement.pdf',
    file_size_kb: 280,
    version: 'Sample',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'pc-rainmaker',
    title: 'Sample Rainmaker Referral Partner Agreement',
    description: PARTNER_CONTRACTS.rainmaker.body,
    category_id: null,
    doc_type: 'template',
    access_level: 'agent',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Contracts',
    parent_folder_id: null,
    file_url: null,
    file_name: 'ECI-Sample-Rainmaker-Agreement.pdf',
    file_size_kb: 260,
    version: 'Sample',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
]

/** Marketing pack unlocked after admin acceptance. */
export const DEMO_AGENT_MARKETING: Document[] = [
  {
    id: 'am1',
    title: 'Ellesmere brand one-pager',
    description: 'Short leave-behind for first investor conversations.',
    category_id: null,
    doc_type: 'marketing',
    access_level: 'agent',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Marketing',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Ellesmere-Brand-One-Pager.pdf',
    file_size_kb: 920,
    version: '2026.1',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'am2',
    title: 'Introduction partner talking points',
    description: 'Approved lines for agents and rainmakers — brand licensing only.',
    category_id: null,
    doc_type: 'marketing',
    access_level: 'agent',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Marketing',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Partner-Talking-Points.pdf',
    file_size_kb: 410,
    version: '2026.1',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
]

/** Investor promotional materials for accepted partners to share. */
export const DEMO_AGENT_INVESTOR_PROMO: Document[] = [
  {
    id: 'ap1',
    title: 'ECI Network Overview Deck',
    description: 'Investor-facing overview of the Ellesmere international opportunity.',
    category_id: null,
    doc_type: 'marketing',
    access_level: 'agent',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Investor promo',
    parent_folder_id: null,
    file_url: null,
    file_name: 'ECI-Overview.pdf',
    file_size_kb: 2400,
    version: '2026.1',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ap2',
    title: 'Priority markets snapshot',
    description: 'One-page map of ranked open destinations for investor conversations.',
    category_id: null,
    doc_type: 'marketing',
    access_level: 'agent',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Investor promo',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Priority-Markets-Snapshot.pdf',
    file_size_kb: 680,
    version: '2026.1',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
]
