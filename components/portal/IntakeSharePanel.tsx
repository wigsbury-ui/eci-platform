'use client'

import { useCallback, useState } from 'react'
import { Copy, Check, Mail } from 'lucide-react'

type Props = {
  shareUrl: string | null
  siteBase: string
}

function randomToken() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

const EMAIL_TEMPLATE = `Dear colleagues,

We are building the ECI partner document library. Please upload any policies, curriculum materials, safeguarding documents, or operational guides you think should be included.

Use this link (name and email required):
{LINK}

Drag and drop files in any common format. Do not worry about tidying filenames. We will review everything and draft articulated partner documentation from your uploads.

Thank you.`

export default function IntakeSharePanel({ shareUrl, siteBase }: Props) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)

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
      /* clipboard denied */
    }
  }, [])

  if (shareUrl) {
    const emailBody = EMAIL_TEMPLATE.replace('{LINK}', shareUrl)
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-cormorant text-xl text-eci-purple-dark mb-1">Colleague upload link</h2>
          <p className="text-sm text-gray-500 font-jost leading-relaxed">
            Email this link to colleagues. They enter name and email, then drag-and-drop files. Uploads
            appear under <strong className="text-gray-700">Team → Doc intake</strong>.
          </p>
        </div>
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
      </div>
    )
  }

  const previewUrl = generatedToken ? `${siteBase}/intake/${generatedToken}` : null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
      <div>
        <h2 className="font-cormorant text-xl text-amber-950 mb-1">Set up your upload link (one time)</h2>
        <p className="text-sm text-amber-900/80 font-jost leading-relaxed">
          There is no separate link generator after setup. You choose a secret token once in Vercel; the
          link is always <code className="font-mono text-xs">/intake/your-token</code>. Generate a token
          below, add it to Vercel, redeploy, then return here to copy the live link.
        </p>
      </div>
      <ol className="text-sm font-jost text-amber-950 space-y-2 list-decimal list-inside">
        <li>Click <strong>Generate token</strong> below</li>
        <li>Vercel → Project → Settings → Environment Variables</li>
        <li>Add <code className="font-mono text-xs">DOCUMENT_INTAKE_TOKEN</code> = your token</li>
        <li>Add <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> if not already set</li>
        <li>Add <code className="font-mono text-xs">NEXT_PUBLIC_SITE_URL</code> = {siteBase}</li>
        <li>Redeploy, then refresh this page</li>
      </ol>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setGeneratedToken(randomToken())}
          className="bg-eci-purple text-white px-4 py-2 rounded-lg text-sm font-jost font-semibold hover:bg-eci-purple-dark"
        >
          Generate token
        </button>
        {generatedToken && (
          <>
            <button
              type="button"
              onClick={() => copy(generatedToken, 'link')}
              className="inline-flex items-center gap-2 border border-amber-300 bg-white px-4 py-2 rounded-lg text-sm font-jost font-semibold text-amber-950"
            >
              <Copy size={16} />
              Copy token for Vercel
            </button>
            <code className="text-xs font-mono text-amber-950 break-all">{generatedToken}</code>
          </>
        )}
      </div>
      {previewUrl && (
        <p className="text-xs font-jost text-amber-900">
          After redeploy, your link will be:{' '}
          <span className="font-mono break-all">{previewUrl}</span>
        </p>
      )}
    </div>
  )
}
