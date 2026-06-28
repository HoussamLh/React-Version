import React from "react";
import { SharedHero } from "../../../design-system";

export const HeroSection: React.FC = () => {
  return (
    <SharedHero
      badgeText="SELECTED WORK"
      titleStart="Technical"
      titleAccent="Mastery"
      titleEnd="in Motion."
      subtitle="Explore concept projects across SaaS platforms, mobile experiences, backend systems, and enterprise-grade product interfaces."
    />
  );
};
