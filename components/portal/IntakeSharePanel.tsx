'use client'

import { useCallback, useState } from 'react'
import { Copy, Check, Mail, Link2, Plus, Ban } from 'lucide-react'
import type { DocumentIntakeLink } from '@/lib/types'

type Props = {
  shareUrl: string | null
  siteBase: string
  links?: DocumentIntakeLink[]
  setupError?: string | null
}

const EMAIL_TEMPLATE = `Dear colleagues,

We are building the ECI partner document library. Please upload any policies, curriculum materials, safeguarding documents, or operational guides you think should be included.

Use this link (name and email required):
{LINK}

Drag and drop files in any common format. Do not worry about tidying filenames. We will review everything and draft articulated partner documentation from your uploads.

Thank you.`

export default function IntakeSharePanel({
  shareUrl: initialShareUrl,
  siteBase,
  links: initialLinks = [],
  setupError = null,
}: Props) {
  const [shareUrl, setShareUrl] = useState(initialShareUrl)
  const [links, setLinks] = useState(initialLinks)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(setupError || '')

  const copy = useCallback(async (text: string, which: 'link' | 'email') => {
    try {
      await navigator.clipboard.writeText(text)
      if (which === 'link') {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } else {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      }
    } catch {
      setMessage('Could not copy to clipboard')
    }
  }, [])

  const createLink = async () => {
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch('/api/team/intake/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: 'Colleague upload' }) })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Could not create link')
        return
      }
      setShareUrl(data.shareUrl)
      setLinks(prev => [data.link, ...prev])
      setMessage('Upload link created')
    } catch {
      setMessage('Could not create link')
    } finally {
      setBusy(false)
    }
  }

  const revokeLink = async (linkId: string) => {
    if (!confirm('Revoke this link? Colleagues with the old URL will no longer be able to upload.')) return
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch(`/api/team/intake/links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revoke: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Could not revoke link')
        return
      }
      setLinks(prev => prev.map(l => (l.id === linkId ? { ...l, ...data.link } : l)))
      const stillActive = links.filter(l => l.id !== linkId && l.is_active)
      if (stillActive[0]) {
        setShareUrl(`${siteBase}/intake/${stillActive[0].token}`)
      } else {
        setShareUrl(null)
      }
      setMessage('Link revoked')
    } catch {
      setMessage('Could not revoke link')
    } finally {
      setBusy(false)
    }
  }

  const emailBody = shareUrl ? EMAIL_TEMPLATE.replace('{LINK}', shareUrl) : ''
  const activeLinks = links.filter(l => l.is_active)

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
      <div>
        <h2 className="font-cormorant text-xl text-eci-purple-dark mb-1">Colleague upload link</h2>
        <p className="text-sm text-gray-500 font-jost leading-relaxed">
          Share this link by email. Colleagues enter name and email, then drag-and-drop files. No Vercel
          setup required. Uploads appear on this page for review and articulation.
        </p>
      </div>

      {shareUrl ? (
        <div className="flex flex-wrap items-center gap-3">
          <code className="text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg font-mono text-gray-700 break-all">
            {shareUrl}
          </code>
          <button
            type="button"
            onClick={() => copy(shareUrl, 'link')}
            className="inline-flex items-center gap-2 text-sm font-jost font-semibold text-eci-purple hover:text-eci-purple-dark"
          >
            {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            {copiedLink ? 'Copied' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={() => copy(emailBody, 'email')}
            className="inline-flex items-center gap-2 text-sm font-jost font-semibold text-gray-600 hover:text-eci-purple-dark"
          >
            {copiedEmail ? <Check size={16} /> : <Mail size={16} />}
            {copiedEmail ? 'Copied' : 'Copy email text'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-jost text-amber-900 bg-amber-50 border border-amber-100 px-4 py-3 rounded-lg">
            {setupError ||
              'No active upload link yet. Create one with a single click (requires migration 009 in Supabase).'}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={createLink}
            className="inline-flex items-center gap-2 bg-eci-purple text-white px-4 py-2.5 rounded-lg text-sm font-jost font-semibold hover:bg-eci-purple-dark disabled:opacity-50"
          >
            <Link2 size={16} />
            {busy ? 'Creating…' : 'Create upload link'}
          </button>
        </div>
      )}

      {shareUrl && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            disabled={busy}
            onClick={createLink}
            className="inline-flex items-center gap-1.5 text-xs font-jost font-semibold text-gray-500 hover:text-eci-purple disabled:opacity-50"
          >
            <Plus size={14} />
            Create another link
          </button>
        </div>
      )}

      {activeLinks.length > 1 && (
        <ul className="space-y-2 border-t border-gray-50 pt-4">
          {activeLinks.map(link => {
            const url = `${siteBase}/intake/${link.token}`
            return (
              <li
                key={link.id}
                className="flex flex-wrap items-center gap-2 text-xs font-jost text-gray-600"
              >
                <span className="font-semibold text-gray-800">{link.label}</span>
                <code className="font-mono truncate max-w-[220px]">{url}</code>
                <button type="button" onClick={() => copy(url, 'link')} className="text-eci-purple font-semibold">
                  Copy
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => revokeLink(link.id)}
                  className="inline-flex items-center gap-1 text-red-600 font-semibold disabled:opacity-50"
                >
                  <Ban size={12} />
                  Revoke
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {activeLinks.length === 1 && (
        <button
          type="button"
          disabled={busy}
          onClick={() => revokeLink(activeLinks[0].id)}
          className="inline-flex items-center gap-1.5 text-xs font-jost font-semibold text-red-600/80 hover:text-red-700 disabled:opacity-50"
        >
          <Ban size={14} />
          Revoke current link
        </button>
      )}

      {message && !setupError && (
        <p className="text-sm font-jost text-eci-purple bg-eci-purple-light/40 px-3 py-2 rounded-lg">{message}</p>
      )}
    </div>
  )
}
