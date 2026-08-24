import React from "react";
import { SharedHero } from "../../../../design-system";

const heroAbout =
  "https://res.cloudinary.com/pekcmwlo/image/upload/v1787091789/heroAbout.jpg";

export const Hero: React.FC = () => {
  return (
    <SharedHero
      badgeText="ENGINEERED FOR TECHNICAL AUTHORITY"
      titleStart="Architecting the Future of"
      titleAccent="Digital Commerce."
      subtitle="Devbysam, we engineer scalable, resilient systems that empower enterprise stakeholders and forward-thinking founders to lead their industries with confidence."
      image={heroAbout}
      imageAlt="Data Center Server Infrastructure"
      hoverAccent="blue"
    />
  );
};
