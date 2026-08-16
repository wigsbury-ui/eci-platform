import PublicNav from '@/components/PublicNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import HeadsMessageSection from '@/components/HeadsMessageSection'
import SchoolsSection from '@/components/SchoolsSection'
import ExpansionSection from '@/components/ExpansionSection'
import PartnershipSection from '@/components/PartnershipSection'
import PartnerServicesSection from '@/components/PartnerServicesSection'
import AgentsSection from '@/components/AgentsSection'
import TeamSection from '@/components/TeamSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import HomeScrollSnap from '@/components/HomeScrollSnap'

export default function HomePage() {
  return (
    <main className="home-snap">
      <HomeScrollSnap />
      <PublicNav />
      <HeroSection />
      <AboutSection />
      <HeadsMessageSection />
      <SchoolsSection />
      <ExpansionSection />
      <PartnerServicesSection variant="home" />
      <AgentsSection />
      <TeamSection />
      <PartnershipSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
