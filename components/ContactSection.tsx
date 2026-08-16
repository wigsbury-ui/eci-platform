'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  title?: string
  subtitle?: string
  defaultInterest?: string
}

export default function ContactSection({
  title = 'Start a conversation with our team',
  subtitle = 'Whether you are exploring a full partnership, an investment opportunity, or simply want to learn more about ECI, we welcome your enquiry.',
  defaultInterest = '',
}: Props) {
  const [form, setForm] = useState({
    full_name: '',
    organisation: '',
    email: '',
    country: '',
    investment_type: defaultInterest,
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('investor_enquiries').insert([form])
      setStatus(error ? 'error' : 'sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section id="contact" className="py-28 bg-[#F8F4EF]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-[#4C2585] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-cormorant text-3xl text-[#2D1654] mb-3">Thank you</h3>
          <p className="text-gray-600 font-jost">
            Your enquiry has been received. A member of the ECI team will be in touch within 3 working days.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-28 bg-[#F8F4EF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-[#4C2585] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
              Get in touch
            </p>
            <h2
              className="font-cormorant font-light text-[#2D1654] leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}
            >
              {title}
            </h2>
            <p className="text-gray-600 leading-relaxed font-jost mb-8">{subtitle}</p>
            <div className="space-y-4 text-sm font-jost text-gray-600">
              <p>
                <strong className="text-[#4C2585]">ECI Global Office</strong>
                <br />
                Ellesmere College, Ellesmere, Shropshire, SY12 9AB, UK
              </p>
              <p>
                <strong className="text-[#4C2585]">Email</strong>
                <br />
                international@ellesmere.com
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm space-y-5 border border-black/5">
            {[
              { name: 'full_name', label: 'Full Name', type: 'text', required: true },
              { name: 'organisation', label: 'Organisation', type: 'text', required: false },
              { name: 'email', label: 'Email Address', type: 'email', required: true },
              { name: 'country', label: 'Country', type: 'text', required: false },
            ].map(({ name, label, type, required }) => (
              <div key={name}>
                <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  required={required}
                  value={form[name as keyof typeof form]}
                  onChange={e => setForm({ ...form, [name]: e.target.value })}
                  className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585] transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Interest
              </label>
              <select
                value={form.investment_type}
                onChange={e => setForm({ ...form, investment_type: e.target.value })}
                className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585]"
              >
                <option value="">Please select...</option>
                <option>Investment Opportunity</option>
                <option>Agent / Introduction Partner</option>
                <option>Full Partnership</option>
                <option>Curriculum Licensing</option>
                <option>Advisory Partnership</option>
                <option>General Enquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585] resize-none"
              />
            </div>
            {status === 'error' && (
              <p className="text-red-600 text-sm font-jost bg-red-50 p-3">
                We could not send your enquiry just now. Please email international@ellesmere.com directly.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#4C2585] text-white py-3.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#2D1654] transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send enquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
