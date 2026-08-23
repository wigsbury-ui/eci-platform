import Link from 'next/link'

const ITEMS = [
  { href: '/team/delivery', label: 'Cockpit' },
  { href: '/team/delivery/framework', label: 'Framework' },
  { href: '/team/delivery/review', label: 'Quarterly review' },
]

export default function DeliverySubNav({ active }: { active: string }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-6" aria-label="Delivery sections">
      {ITEMS.map(item => {
        const isActive = active === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-jost font-medium transition-colors ${
              isActive
                ? 'bg-[#2D1654] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#4C2585]/30 hover:text-[#2D1654]'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
