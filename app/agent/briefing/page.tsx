import { redirect } from 'next/navigation'

/** Briefing replaced by About ECI + Why partner for applicants. */
export default function AgentBriefingRedirect() {
  redirect('/agent/about')
}
