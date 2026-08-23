import Link from 'next/link'

const STEPS = [
  { n: 1, label: 'Catalog', hint: 'Framework — what ECI can promise', href: '/team/delivery/framework' },
  { n: 2, label: 'Activate', hint: 'Add promises to a school ledger', href: '/team/delivery/framework' },
  { n: 3, label: 'Ledger', hint: 'School board — status, owners, evidence', href: null },
  { n: 4, label: 'Review', hint: 'Quarterly walkthrough', href: '/team/delivery/review' },
] as const

type StepId = 1 | 2 | 3 | 4

export default function DeliveryWorkflowSteps({
  current,
  schoolBoardHref,
}: {
  current: StepId
  schoolBoardHref?: string | null
}) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
      <p className="font-jost text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
        Workflow
      </p>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(step => {
          const isCurrent = step.n === current
          const href =
            step.n === 3 ? schoolBoardHref : step.href
          const inner = (
            <div
              className={`rounded-lg border px-3 py-2.5 transition-colors ${
                isCurrent
                  ? 'border-[#C8A84B] bg-[#F8F4EF] ring-1 ring-[#C8A84B]/40'
                  : 'border-gray-100 bg-gray-50/80'
              }`}
            >
              <p className="font-jost text-xs font-bold text-[#2D1654]">
                {step.n}. {step.label}
                {isCurrent && (
                  <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#C8A84B]">
                    You are here
                  </span>
                )}
              </p>
              <p className="font-jost text-[11px] text-gray-500 mt-0.5 leading-snug">{step.hint}</p>
            </div>
          )
          if (href) {
            return (
              <li key={step.n}>
                <Link href={href} className="block hover:opacity-90">{inner}</Link>
              </li>
            )
          }
          return <li key={step.n}>{inner}</li>
        })}
      </ol>
    </div>
  )
}
