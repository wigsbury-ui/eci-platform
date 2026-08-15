'use client'

import { useMemo, useState } from 'react'
import { CalendarEvent } from '@/lib/types'
import { ChevronLeft, ChevronRight, MapPin, Clock, Eye } from 'lucide-react'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

/** Monday-based weekday index 0–6 */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatMonth(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const VISIBILITY_LABEL: Record<string, string> = {
  network: 'Network',
  school: 'School',
  internal: 'Internal',
}

interface SharedCalendarProps {
  events: CalendarEvent[]
  mode: 'school' | 'team'
}

export default function SharedCalendar({ events, mode }: SharedCalendarProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | CalendarEvent['visibility']>('all')
  const today = useMemo(() => new Date(), [])

  const visibleEvents = useMemo(() => {
    if (mode !== 'team') return events
    if (visibilityFilter === 'all') return events
    return events.filter(e => e.visibility === visibilityFilter)
  }, [events, mode, visibilityFilter])

  const monthEvents = useMemo(() => {
    const y = cursor.getFullYear()
    const m = cursor.getMonth()
    return visibleEvents.filter(e => {
      const s = new Date(e.starts_at)
      return s.getFullYear() === y && s.getMonth() === m
    })
  }, [visibleEvents, cursor])

  const upcoming = useMemo(() => {
    const now = Date.now()
    return [...visibleEvents]
      .filter(e => new Date(e.starts_at).getTime() >= now - 60 * 60 * 1000)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
      .slice(0, 8)
  }, [visibleEvents])

  const totalDays = daysInMonth(cursor)
  const offset = mondayIndex(startOfMonth(cursor))
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const eventsOnDay = (day: number) =>
    monthEvents.filter(e => {
      const s = new Date(e.starts_at)
      return s.getDate() === day
    })

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">
            {mode === 'team' ? 'Team calendar' : 'Network calendar'}
          </h1>
          <p className="text-gray-400 text-sm font-jost mt-1">
            Visits, training, and shared deadlines across the ECI network
          </p>
        </div>
        {mode === 'team' && (
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
              Visibility
            </span>
            <select
              value={visibilityFilter}
              onChange={e =>
                setVisibilityFilter(e.target.value as 'all' | CalendarEvent['visibility'])
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost focus:outline-none focus:border-eci-purple bg-white"
            >
              <option value="all">All</option>
              <option value="network">Network</option>
              <option value="school">School</option>
              <option value="internal">Internal</option>
            </select>
          </label>
        )}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
              className="p-2 rounded-lg text-eci-purple hover:bg-eci-purple-light transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-cormorant text-2xl text-eci-purple-dark">
              {formatMonth(cursor)}
            </h2>
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
              className="p-2 rounded-lg text-eci-purple hover:bg-eci-purple-light transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(d => (
              <div
                key={d}
                className="text-center text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square min-h-[52px]" />
              }
              const date = new Date(cursor.getFullYear(), cursor.getMonth(), day)
              const isToday = sameDay(date, today)
              const dayEvents = eventsOnDay(day)
              return (
                <div
                  key={day}
                  className={`min-h-[52px] aspect-square rounded-lg border p-1.5 flex flex-col ${
                    isToday
                      ? 'border-eci-gold bg-eci-gold-light/30'
                      : 'border-transparent bg-gray-50/80'
                  }`}
                >
                  <span
                    className={`text-xs font-jost font-semibold ${
                      isToday ? 'text-eci-purple-dark' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-auto space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className="truncate text-[9px] leading-tight font-jost px-1 py-0.5 rounded bg-eci-purple text-white"
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-gray-400 font-jost px-0.5">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-4">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 font-jost">No upcoming events.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map(ev => (
                <li
                  key={ev.id}
                  className="border border-gray-100 rounded-lg p-4 hover:border-eci-purple/20 transition-colors"
                >
                  <p className="font-jost font-semibold text-sm text-gray-800">{ev.title}</p>
                  {ev.description && (
                    <p className="text-xs text-gray-500 font-jost mt-1 leading-relaxed line-clamp-2">
                      {ev.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 font-jost">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-eci-gold" />
                      {formatTime(ev.starts_at)}
                    </span>
                    {ev.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-eci-gold" />
                        {ev.location}
                      </span>
                    )}
                    {mode === 'team' && (
                      <span className="inline-flex items-center gap-1">
                        <Eye size={12} className="text-eci-gold" />
                        {VISIBILITY_LABEL[ev.visibility] || ev.visibility}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
