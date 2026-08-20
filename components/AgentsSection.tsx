'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AGENT_HOW_IT_WORKS, AGENT_PROGRAM } from '@/lib/content/agents'

export default function AgentsSection() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section id="agents" className="relative py-20 md:py-24 bg-white overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 100% 0%, rgba(14,116,144,0.08) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className={`max-w-2xl mb-10 transition-all duration-700 ${
            ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
            {AGENT_PROGRAM.eyebrow}
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-3"
            style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.85rem)' }}
          >
            {AGENT_PROGRAM.title}
          </h2>
          <div className="w-14 h-1 bg-[#0E7490] mb-4" />
          <p className="font-jost text-[#2D1654]/75 leading-relaxed max-w-xl mb-3">
            {AGENT_PROGRAM.summary}
          </p>
          <p className="font-cormorant text-xl text-[#0E7490] italic">
            {AGENT_PROGRAM.punchline}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {AGENT_HOW_IT_WORKS.map(step => (
            <div key={step.step}>
              <p className="font-jost text-xs tracking-[0.2em] text-[#0E7490] font-bold mb-2">
                {step.step}
              </p>
              <p className="font-cormorant text-xl text-[#2D1654] font-semibold mb-2">{step.title}</p>
              <p className="font-jost text-sm text-[#2D1654]/65 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/investors#investors"
            className="bg-[#0E7490] text-white px-6 py-3 font-jost font-bold text-sm hover:bg-[#0F766E] transition-colors"
          >
            Brand licensing offer
          </Link>
          <Link
            href="/login?audience=agent"
            className="font-jost text-sm font-semibold text-[#2D1654] hover:text-[#0E7490] transition-colors"
          >
            Agent portal login →
          </Link>
          <Link
            href="/agents"
            className="font-jost text-sm font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
          >
            Agents &amp; rainmakers →
          </Link>
        </div>
      </div>
    </section>
  )
}
