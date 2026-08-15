import PublicNav from '@/components/PublicNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SchoolsSection from '@/components/SchoolsSection'
import ExpansionSection from '@/components/ExpansionSection'
import PartnershipSection from '@/components/PartnershipSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <PublicNav />
      <HeroSection />
      <AboutSection />
      <SchoolsSection />
      <ExpansionSection />
      <PartnershipSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
