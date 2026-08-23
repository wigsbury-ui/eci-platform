import Link from 'next/link'

const ITEMS = [
  { href: '/team/delivery', label: 'Cockpit', desc: 'Network overview' },
  { href: '/team/delivery/framework', label: 'Framework', desc: 'Catalog & activate' },
  { href: null as string | null, label: 'School board', desc: 'Manage promises' },
  { href: '/team/delivery/review', label: 'Quarterly review', desc: 'Guided check' },
]

export default function DeliverySubNav({
  active,
  schoolBoardHref,
}: {
  active: string
  schoolBoardHref?: string | null
}) {
  return (
    <nav className="flex flex-wrap gap-2 mb-6" aria-label="Delivery sections">
      {ITEMS.map(item => {
        const href = item.href ?? schoolBoardHref
        if (!href) {
          return (
            <span
              key={item.label}
              className="rounded-lg px-3 py-1.5 text-sm font-jost border border-gray-100 text-gray-400"
              title="Select a school on Framework to open its board"
            >
              {item.label}
            </span>
          )
        }
        const isActive =
          active === href ||
          (item.label === 'School board' && active.startsWith('/team/delivery/schools/'))
        return (
          <Link
            key={item.label}
            href={href}
            className={`rounded-lg px-3 py-1.5 text-sm font-jost font-medium transition-colors ${
              isActive
                ? 'bg-[#2D1654] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#4C2585]/30 hover:text-[#2D1654]'
            }`}
          >
            <span>{item.label}</span>
            <span className={`hidden sm:inline text-xs ml-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
              · {item.desc}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
