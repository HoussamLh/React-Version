import React from "react";
import { SharedHero } from "../../../design-system";

export const HeroSection: React.FC = () => {
  return (
    <SharedHero
      badgeText="TRANSPARENT PRICING"
      titleStart="Scalable"
      titleAccent="Architectures."
      subtitle="Transparent pricing for engineering-led solutions. From rapid prototyping to enterprise-grade technical infrastructure."
      align="center"
      className="ds-hero-no-bottom-gap"
      containerStyle={{
        paddingBottom: 0,
      }}
    />
  );
};
