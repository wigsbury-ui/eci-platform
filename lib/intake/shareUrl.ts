import { getIntakeUploadToken } from '@/lib/intake/config'

export function getSiteBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://eci-platform-seven.vercel.app'
  )
}

export function getIntakeShareUrl() {
  const token = getIntakeUploadToken()
  if (!token) return null
  return `${getSiteBaseUrl()}/intake/${token}`
}
