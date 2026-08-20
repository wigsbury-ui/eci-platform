import { redirect } from 'next/navigation'

/** Engagement notes folded into Overview / referrals for a leaner agent portal. */
export default function AgentEngagementRedirect() {
  redirect('/agent')
}
