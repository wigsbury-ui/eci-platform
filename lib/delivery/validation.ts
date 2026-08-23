import {
  DELIVERY_ALLOWED_EXTENSIONS,
  DELIVERY_MAX_FILE_BYTES,
} from '@/lib/delivery/config'

export function validateDeliveryEvidenceFile(file: File): string | null {
  if (file.size > DELIVERY_MAX_FILE_BYTES) {
    return `${file.name} exceeds the 50 MB limit`
  }
  const name = file.name.toLowerCase()
  const dot = name.lastIndexOf('.')
  const ext = dot >= 0 ? name.slice(dot) : ''
  if (!DELIVERY_ALLOWED_EXTENSIONS.has(ext)) {
    return `${file.name} is not an allowed file type`
  }
  return null
}

export function sanitizeDeliveryFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 180)
}
