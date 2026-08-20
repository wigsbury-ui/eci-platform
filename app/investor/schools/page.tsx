import { redirect } from 'next/navigation'

/** Network schools shown on Overview — avoid a duplicate portal section. */
export default function InvestorSchoolsRedirect() {
  redirect('/investor')
}
