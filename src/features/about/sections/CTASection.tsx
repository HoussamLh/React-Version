import React from "react";
import { CTASection as SharedCTASection } from "../../../shared/sections";

export const CTASection: React.FC = () => {
  return (
    <SharedCTASection
      variant="default"
      overlayVariant="masked"
      showTopBorder={false}
      titleStart="Let's build something exceptional together."
      titleLineHeight="1.2"
      subtitle="Whether you need to stabilize a legacy platform, scale a cloud backend, or engineer a brand new digital asset we have the expertise to execute flawlessly."
      subtitleMaxWidth="600px"
      primaryLabel="Contact Us"
      secondaryLabel="Explore Services"
      secondaryTo="/services"
    />
  );
};
