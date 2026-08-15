'use client'

import { FormEvent, useMemo, useState } from 'react'
import { CalendarEvent } from '@/lib/types'
import {
  calendarsLabel,
  deriveVisibility,
  filterEventsForView,
  normalizeEvent,
} from '@/lib/calendar'
import { hasSupabaseEnv, createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight, MapPin, Clock, Layers, Plus, X } from 'lucide-react'

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

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export type CalendarSchoolOption = { id: string; name: string; city?: string }

interface SharedCalendarProps {
  events: CalendarEvent[]
  mode: 'school' | 'team'
  schools?: CalendarSchoolOption[]
  /** When mode=school, filter to this school's calendar (+ network / all-schools). */
  schoolId?: string | null
  canCreate?: boolean
}

export default function SharedCalendar({
  events: initialEvents,
  mode,
  schools = [],
  schoolId = null,
  canCreate = false,
}: SharedCalendarProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [calendarFilter, setCalendarFilter] = useState('all')
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(() =>
    initialEvents.map(e => normalizeEvent(e))
  )
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const today = useMemo(() => new Date(), [])
  const schoolNames = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of schools) map[s.id] = s.name
    return map
  }, [schools])

  const defaultStart = useMemo(() => {
    const d = new Date()
    d.setHours(9, 0, 0, 0)
    d.setDate(d.getDate() + 1)
    return toLocalInputValue(d)
  }, [])
  const defaultEnd = useMemo(() => {
    const d = new Date()
    d.setHours(17, 0, 0, 0)
    d.setDate(d.getDate() + 1)
    return toLocalInputValue(d)
  }, [])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startsAt, setStartsAt] = useState(defaultStart)
  const [endsAt, setEndsAt] = useState(defaultEnd)
  const [showOnAdmin, setShowOnAdmin] = useState(true)
  const [allSchools, setAllSchools] = useState(false)
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])

  const visibleEvents = useMemo(
    () =>
      filterEventsForView(localEvents, {
        mode,
        schoolId,
        calendarFilter: mode === 'team' ? calendarFilter : 'all',
      }),
    [localEvents, mode, schoolId, calendarFilter]
  )

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

  function toggleSchool(id: string) {
    setAllSchools(false)
    setSelectedSchools(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function resetForm() {
    setTitle('')
    setDescription('')
    setLocation('')
    setStartsAt(defaultStart)
    setEndsAt(defaultEnd)
    setShowOnAdmin(true)
    setAllSchools(false)
    setSelectedSchools([])
    setFormError(null)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('Please add a title.')
      return
    }
    if (!showOnAdmin && !allSchools && selectedSchools.length === 0) {
      setFormError('Allocate this block to Admin, all schools, or at least one school.')
      return
    }
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      setFormError('End time must be after start time.')
      return
    }

    const school_ids = allSchools ? [] : selectedSchools
    const visibility = deriveVisibility({
      show_on_admin: showOnAdmin,
      all_schools: allSchools,
      school_ids,
    })

    const draft = normalizeEvent({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || null,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      location: location.trim() || null,
      show_on_admin: showOnAdmin,
      all_schools: allSchools,
      school_ids,
      school_id: school_ids[0] ?? null,
      visibility,
      created_by: null,
    })

    setSaving(true)
    try {
      if (hasSupabaseEnv()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('calendar_events')
          .insert({
            title: draft.title,
            description: draft.description,
            starts_at: draft.starts_at,
            ends_at: draft.ends_at,
            visibility: draft.visibility,
            school_id: null,
            location: draft.location,
            show_on_admin: draft.show_on_admin,
            all_schools: draft.all_schools,
            school_ids: draft.school_ids,
          })
          .select('*')
          .single()

        if (!error && data) {
          setLocalEvents(prev => [...prev, normalizeEvent(data as CalendarEvent)])
        } else {
          // Columns may not exist yet on remote — keep the block locally
          setLocalEvents(prev => [...prev, draft])
        }
      } else {
        setLocalEvents(prev => [...prev, draft])
      }
      resetForm()
      setShowForm(false)
    } catch {
      setLocalEvents(prev => [...prev, draft])
      resetForm()
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">
            {mode === 'team' ? 'Team & school calendars' : 'School calendar'}
          </h1>
          <p className="text-gray-400 text-sm font-jost mt-1 max-w-xl">
            {mode === 'team'
              ? 'Create time blocks and allocate them to the Admin calendar, individual schools, or all schools.'
              : 'Visits, training, and shared deadlines allocated to your school or the whole network.'}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {mode === 'team' && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
                View calendar
              </span>
              <select
                value={calendarFilter}
                onChange={e => setCalendarFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost focus:outline-none focus:border-eci-gold bg-white min-w-[180px]"
              >
                <option value="all">All calendars</option>
                <option value="admin">Admin only</option>
                {schools.map(s => (
                  <option key={s.id} value={`school:${s.id}`}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {canCreate && mode === 'team' && (
            <button
              type="button"
              onClick={() => {
                setShowForm(v => !v)
                setFormError(null)
              }}
              className="inline-flex items-center gap-2 bg-eci-gold text-eci-purple-dark px-4 py-2.5 rounded-lg text-sm font-jost font-semibold hover:bg-eci-gold-light transition-colors"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? 'Close' : 'New time block'}
            </button>
          )}
        </div>
      </div>

      {showForm && canCreate && mode === 'team' && (
        <form
          onSubmit={handleCreate}
          className="mb-8 bg-white border border-gray-100 rounded-xl p-5 sm:p-6 space-y-5"
        >
          <div>
            <h2 className="font-cormorant text-2xl text-eci-purple-dark">Allocate a time block</h2>
            <p className="text-sm text-gray-400 font-jost mt-1">
              Example: mark a Riyadh visit on Admin and Riyadh so both calendars show the same block.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="sm:col-span-2 flex flex-col gap-1.5">
              <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
                Title
              </span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Riyadh campus visit"
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-gold"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
                Starts
              </span>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={e => setStartsAt(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-gold"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
                Ends
              </span>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={e => setEndsAt(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-gold"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1.5">
              <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
                Location
              </span>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Campus, city, or Online"
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-gold"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1.5">
              <span className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400">
                Notes
              </span>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-gold resize-none"
              />
            </label>
          </div>

          <fieldset>
            <legend className="text-[10px] font-jost font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Appear on calendars
            </legend>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 cursor-pointer hover:border-eci-gold/40 transition-colors">
                <input
                  type="checkbox"
                  checked={showOnAdmin}
                  onChange={e => setShowOnAdmin(e.target.checked)}
                  className="accent-[#C8A84B] w-4 h-4"
                />
                <span className="text-sm font-jost text-gray-800">
                  Admin / ECI team calendar
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 cursor-pointer hover:border-eci-gold/40 transition-colors">
                <input
                  type="checkbox"
                  checked={allSchools}
                  onChange={e => {
                    setAllSchools(e.target.checked)
                    if (e.target.checked) setSelectedSchools([])
                  }}
                  className="accent-[#C8A84B] w-4 h-4"
                />
                <span className="text-sm font-jost text-gray-800">All school calendars</span>
              </label>
              {!allSchools && schools.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  {schools.map(s => (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 cursor-pointer hover:border-eci-gold/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSchools.includes(s.id)}
                        onChange={() => toggleSchool(s.id)}
                        className="accent-[#C8A84B] w-4 h-4"
                      />
                      <span className="text-sm font-jost text-gray-800">
                        {s.name}
                        {s.city ? (
                          <span className="text-gray-400 text-xs ml-1.5">{s.city}</span>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          {formError && (
            <p className="text-sm font-jost text-red-600">{formError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
              className="px-4 py-2.5 text-sm font-jost text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-eci-gold text-eci-purple-dark px-5 py-2.5 rounded-lg text-sm font-jost font-semibold hover:bg-eci-gold-light transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Create block'}
            </button>
          </div>
        </form>
      )}

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
            <p className="text-sm text-gray-400 font-jost">No upcoming events on this calendar.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map(ev => (
                <li
                  key={ev.id}
                  className="border border-gray-100 rounded-lg p-4 hover:border-eci-gold/30 transition-colors"
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
                    <span className="inline-flex items-center gap-1">
                      <Layers size={12} className="text-eci-gold" />
                      {calendarsLabel(ev, schoolNames)}
                    </span>
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
