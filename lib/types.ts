export type UserRole =
  | 'investor'
  | 'school_partner'
  | 'employee'
  | 'board_member'
  | 'admin'
  | 'super_admin'
  | 'agent'

/** Introduction partner lifecycle inside the agent/rainmaker portal. */
export type PartnerStatus = 'applicant' | 'accepted'
export type PartnerChannel = 'agent' | 'rainmaker'

export type SchoolStatus = 'prospect' | 'setting_up' | 'active' | 'paused'
export type DocType = 'guidance' | 'template' | 'policy' | 'form' | 'report' | 'marketing' | 'due_diligence'
export type DocScope = 'network' | 'school' | 'investor_marketing' | 'investor_dd' | 'team'
export type EventVisibility = 'network' | 'school' | 'internal'
export type ThreadType = 'direct' | 'school_channel' | 'team'

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  school_id: string | null
  job_title: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  /** Null for non-introduction roles. Applicants see briefing; accepted unlock marketing. */
  partner_status: PartnerStatus | null
  partner_channel: PartnerChannel | null
}

export interface School {
  id: string
  name: string
  country: string
  city: string
  status: SchoolStatus
  logo_url: string | null
  website: string | null
  contact_name: string | null
  contact_email: string | null
  student_count: number | null
  year_joined: number | null
  curriculum: string[] | null
  accreditations: string[] | null
  description: string | null
  short_bio: string | null
  is_public: boolean
  image_url?: string | null
}

export interface DocumentCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  sort_order: number
}

export interface Document {
  id: string
  title: string
  description: string | null
  category_id: string | null
  doc_type: DocType
  access_level: string
  scope: DocScope
  school_id: string | null
  folder_path: string | null
  parent_folder_id: string | null
  file_url: string | null
  file_name: string | null
  file_size_kb: number | null
  version: string | null
  is_published: boolean
  download_count: number
  created_at: string
  document_categories?: DocumentCategory
}

export interface Announcement {
  id: string
  title: string
  body: string
  audience: UserRole[] | null
  is_pinned: boolean
  published_at: string
}

export interface InvestorEnquiry {
  id: string
  full_name: string
  organisation: string | null
  email: string
  phone: string | null
  country: string | null
  investment_type: string | null
  message: string | null
  status: string
  created_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  starts_at: string
  ends_at: string
  /** Legacy / RLS hint: derived from calendar targeting. */
  visibility: EventVisibility
  /** Legacy single-school pointer; prefer school_ids. */
  school_id: string | null
  /** School calendars this block appears on. */
  school_ids: string[]
  /** When true, appears on the admin / ECI team calendar. */
  show_on_admin: boolean
  /** When true, appears on every school calendar. */
  all_schools: boolean
  location: string | null
  created_by: string | null
  /** IANA timezone for the meeting wall clock (e.g. Asia/Riyadh). */
  timezone: string
  /** People attending, display names for coordination. */
  attendees: string[]
}

export interface MessageThread {
  id: string
  thread_type: ThreadType
  title: string | null
  school_id: string | null
  updated_at: string
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  body: string
  created_at: string
  attachment_url?: string | null
}

export interface ChatCitation {
  title: string
  source: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  citations?: ChatCitation[]
}
