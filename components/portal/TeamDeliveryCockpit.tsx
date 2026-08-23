'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { School } from '@/lib/types'
import type { DeliveryNotification, PromiseStatus, ServicePromise } from '@/lib/delivery/types'
import DeliverySubNav from '@/components/portal/delivery/DeliverySubNav'
import DeliveryHowItWorks from '@/components/portal/delivery/DeliveryHowItWorks'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import DeliveryNotificationsBanner from '@/components/portal/delivery/DeliveryNotificationsBanner'
import {
  deliveryWins,
  group1Wall,
  quarterFocus,
  schoolSummaries,
} from '@/lib/delivery/stats'

type Props = {
  schools: School[]
  initialPromises: ServicePromise[]
  initialNotifications?: DeliveryNotification[]
  demoMode?: boolean
}

export default function TeamDeliveryCockpit({
  schools,
  initialPromises,
  initialNotifications = [],
  demoMode,
}: Props) {
  const [promises] = useState(initialPromises)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [schoolFilter, setSchoolFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [ownerFilter, setOwnerFilter] = useState<string>('all')

  const owners = useMemo(() => {
    const set = new Set<string>()
    promises.forEach(p => {
      if (p.owner_name) set.add(p.owner_name)
    })
    return [...set].sort()
  }, [promises])

  const filtered = useMemo(() => {
    return promises.filter(p => {
      if (schoolFilter !== 'all' && p.school_id !== schoolFilter) return false
      if (groupFilter !== 'all' && String(p.service_group) !== groupFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (ownerFilter !== 'all' && p.owner_name !== ownerFilter) return false
      return true
    })
  }, [promises, schoolFilter, groupFilter, statusFilter, ownerFilter])

  const summaries = schoolSummaries(schools, promises)
  const quarter = quarterFocus(filtered)
  const wall = group1Wall(filtered)
  const wins = deliveryWins(filtered).slice(0, 6)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Partner delivery</h1>
        <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl">
          Track obligatory and agreed services per school — status, owners, evidence and quarterly reviews.
          {demoMode && ' Showing demo ledger until migration 010 is applied and schools are activated.'}
        </p>
      </div>

      <DeliverySubNav active="/team/delivery" />

      <DeliveryHowItWorks audience="team" />

      <DeliveryNotificationsBanner
        notifications={notifications}
        onMarkRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))}
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <FilterSelect label="School" value={schoolFilter} onChange={setSchoolFilter}>
          <option value="all">All schools</option>
          {schools.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Group" value={groupFilter} onChange={setGroupFilter}>
          <option value="all">All groups</option>
          <option value="1">Group 1</option>
          <option value="2">Group 2</option>
          <option value="3">Group 3</option>
        </FilterSelect>
        <FilterSelect label="Owner" value={ownerFilter} onChange={setOwnerFilter}>
          <option value="all">All owners</option>
          {owners.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter}>
          <option value="all">All statuses</option>
          <option value="green">Green</option>
          <option value="amber">Amber</option>
          <option value="red">Red</option>
          <option value="pending_verification">Awaiting verification</option>
          <option value="over_delivered">Over-delivered</option>
        </FilterSelect>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
            Network health
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {summaries.map(s => {
              const pct = s.group1Total ? Math.round((s.group1Green / s.group1Total) * 100) : 0
              return (
                <Link
                  key={s.schoolId}
                  href={`/team/delivery/schools/${s.schoolId}`}
                  className="rounded-lg border border-gray-100 bg-[#F8F4EF]/50 p-4 hover:border-[#C8A84B]/40 transition-colors"
                >
                  <p className="font-jost font-semibold text-[#2D1654] text-sm">{s.schoolName}</p>
                  <p className="mt-2 font-jost text-2xl font-semibold text-[#4C2585]">{pct}%</p>
                  <p className="font-jost text-xs text-gray-500">Group 1 green</p>
                  <p className="mt-2 font-jost text-xs text-gray-500">
                    {s.overdueCount} overdue · Last review{' '}
                    {s.lastReviewDate ? new Date(s.lastReviewDate).toLocaleDateString() : '—'}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
            This quarter
          </h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {quarter.length === 0 && (
              <li className="font-jost text-sm text-gray-500">Nothing due in this filter set.</li>
            )}
            {quarter.map(p => {
              const school = schools.find(s => s.id === p.school_id)
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="font-jost text-sm text-[#2D1654] truncate">{p.title}</p>
                    <p className="font-jost text-xs text-gray-400">{school?.name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
          <h2 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-amber-800/70 mb-4">
            Group 1 wall
          </h2>
          <ul className="space-y-2">
            {wall.length === 0 && (
              <li className="font-jost text-sm text-gray-600">All Group 1 items green in this view.</li>
            )}
            {wall.map(p => {
              const school = schools.find(s => s.id === p.school_id)
              return (
                <li key={p.id} className="rounded-lg bg-white border border-amber-100 px-3 py-2">
                  <p className="font-jost text-sm font-medium text-[#2D1654]">{p.title}</p>
                  <p className="font-jost text-xs text-gray-500">{school?.name}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-5">
          <h2 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-emerald-800/70 mb-4">
            Wins
          </h2>
          <ul className="space-y-2">
            {wins.length === 0 && (
              <li className="font-jost text-sm text-gray-600">No verified wins in this filter set yet.</li>
            )}
            {wins.map(p => {
              const school = schools.find(s => s.id === p.school_id)
              return (
                <li key={p.id} className="rounded-lg bg-white border border-emerald-100 px-3 py-2 flex justify-between gap-2">
                  <div>
                    <p className="font-jost text-sm font-medium text-[#2D1654]">{p.title}</p>
                    <p className="font-jost text-xs text-gray-500">{school?.name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {notifications.length > 0 && (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
            Recent activity
          </h2>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.slice(0, 12).map(n => (
              <li key={n.id} className="font-jost text-sm text-gray-600 border-b border-gray-50 pb-2">
                <span className="text-gray-400 text-xs">{new Date(n.created_at).toLocaleString()}</span>
                <span className="mx-2">·</span>
                <span className="text-[#2D1654]">{n.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="font-jost text-xs text-gray-500">
      {label}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-[#2D1654]"
      >
        {children}
      </select>
    </label>
  )
}
