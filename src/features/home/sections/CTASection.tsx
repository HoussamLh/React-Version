import React from "react";
import { 
  AccentText,
  CallToAction 
} from "../../../design-system";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      backgroundAccent="green"
      title={
        <>
          Ready to Build your <AccentText> Digital legacy </AccentText> ?
        </>
      }
      subtitle="Join the elite cohort of founders 
      who prioritize technical excellence and 
      architectural integrity."
      primaryAction={{
        label: "Book a Strategy Call",
        to: "/contact",
      }}
      secondaryAction={{
        label: "View Showcases",
        to: "/projects",
      }}
    />
  );
};
