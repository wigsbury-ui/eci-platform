import PublicNav from '@/components/PublicNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import HeadsMessageSection from '@/components/HeadsMessageSection'
import SchoolsSection from '@/components/SchoolsSection'
import ExpansionSection from '@/components/ExpansionSection'
import PartnershipSection from '@/components/PartnershipSection'
import PartnerServicesSection from '@/components/PartnerServicesSection'
import TeamSection from '@/components/TeamSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="home-snap">
      <PublicNav />
      <HeroSection />
      <AboutSection />
      <HeadsMessageSection />
      <SchoolsSection />
      <ExpansionSection ctaHref="/investors#contact" />
      <PartnerServicesSection variant="home" />
      <PartnershipSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
