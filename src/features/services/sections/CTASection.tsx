import React from "react";
import { CTASection as SharedCTASection } from "../../../shared/sections";

export const CTASection: React.FC = () => {
  return (
    <SharedCTASection
      variant="accent"
      titleStart="Ready to Scale Your"
      titleAccent=" Business."
      titleEnd="?"
      subtitle="Let’s discuss your project, technical challenges, and growth goals."
      primaryLabel="Book a Consultation"
      secondaryLabel="View Pricing"
      secondaryTo="/pricing"
    />
  );
};
