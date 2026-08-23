export default function DeliveryHowItWorks({ audience }: { audience: 'team' | 'school' }) {
  if (audience === 'school') {
    return (
      <div className="mb-6 rounded-xl border border-[#4C9A6B]/30 bg-white p-5">
        <p className="font-jost text-[11px] font-bold uppercase tracking-[0.2em] text-[#4C9A6B]">
          What you are viewing
        </p>
        <p className="mt-2 font-jost text-sm text-gray-600 leading-relaxed max-w-3xl">
          This is ECI&apos;s live record of service commitments for your campus — drawn from the
          Partner Services framework (obligatory foundations, core services, and agreed add-ons).
          Status, owners, and evidence show what is on track, at risk, or awaiting verification.
          You cannot edit entries here; your ECI relationship team maintains the ledger and notifies
          you when something changes.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-xl border border-[#C8A84B]/35 bg-[#F8F4EF] p-5">
      <p className="font-jost text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8A84B]">
        How partnership delivery works
      </p>
      <ol className="mt-3 space-y-2 font-jost text-sm text-[#2D1654]/82 max-w-3xl list-decimal list-inside">
        <li>
          <span className="font-medium text-[#2D1654]">Framework</span> — the Partner Services catalog
          defines what ECI promises (Groups 1–3) and success criteria.
        </li>
        <li>
          <span className="font-medium text-[#2D1654]">Activate</span> — create promises per school from
          the framework (whole group or single service).
        </li>
        <li>
          <span className="font-medium text-[#2D1654]">Track</span> — cockpit and school boards show
          status, owners, reviews, and evidence; kanban supports quick status moves.
        </li>
        <li>
          <span className="font-medium text-[#2D1654]">Prove</span> — attach documents, library files,
          or uploads as evidence against each promise.
        </li>
        <li>
          <span className="font-medium text-[#2D1654]">Review</span> — quarterly walkthrough verifies
          Group promises and sets the next review date.
        </li>
        <li>
          <span className="font-medium text-[#2D1654]">Partner visibility</span> — schools see a
          read-only view and notifications when status or evidence changes.
        </li>
      </ol>
      <p className="mt-3 font-jost text-xs text-gray-500 max-w-3xl">
        Goal: internal accountability that matches what partners were sold — not a CRM, but a promise
        ledger tied to the framework so quality and brand commitments stay visible and auditable.
      </p>
    </div>
  )
}
