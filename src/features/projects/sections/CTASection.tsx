import React from "react";
import { AccentText, CallToAction } from "../../../design-system";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      backgroundAccent="purple"
      title={
        <>
          Have a Technical <AccentText>Challenge?</AccentText>
        </>
      }
      subtitle="We specialize in turning complex requirements into elegant, scalable digital products."
      primaryAction={{
        label: "Start Your Project",
        to: "/contact",
      }}
      secondaryAction={{
        label: "View Pricing",
        to: "/pricing",
      }}
    />
  );
};
