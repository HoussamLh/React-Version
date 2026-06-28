import React from "react";
import {
  AccentText,
  CallToAction,
} from "../../../design-system";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      backgroundAccent="blue"
      title={
        <>
          Let's Build Something <AccentText> Exceptional Together </AccentText>.
        </>
      }
      subtitle="Whether you need to stabilize a legacy platform,
      scale a cloud backend, or engineer a brand new digital 
      asset we have the expertise to execute flawlessly."
      primaryAction={{
        label: "Contact Us",
        to: "/contact",
      }}
      secondaryAction={{
        label: "Explore Services",
        to: "/services",
      }}
    />
  );
};