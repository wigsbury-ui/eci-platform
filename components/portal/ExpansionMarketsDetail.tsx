'use client'

import { useState, useTransition } from 'react'
import {
  MARKET_METHODOLOGY,
  SCORE_LABELS,
  TOP_DESTINATIONS,
  type ScoreDimension,
  type TopDestination,
} from '@/lib/content/expansion-markets'

const DIMENSIONS = Object.keys(SCORE_LABELS) as ScoreDimension[]

function ScoreBars({ scores }: { scores: TopDestination['scores'] }) {
  return (
    <div className="space-y-3">
      {DIMENSIONS.map(key => {
        const value = scores[key]
        const isCompetition = key === 'competition'
        return (
          <div key={key}>
            <div className="flex justify-between gap-3 mb-1">
              <p className="font-jost text-xs text-gray-500">{SCORE_LABELS[key]}</p>
              <p className="font-jost text-xs text-[#4C2585] font-medium">
                {isCompetition
                  ? value <= 2
                    ? 'Clear white space'
                    : value === 3
                      ? 'Balanced'
                      : 'Established market'
                  : `${value}/5`}
              </p>
            </div>
            <div className="h-1.5 bg-gray-100 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(value / 5) * 100}%`,
                  background: isCompetition
                    ? value >= 4
                      ? '#9CA3AF'
                      : '#C8A84B'
                    : '#2D1654',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ExpansionMarketsDetail() {
  const [activeId, setActiveId] = useState(TOP_DESTINATIONS[0].id)
  const [, startTransition] = useTransition()
  const active = TOP_DESTINATIONS.find(d => d.id === activeId) ?? TOP_DESTINATIONS[0]

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          Expansion pipeline
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">Top 10 priority destinations</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">
          Investor-facing view of ECI’s ranked destination set — selected for demand strength,
          fee-band fit, regulatory openness and cultural alignment with the Ellesmere model. This
          is the opportunity map for capital and operating partners; commercial schedules remain in
          due-diligence packs.
        </p>
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-10">
        <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-[#C8A84B] mb-2">
          {MARKET_METHODOLOGY.eyebrow}
        </p>
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-3">{MARKET_METHODOLOGY.title}</h2>
        <p className="font-jost text-sm text-gray-600 leading-relaxed mb-5 max-w-3xl">
          {MARKET_METHODOLOGY.summary}
        </p>
        <p className="font-jost text-xs text-gray-400 mb-4">
          Markets covered: {MARKET_METHODOLOGY.countries.join(' · ')}
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 mb-5">
          {MARKET_METHODOLOGY.criteria.map(c => (
            <li key={c} className="font-jost text-sm text-gray-600 flex gap-2">
              <span className="text-[#C8A84B]">◆</span>
              {c}
            </li>
          ))}
        </ul>
        <p className="font-jost text-sm text-gray-500 italic leading-relaxed">
          {MARKET_METHODOLOGY.note}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-2">
          {TOP_DESTINATIONS.map(d => {
            const selected = d.id === activeId
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => startTransition(() => setActiveId(d.id))}
                className={`w-full text-left px-4 py-3 border transition-colors ${
                  selected
                    ? 'border-[#C8A84B] bg-[#F8F4EF]'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-jost text-xs text-[#C8A84B] tracking-widest">
                    #{d.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="font-cormorant text-lg text-[#2D1654] leading-snug">{d.shortName}</p>
                    <p className="font-jost text-xs text-gray-400 truncate">
                      {d.country}
                      {d.networkStatus === 'operating' ? ' · Operating campus' : ''}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="lg:col-span-8 bg-white border border-gray-100 p-7 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="font-jost text-[11px] tracking-[0.25em] uppercase text-[#C8A84B] mb-2">
                Rank #{active.rank}
                {active.networkStatus === 'operating' ? ' · Live network presence' : ''}
              </p>
              <h2 className="font-cormorant text-3xl text-[#2D1654] leading-tight mb-1">
                {active.name}
              </h2>
              <p className="font-jost text-sm text-gray-400">
                {active.cityLabel} · {active.country}
              </p>
            </div>
            <div className="text-right">
              <p className="font-jost text-[10px] tracking-widest uppercase text-gray-400">
                Opportunity
              </p>
              <p className="font-cormorant text-2xl text-[#2D1654]">{active.opportunity}</p>
            </div>
          </div>

          <p className="font-jost text-sm text-gray-600 leading-relaxed mb-6">
            {active.investorThesis}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-3">
                Why this market now
              </p>
              <ul className="space-y-2">
                {active.whyNow.map(item => (
                  <li key={item} className="font-jost text-sm text-gray-600 flex gap-2">
                    <span className="text-[#C8A84B] shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-3">
                Partner fit
              </p>
              <p className="font-jost text-sm text-gray-600 leading-relaxed mb-6">
                {active.partnerFit}
              </p>
              <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-3">
                Market scorecard
              </p>
              <ScoreBars scores={active.scores} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs font-jost text-gray-400">
            <span>
              Composite priority index:{' '}
              <span className="text-[#4C2585] font-medium">{active.compositeScore}</span>
            </span>
            <span>Comparable across seven MENA markets</span>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-4">Full Top 10 at a glance</h2>
        <div className="overflow-x-auto border border-gray-100 bg-white">
          <table className="w-full text-left font-jost text-sm">
            <thead className="bg-[#F8F4EF] text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Opportunity</th>
                <th className="px-4 py-3 font-medium">Index</th>
              </tr>
            </thead>
            <tbody>
              {TOP_DESTINATIONS.map(d => (
                <tr
                  key={d.id}
                  className={`border-t border-gray-50 cursor-pointer hover:bg-[#F8F4EF]/50 ${
                    d.id === activeId ? 'bg-[#F8F4EF]/80' : ''
                  }`}
                  onClick={() => startTransition(() => setActiveId(d.id))}
                >
                  <td className="px-4 py-3 text-[#C8A84B] font-medium">#{d.rank}</td>
                  <td className="px-4 py-3 text-[#2D1654]">
                    {d.shortName}
                    {d.networkStatus === 'operating' && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-emerald-600">
                        Operating
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{d.country}</td>
                  <td className="px-4 py-3 text-gray-600">{d.opportunity}</td>
                  <td className="px-4 py-3 text-[#4C2585]">{d.compositeScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
