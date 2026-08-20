import { redirect } from 'next/navigation'

/** Markets folded into Investor materials for accepted partners. */
export default function AgentMarketsRedirect() {
  redirect('/agent/materials')
}
