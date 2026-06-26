import React from "react";
import { CallToAction, AccentText } from "../../../design-system";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      backgroundAccent="pink"
      title={
        <>
          Ready to Scale Your <AccentText>Business.</AccentText>?
        </>
      }
      subtitle="Let’s discuss your project, technical challenges, and growth goals."
      primaryAction={{
        label: "Book a Consultation",
        to: "/contact",
      }}
      secondaryAction={{
        label: "View Pricing",
        to: "/pricing",
      }}
    />
  );
};
