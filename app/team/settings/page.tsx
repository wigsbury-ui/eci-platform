import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { requirePortalAccess } from '@/lib/supabase/session'
import { HERITAGE } from '@/lib/content/network'
import { teamShellProps } from '@/components/portal/teamNav'

export default async function TeamSettingsPage() {
  const { profile } = await requirePortalAccess(
    ['super_admin', 'admin'],
    'super_admin'
  )

  return (
    <PortalShell {...teamShellProps(profile, '/team/settings')}>
      <h1 className="font-cormorant text-4xl text-eci-purple-dark mb-2">Organisation settings</h1>
      <p className="text-gray-400 text-sm font-jost mb-10">Global ECI configuration controlled by super admins.</p>

      <div className="grid gap-6 max-w-2xl">
        {[
          { label: 'Organisation email', value: HERITAGE.email },
          { label: 'UK office', value: HERITAGE.address },
          { label: 'Charity number', value: HERITAGE.charityNumber },
          { label: 'Chatbot', value: 'First-party RAG enabled · set LLM_BASE_URL for self-hosted inference' },
          { label: 'Email notifications', value: 'Configure SMTP / Resend env vars to activate message alerts' },
          { label: 'Storage buckets', value: 'school-docs · investor-packs · team-docs · doc-intake' },
          { label: 'Document intake', value: 'Set DOCUMENT_INTAKE_TOKEN and share /intake/{token} with colleagues' },
        ].map(row => (
          <div key={row.label} className="bg-white border border-gray-100 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-jost mb-1">{row.label}</p>
            <p className="font-jost text-sm text-gray-800">{row.value}</p>
          </div>
        ))}
      </div>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
