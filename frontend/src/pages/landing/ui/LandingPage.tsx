import { ArchitectureSection } from "./ArchitectureSection/ArchitectureSection";
import { AudienceSection } from "./AudienceSection/AudienceSection";
import { BenefitsSection } from "./BenefitsSection/BenefitsSection";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { HeroSection } from "./HeroSection/HeroSection";
import { IntegrationSection } from "./IntegrationSection/IntegrationSection";
import { PilotSection } from "./PilotSection/PilotSection";
import { PricingSection } from "./PricingSection/PricingSection";
import { TeamSection } from "./TeamSection/TeamSection";

export function LandingPage() {
  return (
    <div className="page-shell">
      <div className="background-grid" />
      <Header />

      <main id="top">
        <HeroSection />
        <TeamSection />
        <IntegrationSection />
        <ArchitectureSection />
        <BenefitsSection />
        <AudienceSection />
        <PricingSection />
        <PilotSection />
      </main>

      <Footer />
    </div>
  );
}
