import React from "react";
import {
  CTASection,
  ComparisonSection,
  HeroSection,
  MaintenanceSection,
  PricingSection,
} from "../features/pages/pricing";

export const Pricing: React.FC = () => {
  return (
    <div className="ds-page">
      <HeroSection />
      <PricingSection />
      <MaintenanceSection />
      <ComparisonSection />
      <CTASection />
    </div>
  );
};
