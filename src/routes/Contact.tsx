import React from "react";
import {
  ContactFormSection,
  CTASection,
  HeroSection,
} from "../features/pages/contact";
export const Contact: React.FC = () => {
  return (
    <div className="ds-page">
      <HeroSection />
      <ContactFormSection />
      <CTASection />
    </div>
  );
};
