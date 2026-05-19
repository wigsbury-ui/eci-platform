export type UserRole = 'investor' | 'school_partner' | 'admin' | 'board_member'
export type SchoolStatus = 'prospect' | 'setting_up' | 'active' | 'paused'
export type DocType = 'guidance' | 'template' | 'policy' | 'form' | 'report'

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  school_id: string | null
  job_title: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
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
