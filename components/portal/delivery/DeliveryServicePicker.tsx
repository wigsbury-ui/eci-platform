'use client'

import { useMemo, useState } from 'react'
import {
  PARTNER_SERVICES,
  SERVICE_GROUPS,
  servicesByGroup,
  type PartnerService,
  type ServiceGroupId,
} from '@/lib/content/partner-services'
import type { ServicePromise } from '@/lib/delivery/types'
import { Plus, X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  schoolName: string
  trackedServiceIds: Set<string>
  onActivateGroup: (group: ServiceGroupId) => Promise<void>
  onActivateService: (service: PartnerService) => Promise<void>
  activating?: boolean
}

export default function DeliveryServicePicker({
  open,
  onClose,
  schoolName,
  trackedServiceIds,
  onActivateGroup,
  onActivateService,
  activating,
}: Props) {
  const [group, setGroup] = useState<ServiceGroupId>(1)

  const services = servicesByGroup(group)
  const groupMeta = SERVICE_GROUPS.find(g => g.id === group)
  const untrackedInGroup = services.filter(s => !trackedServiceIds.has(s.id))
  const trackedInGroup = services.filter(s => trackedServiceIds.has(s.id))

  const groupCounts = useMemo(() => {
    const counts: Record<number, { tracked: number; total: number }> = {}
    for (const g of SERVICE_GROUPS) {
      const list = servicesByGroup(g.id)
      counts[g.id] = {
        total: list.length,
        tracked: list.filter(s => trackedServiceIds.has(s.id)).length,
      }
    }
    return counts
  }, [trackedServiceIds])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col"
        role="dialog"
        aria-labelledby="service-picker-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="service-picker-title" className="font-cormorant text-2xl text-[#2D1654]">
              Add services to track
            </h2>
            <p className="font-jost text-sm text-gray-500 mt-1">
              Choose from the Partner Services catalog for <strong className="text-[#2D1654]">{schoolName}</strong>.
              Each service becomes one item you can update with status, owner, and evidence.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-gray-50 bg-gray-50/50">
          {SERVICE_GROUPS.map(g => {
            const c = groupCounts[g.id]
            const complete = c.tracked >= c.total
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(g.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-jost font-medium border transition-colors ${
                  group === g.id
                    ? 'border-[#2D1654] bg-[#2D1654] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {g.id === 1 ? 'Obligations' : g.id === 2 ? 'Core' : 'Premium'}
                <span className={`ml-1.5 text-xs ${group === g.id ? 'text-white/70' : 'text-gray-400'}`}>
                  {c.tracked}/{c.total}
                </span>
                {complete && (
                  <span className="ml-1 text-xs" aria-label="All added">✓</span>
                )}
              </button>
            )
          })}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {groupMeta && (
            <div className="rounded-lg bg-[#F8F4EF] px-4 py-3">
              <p className="font-jost text-sm font-semibold text-[#2D1654]">{groupMeta.title}</p>
              <p className="font-jost text-xs text-gray-600 mt-0.5">{groupMeta.subtitle}</p>
            </div>
          )}

          {untrackedInGroup.length > 0 && (
            <div>
              <button
                type="button"
                disabled={activating}
                onClick={() => onActivateGroup(group)}
                className="w-full rounded-xl border-2 border-dashed border-[#C8A84B] bg-[#F8F4EF]/60 px-4 py-3 text-left hover:bg-[#F8F4EF] disabled:opacity-50 transition-colors"
              >
                <p className="font-jost text-sm font-semibold text-[#2D1654]">
                  Add all {untrackedInGroup.length} {group === 1 ? 'obligation' : 'service'}{untrackedInGroup.length === 1 ? '' : 's'} at once
                </p>
                <p className="font-jost text-xs text-gray-500 mt-0.5">
                  Recommended for new schools — adds everything in this tier in one step.
                </p>
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {services.map(service => {
              const tracked = trackedServiceIds.has(service.id)
              return (
                <li
                  key={service.id}
                  className={`rounded-lg border px-4 py-3 flex items-start justify-between gap-3 ${
                    tracked ? 'border-emerald-100 bg-emerald-50/40' : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-jost text-sm font-semibold text-[#2D1654]">{service.name}</p>
                    <p className="font-jost text-xs text-gray-500 mt-0.5 line-clamp-2">{service.overview}</p>
                  </div>
                  {tracked ? (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-jost font-bold uppercase text-emerald-800">
                      Tracking
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={activating}
                      onClick={() => onActivateService(service)}
                      className="shrink-0 flex items-center gap-1 rounded-lg bg-[#2D1654] px-3 py-1.5 text-xs font-jost font-semibold text-white hover:bg-[#4C2585] disabled:opacity-50"
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          {trackedInGroup.length > 0 && untrackedInGroup.length === 0 && (
            <p className="font-jost text-sm text-center text-gray-500 py-2">
              All services in this tier are already being tracked.
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/80">
          <p className="font-jost text-xs text-gray-500 text-center">
            {PARTNER_SERVICES.length} services in the full catalog across 3 tiers
          </p>
        </div>
      </div>
    </div>
  )
}
