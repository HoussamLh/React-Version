import React from "react";
import { 
  CallToAction 
} from "../../../design-system";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      title="Ready to build your digital legacy?"
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
