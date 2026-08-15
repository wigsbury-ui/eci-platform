import { redirect } from 'next/navigation'

/** Legacy admin routes redirect to /team */
export default function AdminRedirect() {
  redirect('/team')
}
