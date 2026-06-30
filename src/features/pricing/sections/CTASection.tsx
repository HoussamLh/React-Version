import React from "react";
import { AccentText, CallToAction } from "../../../design-system";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      backgroundAccent="blue"
      title={
        <>
          Ready to Start Your <AccentText>Project?</AccentText>
        </>
      }
      subtitle="Tell us what you want to build, and we’ll recommend the right package for your goals."
      primaryAction={{
        label: "Start Your Project",
        to: "/contact",
      }}
      secondaryAction={{
        label: "View Services",
        to: "/services",
      }}
    />
  );
};
