import React from "react";
import heroImage from "../../../Assets/heroAbout.png";
import { SharedHero } from "../../../design-system";

export const Hero: React.FC = () => {
  return (
    <SharedHero
      badgeText="ENGINEERED FOR TECHNICAL AUTHORITY"
      titleStart="Architecting the Future of"
      titleAccent="Digital Commerce."
      subtitle="Devbysam, we engineer scalable, resilient systems that empower enterprise stakeholders and forward-thinking founders to lead their industries with confidence."
      image={heroImage}
      imageAlt="Data Center Server Infrastructure"
      hoverAccent="green"
    />
  );
};
