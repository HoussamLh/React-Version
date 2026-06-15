import React from "react";
import { FeatureGridSection } from "../../../shared/sections/FeatureGridSection";
import { coreDomains } from "../data/coreDomains.data";

export const CoreDomains: React.FC = () => {
  return (
    <FeatureGridSection
      badgeText="CAPABILITIES & EXPERTISE"
      titleStart="Core Technical"
      titleAccent="Domains."
      subtitle="Focused engineering capabilities for building scalable, maintainable, and business-ready digital products."
      headingAs="h2"
      cards={coreDomains}
      sectionStyle={styles.section}
    />
  );
};

const styles = {
  section: {
    padding: "100px 0",
    marginBottom: "0",
    borderTop: "1px solid var(--border-color)",
  },
};
