import { headers } from 'next/headers'
import { getEnvIntakeToken } from '@/lib/intake/config'
import { buildIntakeShareUrl } from '@/lib/intake/links'

export async function resolveSiteBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv

  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto = h.get('x-forwarded-proto') || 'https'
    if (host) return `${proto}://${host}`
  } catch {
    /* headers() unavailable outside request */
  }

  return 'https://eci-platform-seven.vercel.app'
}

/** Legacy env-based URL only. Prefer ensureDefaultIntakeLink + buildIntakeShareUrl. */
export function getLegacyEnvIntakeShareUrl(siteBase: string) {
  const token = getEnvIntakeToken()
  if (!token) return null
  return buildIntakeShareUrl(siteBase, token)
}
