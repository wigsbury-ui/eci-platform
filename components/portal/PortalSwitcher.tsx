'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { accessiblePortals, portalKeyFromPath } from '@/lib/auth/roles'
import type { UserRole } from '@/lib/types'

export default function PortalSwitcher({
  role,
  accent,
}: {
  role?: UserRole | string | null
  accent: string
}) {
  const pathname = usePathname()
  const portals = accessiblePortals(role)
  if (portals.length < 2) return null

  const current = portalKeyFromPath(pathname)

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <p className="text-[10px] font-jost font-semibold uppercase tracking-wider text-white/40 px-1 mb-2">
        Switch portal
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {portals.map(p => {
          const active = p.key === current
          return (
            <Link
              key={p.key}
              href={p.href}
              className="rounded-md px-2 py-1.5 text-[11px] font-jost font-semibold text-center transition-colors"
              style={
                active
                  ? { background: accent, color: '#2D1654' }
                  : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }
              }
              aria-current={active ? 'page' : undefined}
            >
              {p.shortLabel}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
