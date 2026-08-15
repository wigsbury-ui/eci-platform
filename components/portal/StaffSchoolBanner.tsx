'use client'

import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'

export type SchoolViewOption = { id: string; name: string; city?: string }

export default function StaffSchoolBanner({
  schoolId,
  schoolName,
  schoolOptions,
}: {
  schoolId: string
  schoolName: string
  schoolOptions: SchoolViewOption[]
}) {
  return (
    <div className="mb-6 rounded-xl border border-eci-gold/40 bg-eci-gold-light/35 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start gap-2.5 min-w-0">
        <Eye size={16} className="text-eci-purple-dark mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-jost font-semibold text-eci-purple-dark">
            Viewing school portal as {schoolName}
          </p>
          <p className="text-xs text-gray-600 font-jost mt-0.5">
            You stay signed in as super admin — switch school or return to the team portal anytime.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <label className="flex items-center gap-2 text-xs font-jost text-gray-600">
          <span className="sr-only">Switch school</span>
          <select
            className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm font-jost bg-white focus:outline-none focus:border-eci-gold"
            value={schoolId}
            onChange={e => {
              window.location.href = `/api/view-school?school=${encodeURIComponent(e.target.value)}&next=/school`
            }}
          >
            {schoolOptions.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <Link
          href="/api/view-school?clear=1&next=/team"
          className="inline-flex items-center gap-1.5 bg-eci-purple text-white px-3 py-2 rounded-lg text-xs font-jost font-semibold hover:bg-eci-purple-dark transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Super Admin
        </Link>
      </div>
    </div>
  )
}
