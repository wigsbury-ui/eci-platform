'use client'

import { useEffect, useState } from 'react'
import { Download, FileText, Lock } from 'lucide-react'
import { MOROCCO_RESEARCH } from '@/lib/content/morocco-research'

type Status = 'checking' | 'locked' | 'unlocked' | 'submitting' | 'error'

export default function MoroccoResearchGate() {
  const report = MOROCCO_RESEARCH
  const [status, setStatus] = useState<Status>('checking')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    organisation: '',
    country: '',
  })

  useEffect(() => {
    let cancelled = false
    fetch('/api/research/morocco-download', { method: 'GET' })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        setStatus(data?.unlocked ? 'unlocked' : 'locked')
      })
      .catch(() => {
        if (!cancelled) setStatus('locked')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/research/morocco-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Could not unlock the report. Please try again.')
        setStatus('locked')
        return
      }
      setStatus('unlocked')
    } catch {
      setError('Could not unlock the report. Please try again.')
      setStatus('locked')
    }
  }

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          {report.eyebrow}
        </p>
        <h1 className="font-cormorant text-4xl md:text-5xl text-eci-purple-dark mb-3">{report.title}</h1>
        <p className="text-gray-500 font-jost text-base leading-relaxed mb-4">{report.subtitle}</p>
        <p className="text-gray-400 font-jost text-sm">
          Version {report.version} · {report.publishedLabel} · Free PDF for investor partners
        </p>
      </header>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
        <div className="space-y-6">
          <p className="font-jost text-gray-600 leading-relaxed">{report.summary}</p>
          <ul className="space-y-3">
            {report.keyTakeaways.map(item => (
              <li key={item} className="flex gap-3 font-jost text-sm text-gray-600 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C8A84B] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="border border-black/8 bg-[#FBF8F4] p-6 md:p-7">
          {status === 'checking' && (
            <p className="font-jost text-sm text-gray-500">Checking access…</p>
          )}

          {(status === 'locked' || status === 'submitting' || status === 'error') && (
            <>
              <div className="flex items-center gap-2 mb-4 text-[#2D1654]">
                <Lock size={16} />
                <h2 className="font-cormorant text-2xl">Download the full report</h2>
              </div>
              <p className="font-jost text-sm text-gray-500 mb-5 leading-relaxed">
                Share your details to unlock the PDF. We use this only to follow up with relevant Morocco
                partnership information.
              </p>
              <form onSubmit={submit} className="space-y-3.5">
                {(
                  [
                    { name: 'full_name', label: 'Full name', type: 'text', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'organisation', label: 'Organisation', type: 'text', required: false },
                    { name: 'country', label: 'Country', type: 'text', required: false },
                  ] as const
                ).map(field => (
                  <div key={field.name}>
                    <label className="block text-[11px] font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      value={form[field.name]}
                      onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                      className="w-full border border-gray-200 bg-white rounded-sm px-3.5 py-2.5 text-sm font-jost focus:outline-none focus:border-[#4C2585]"
                    />
                  </div>
                ))}
                {error && <p className="text-red-600 text-sm font-jost bg-red-50 p-2.5">{error}</p>}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-[#4C2585] text-white py-3 rounded-sm font-jost font-semibold text-sm hover:bg-[#2D1654] transition-colors disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Unlocking…' : 'Unlock free PDF'}
                </button>
              </form>
            </>
          )}

          {status === 'unlocked' && (
            <>
              <div className="flex items-center gap-2 mb-4 text-[#2D1654]">
                <FileText size={16} />
                <h2 className="font-cormorant text-2xl">Your download is ready</h2>
              </div>
              <p className="font-jost text-sm text-gray-500 mb-5 leading-relaxed">
                {report.fileName} · refreshed {report.publishedLabel}
              </p>
              <a
                href={report.downloadPath}
                className="inline-flex items-center justify-center gap-2 w-full bg-[#4C2585] text-white py-3 rounded-sm font-jost font-semibold text-sm hover:bg-[#2D1654] transition-colors"
              >
                <Download size={16} />
                Download PDF
              </a>
              <p className="mt-4 font-jost text-xs text-gray-400 leading-relaxed">{report.disclaimer}</p>
            </>
          )}
        </aside>
      </div>

      <section className="border-t border-black/8 pt-10 space-y-8">
        <div>
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-3">{report.macro.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Demographics', items: report.macro.demographics },
              { title: 'Enrolment', items: report.macro.enrolment },
              { title: 'Policy', items: report.macro.policy },
            ].map(col => (
              <div key={col.title}>
                <h3 className="font-jost text-xs uppercase tracking-[0.2em] text-[#C8A84B] font-semibold mb-3">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.items.map(item => (
                    <li key={item} className="font-jost text-sm text-gray-600 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-2">{report.fees.title}</h2>
          <p className="font-jost text-sm text-gray-500 mb-5 max-w-3xl leading-relaxed">{report.fees.intro}</p>
          <div className="space-y-4">
            {report.fees.bands.map(band => (
              <div key={band.name} className="grid md:grid-cols-[220px_160px_1fr] gap-2 md:gap-4 py-3 border-b border-black/5">
                <p className="font-jost text-sm font-semibold text-[#2D1654]">{band.name}</p>
                <p className="font-jost text-sm text-[#4C2585]">{band.range}</p>
                <p className="font-jost text-sm text-gray-500 leading-relaxed">{band.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-jost text-sm text-gray-600 leading-relaxed max-w-3xl">{report.fees.positioning}</p>
        </div>

        <div>
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-2">{report.competition.title}</h2>
          <p className="font-jost text-sm text-gray-500 mb-4 max-w-3xl leading-relaxed">{report.competition.intro}</p>
          <ul className="space-y-3 max-w-3xl">
            {report.competition.points.map(point => (
              <li key={point} className="flex gap-3 font-jost text-sm text-gray-600 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#4C2585] shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-5">Priority destinations</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {report.destinations.map(dest => (
              <article key={dest.id} className="border border-black/8 p-5">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="font-cormorant text-2xl text-[#2D1654]">{dest.name}</h3>
                  <span className="font-jost text-[11px] uppercase tracking-wide text-[#C8A84B] font-semibold">
                    {dest.tier}
                  </span>
                </div>
                <p className="font-jost text-xs text-gray-400 mb-3">Opportunity: {dest.opportunity}</p>
                <p className="font-jost text-sm text-gray-600 leading-relaxed mb-3">{dest.thesis}</p>
                <ul className="space-y-1.5">
                  {dest.signals.map(s => (
                    <li key={s} className="font-jost text-xs text-gray-500">
                      · {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-4">{report.matrix.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left font-jost text-sm">
              <thead>
                <tr className="border-b border-black/10 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="py-2 pr-3 font-semibold">Location</th>
                  {report.matrix.columns.map(col => (
                    <th key={col} className="py-2 pr-3 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.matrix.rows.map(row => (
                  <tr key={row.place} className="border-b border-black/5 text-gray-600">
                    <td className="py-2.5 pr-3 font-semibold text-[#2D1654]">{row.place}</td>
                    {row.values.map((v, i) => (
                      <td key={`${row.place}-${i}`} className="py-2.5 pr-3">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="max-w-3xl">
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-3">{report.partnerModel.title}</h2>
          <p className="font-jost text-sm text-gray-600 leading-relaxed mb-4">{report.partnerModel.body}</p>
          <ul className="space-y-2">
            {report.partnerModel.bullets.map(b => (
              <li key={b} className="font-jost text-sm text-gray-600">
                · {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-3xl">
          <h2 className="font-cormorant text-3xl text-eci-purple-dark mb-3">{report.conclusion.title}</h2>
          {report.conclusion.paragraphs.map(p => (
            <p key={p} className="font-jost text-sm text-gray-600 leading-relaxed mb-3">
              {p}
            </p>
          ))}
        </div>

        <div>
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-3">Sources</h2>
          <ul className="space-y-2">
            {report.sources.map(s => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-jost text-sm text-[#4C2585] hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-jost text-xs text-gray-400 leading-relaxed max-w-3xl">{report.disclaimer}</p>
        </div>
      </section>
    </div>
  )
}
