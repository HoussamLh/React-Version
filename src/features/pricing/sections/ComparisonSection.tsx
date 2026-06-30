import React from "react";
import { colors, SharedHero } from "../../../design-system";
import { ComparisonTable } from "../components";
import { comparisonRows } from "../data/pricing.data";

export const ComparisonSection: React.FC = () => {
  return (
    <section style={styles.container} className="ds-section">
      <SharedHero
        badgeText="COMPARISON TABLE"
        titleStart="Know what is"
        titleAccent="Included."
        subtitle="A quick technical comparison between the main build levels."
        align="center"
        className="ds-hero-no-bottom-gap"
        containerStyle={{
          padding: 0,
        }}
      />

      <ComparisonTable rows={comparisonRows} />
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },
};
