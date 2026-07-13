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
      subtitle="Create your customer account and start your DevBySam project onboarding."
      primaryAction={{
        label: "Start Your Project",
        to: "/get-started",
      }}
      secondaryAction={{
        label: "View Services",
        to: "/services",
      }}
    />
  );
};
