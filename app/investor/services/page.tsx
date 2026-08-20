import { redirect } from 'next/navigation'

/** Partner Services kept as depth later — not a primary portal destination. */
export default function InvestorServicesRedirect() {
  redirect('/investor')
}
