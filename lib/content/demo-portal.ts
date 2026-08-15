import { UserRole } from '@/lib/types'
import { Document, DocumentCategory } from '@/lib/types'

/** Demo / offline document trees when Supabase is empty or unavailable. */
export const DEMO_NETWORK_DOCS: Document[] = [
  {
    id: 'n1',
    title: 'ECI Quality Assurance Framework',
    description: 'Inspection cadence, self-evaluation and brand protection standards for all network schools.',
    category_id: 'qa',
    doc_type: 'policy',
    access_level: 'school_partner',
    scope: 'network',
    school_id: null,
    folder_path: '/Quality Assurance',
    parent_folder_id: null,
    file_url: null,
    file_name: 'ECI-QA-Framework.pdf',
    file_size_kb: 840,
    version: '2.1',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
    document_categories: { id: 'qa', name: 'Quality Assurance', description: null, icon: 'shield', sort_order: 1 },
  },
  {
    id: 'n2',
    title: 'Safeguarding Policy Template',
    description: 'Network-aligned safeguarding policy template for localisation.',
    category_id: 'safeguarding',
    doc_type: 'template',
    access_level: 'school_partner',
    scope: 'network',
    school_id: null,
    folder_path: '/Safeguarding',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Safeguarding-Template.docx',
    file_size_kb: 220,
    version: '1.4',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
    document_categories: { id: 'safeguarding', name: 'Safeguarding', description: null, icon: 'heart', sort_order: 2 },
  },
  {
    id: 'n3',
    title: 'Curriculum Mapping — IGCSE to Pre-University',
    description: 'Shared curriculum guidance for British pathway schools in the network.',
    category_id: 'curriculum',
    doc_type: 'guidance',
    access_level: 'school_partner',
    scope: 'network',
    school_id: null,
    folder_path: '/Curriculum',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Curriculum-Mapping.pdf',
    file_size_kb: 1200,
    version: '3.0',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
    document_categories: { id: 'curriculum', name: 'Curriculum', description: null, icon: 'book', sort_order: 3 },
  },
]

export const DEMO_SCHOOL_DOCS: Document[] = [
  {
    id: 's1',
    title: 'Local Staff Handbook',
    description: 'School-specific staff handbook and local procedures.',
    category_id: 'local',
    doc_type: 'policy',
    access_level: 'school_partner',
    scope: 'school',
    school_id: 'local',
    folder_path: '/Handbooks',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Staff-Handbook.pdf',
    file_size_kb: 640,
    version: '1.0',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
    document_categories: { id: 'local', name: 'Local', description: null, icon: 'users', sort_order: 1 },
  },
  {
    id: 's2',
    title: 'Campus Lease Summary',
    description: 'Confidential school-specific commercial summary.',
    category_id: 'local',
    doc_type: 'report',
    access_level: 'school_partner',
    scope: 'school',
    school_id: 'local',
    folder_path: '/Commercial',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Lease-Summary.pdf',
    file_size_kb: 410,
    version: '1.0',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
]

export const DEMO_INVESTOR_MARKETING: Document[] = [
  {
    id: 'im1',
    title: 'ECI Network Overview Deck',
    description: 'Marketing overview of the Ellesmere International opportunity.',
    category_id: null,
    doc_type: 'marketing',
    access_level: 'investor',
    scope: 'investor_marketing',
    school_id: null,
    folder_path: '/Marketing',
    parent_folder_id: null,
    file_url: null,
    file_name: 'ECI-Overview.pdf',
    file_size_kb: 2400,
    version: '2026.1',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
]

export const DEMO_INVESTOR_DD: Document[] = [
  {
    id: 'id1',
    title: 'Partnership Term Sheet (illustrative)',
    description: 'Illustrative commercial structure for full partnership discussions.',
    category_id: null,
    doc_type: 'due_diligence',
    access_level: 'investor',
    scope: 'investor_dd',
    school_id: null,
    folder_path: '/Due Diligence',
    parent_folder_id: null,
    file_url: null,
    file_name: 'Term-Sheet.pdf',
    file_size_kb: 320,
    version: 'Draft',
    is_published: true,
    download_count: 0,
    created_at: new Date().toISOString(),
  },
]

export const DEMO_CATEGORIES: DocumentCategory[] = [
  { id: 'qa', name: 'Quality Assurance', description: null, icon: 'shield', sort_order: 1 },
  { id: 'safeguarding', name: 'Safeguarding', description: null, icon: 'heart', sort_order: 2 },
  { id: 'curriculum', name: 'Curriculum', description: null, icon: 'book', sort_order: 3 },
  { id: 'local', name: 'Local', description: null, icon: 'users', sort_order: 4 },
]

export function demoEvents() {
  const now = new Date()
  const addDays = (d: number, h = 10) => {
    const x = new Date(now)
    x.setDate(x.getDate() + d)
    x.setHours(h, 0, 0, 0)
    return x.toISOString()
  }
  return [
    {
      id: 'e1',
      title: 'Network Heads briefing',
      description: 'Monthly leadership sync across partner schools.',
      starts_at: addDays(3, 9),
      ends_at: addDays(3, 10),
      visibility: 'network' as const,
      school_id: null,
      school_ids: [] as string[],
      show_on_admin: true,
      all_schools: true,
      location: 'Online',
      created_by: null,
    },
    {
      id: 'e2',
      title: 'Riyadh quality visit',
      description: 'On-site QA and curriculum support visit — booked on Admin and Riyadh calendars.',
      starts_at: addDays(10, 8),
      ends_at: addDays(12, 16),
      visibility: 'school' as const,
      school_id: 'riyadh',
      school_ids: ['riyadh'],
      show_on_admin: true,
      all_schools: false,
      location: 'Ellesmere College Riyadh',
      created_by: null,
    },
    {
      id: 'e3',
      title: 'Doha launch planning',
      description: 'Internal ECI planning workshop for Doha opening — admin calendar only.',
      starts_at: addDays(5, 14),
      ends_at: addDays(5, 16),
      visibility: 'internal' as const,
      school_id: null,
      school_ids: [] as string[],
      show_on_admin: true,
      all_schools: false,
      location: 'ECI Office',
      created_by: null,
    },
  ]
}

export const DEMO_MESSAGES = [
  {
    id: 'm1',
    thread_id: 't1',
    sender_id: 'eci',
    sender_name: 'ECI Operations',
    body: 'Welcome to the ECI messaging channel. Use this space for quick coordination with the central team — calendar invites and document links welcome.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'm2',
    thread_id: 't1',
    sender_id: 'school',
    sender_name: 'School Partner',
    body: 'Thank you — we will share our term-date draft here once finalised.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
]

export type DemoAudienceRole = UserRole
