'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

/** Preview-only control to flip applicant ↔ accepted without Supabase. */
export default function PreviewPartnerTierToggle({
  accepted,
  visible,
}: {
  accepted: boolean
  visible: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  if (!visible) return null

  return (
    <div className="mb-6 border border-dashed border-[#0E7490]/40 bg-[#F0FDFA] px-4 py-3">
      <p className="text-xs font-jost text-[#0E7490] mb-2">
        Preview mode — toggle access tier (no Supabase connected)
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await fetch('/api/preview-partner-tier', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: accepted ? 'applicant' : 'accepted' }),
            })
            router.refresh()
          })
        }}
        className="text-sm font-jost font-semibold text-[#0E7490] underline disabled:opacity-50"
      >
        {accepted ? 'View as applicant' : 'View as accepted partner'}
      </button>
    </div>
  )
}
