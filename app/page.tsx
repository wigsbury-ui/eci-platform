import PublicNav from '@/components/PublicNav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import HeadsMessageSection from '@/components/HeadsMessageSection'
import SchoolsSection from '@/components/SchoolsSection'
import DohaSpotlightSection from '@/components/DohaSpotlightSection'
import ExpansionSection from '@/components/ExpansionSection'
import PartnershipSection from '@/components/PartnershipSection'
import AgentsSection from '@/components/AgentsSection'
import TeamSection from '@/components/TeamSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="home-snap">
      <PublicNav />
      <HeroSection />
      <AboutSection />
      <HeadsMessageSection />
      <SchoolsSection />
      <DohaSpotlightSection />
      <ExpansionSection />
      <AgentsSection />
      <TeamSection />
      <PartnershipSection />
      <ContactSection
        className="home-window min-h-[100svh] flex flex-col justify-center !py-20"
      />
      <Footer />
    </main>
  )
}
