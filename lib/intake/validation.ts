import { INTAKE_ALLOWED_EXTENSIONS, INTAKE_MAX_FILE_BYTES } from '@/lib/intake/config'

export function isAllowedIntakeFile(file: File) {
  const name = file.name.toLowerCase()
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot) : ''
  if (INTAKE_ALLOWED_EXTENSIONS.has(ext)) return true
  // Allow unknown extension if browser reports a common office mime
  const mime = file.type.toLowerCase()
  if (!mime || mime === 'application/octet-stream') return ext.length > 0
  return (
    mime.startsWith('image/') ||
    mime.startsWith('text/') ||
    mime.includes('pdf') ||
    mime.includes('word') ||
    mime.includes('excel') ||
    mime.includes('spreadsheet') ||
    mime.includes('powerpoint') ||
    mime.includes('presentation') ||
    mime.includes('zip')
  )
}

export function validateIntakeFile(file: File): string | null {
  if (file.size > INTAKE_MAX_FILE_BYTES) {
    return `${file.name} exceeds the 50 MB limit`
  }
  if (!isAllowedIntakeFile(file)) {
    return `${file.name} is not an allowed file type`
  }
  return null
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
