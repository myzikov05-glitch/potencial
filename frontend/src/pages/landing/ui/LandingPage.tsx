import { useState } from "react";
import { ArchitectureSection } from "./ArchitectureSection/ArchitectureSection";
import { AudienceSection } from "./AudienceSection/AudienceSection";
import { BenefitsSection } from "./BenefitsSection/BenefitsSection";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { HeroSection } from "./HeroSection/HeroSection";
import { IntegrationSection } from "./IntegrationSection/IntegrationSection";
import { PilotModal } from "./PilotModal/PilotModal";
import { PilotSection } from "./PilotSection/PilotSection";
import { PricingSection } from "./PricingSection/PricingSection";
import { TeamSection } from "./TeamSection/TeamSection";

type LandingPageProps = {
  apiBaseUrl: string;
};

export function LandingPage({ apiBaseUrl }: LandingPageProps) {
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);

  return (
    <div className="page-shell">
      <div className="background-grid" />
      <Header />

      <main id="top">
        <HeroSection onPilotClick={() => setIsPilotModalOpen(true)} />
        <TeamSection />
        <IntegrationSection />
        <ArchitectureSection />
        <BenefitsSection />
        <AudienceSection />
        <PricingSection />
        <PilotSection onPilotClick={() => setIsPilotModalOpen(true)} />
      </main>

      <Footer />
      <PilotModal
        apiBaseUrl={apiBaseUrl}
        isOpen={isPilotModalOpen}
        onClose={() => setIsPilotModalOpen(false)}
      />
    </div>
  );
}
