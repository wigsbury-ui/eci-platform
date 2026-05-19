import PublicNav from '@/components/PublicNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SchoolsSection from '@/components/SchoolsSection'
import PartnershipSection from '@/components/PartnershipSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { School } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: schools } = await supabase
    .from('schools')
    .select('*')
    .eq('is_public', true)
    .order('year_joined', { ascending: true })

  return (
    <main>
      <PublicNav />
      <HeroSection />
      <AboutSection />
      <SchoolsSection schools={(schools as School[]) || []} />
      <PartnershipSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
