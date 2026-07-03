import React from "react";
import {
  SharedHero,
} from "../../../design-system/components/SharedHero";

export const HeroSection: React.FC = () => {
  return (
    <SharedHero
      badgeText="GET IN TOUCH"
      titleStart="Technical Authority and"
      titleAccent="collaboration."
      subtitle="Do you need a full website, a mobile app, or technical support
        for an existing product, let’s discuss the best direction."
      align="center"
      containerStyle={{
        paddingBottom: 0,
      }}
    />
  );
};