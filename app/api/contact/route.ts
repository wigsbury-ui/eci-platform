import { NextResponse } from 'next/server'
import { createAdminClient, hasServiceRoleEnv } from '@/lib/supabase/admin'
import { CONTACT_FROM_EMAIL, CONTACT_NOTIFY_EMAIL } from '@/lib/contact/config'

type EnquiryBody = {
  full_name?: string
  organisation?: string | null
  email?: string
  country?: string | null
  investment_type?: string | null
  message?: string | null
}

async function notifyNeil(enquiry: EnquiryBody) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const lines = [
    `Name: ${enquiry.full_name ?? '-'}`,
    `Organisation: ${enquiry.organisation ?? '-'}`,
    `Email: ${enquiry.email ?? '-'}`,
    `Country: ${enquiry.country ?? '-'}`,
    `Interest: ${enquiry.investment_type ?? '-'}`,
    '',
    enquiry.message ?? '',
  ]

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_NOTIFY_EMAIL],
      reply_to: enquiry.email,
      subject: `ECI website enquiry: ${enquiry.full_name ?? 'New contact'}`,
      text: lines.join('\n'),
    }),
  })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnquiryBody
    const full_name = String(body.full_name ?? '').trim()
    const email = String(body.email ?? '').trim()

    if (!full_name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const row = {
      full_name,
      organisation: String(body.organisation ?? '').trim() || null,
      email,
      country: String(body.country ?? '').trim() || null,
      investment_type: String(body.investment_type ?? '').trim() || null,
      message: String(body.message ?? '').trim() || null,
    }

    if (hasServiceRoleEnv()) {
      const admin = createAdminClient()
      if (!admin) {
        return NextResponse.json({ error: 'Contact service is not configured.' }, { status: 503 })
      }
      const { error } = await admin.from('investor_enquiries').insert([row])
      if (error) {
        console.error('investor_enquiries insert failed', error)
        return NextResponse.json({ error: 'Could not save enquiry.' }, { status: 500 })
      }
    } else {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!url || !anon) {
        return NextResponse.json({ error: 'Contact service is not configured.' }, { status: 503 })
      }
      const res = await fetch(`${url}/rest/v1/investor_enquiries`, {
        method: 'POST',
        headers: {
          apikey: anon,
          Authorization: `Bearer ${anon}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(row),
      })
      if (!res.ok) {
        console.error('investor_enquiries anon insert failed', await res.text())
        return NextResponse.json({ error: 'Could not save enquiry.' }, { status: 500 })
      }
    }

    try {
      await notifyNeil(row)
    } catch (e) {
      console.error('Contact email notify failed', e)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('contact route error', e)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
