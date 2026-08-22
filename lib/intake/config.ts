export const INTAKE_BUCKET = 'doc-intake'

export const INTAKE_MAX_FILE_BYTES = 50 * 1024 * 1024
export const INTAKE_MAX_FILES_PER_BATCH = 25

export const INTAKE_PILLARS = [
  { value: 'governance', label: 'Governance & brand' },
  { value: 'safeguarding', label: 'Safeguarding' },
  { value: 'curriculum', label: 'Curriculum' },
  { value: 'operations', label: 'Operations' },
  { value: 'quality_assurance', label: 'Quality assurance' },
] as const

export type IntakePillar = (typeof INTAKE_PILLARS)[number]['value']

export const INTAKE_BATCH_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In review' },
  { value: 'ready_for_articulation', label: 'Ready for articulation' },
  { value: 'promoted', label: 'Promoted to library' },
  { value: 'archived', label: 'Archived' },
] as const

export type IntakeBatchStatus = (typeof INTAKE_BATCH_STATUSES)[number]['value']

/** Extensions we accept on the intake dropzone (broad office formats). */
export const INTAKE_ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.rtf',
  '.csv',
  '.odt',
  '.ods',
  '.odp',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.heic',
  '.zip',
])

export function getIntakeUploadToken() {
  return process.env.DOCUMENT_INTAKE_TOKEN?.trim() || process.env.INTAKE_UPLOAD_TOKEN?.trim() || ''
}

export function isValidIntakeToken(token: string) {
  const expected = getIntakeUploadToken()
  if (!expected) return false
  return token === expected
}

export function sanitizeStorageFileName(name: string) {
  const base = name.replace(/[/\\]/g, '_').replace(/[^\w.\- ()]/g, '_').slice(0, 180)
  return base || 'upload.bin'
}
