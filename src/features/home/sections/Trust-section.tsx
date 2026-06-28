import React from "react";
import { 
  colors, 
  SectionHeader, 
  spacing 
} from "../../../design-system";
import {
  TrustFeatureCard,
  TrustStatCard,
} from "../components";
import { 
  trustFeatures, 
  trustStats 
} from "../data/trust.data";

export const TrustSection: React.FC = () => {
  return (
    <section style={styles.container} className="ds-section">
      {/* Section Header Grid Wrapper */}
      <div style={styles.header} className="ds-grid ds-grid-2">
        {/* Left Side: Header Elements */}
        <SectionHeader
          badgeText="WHY CHOOSE US"
          title="Built for scale."
          titleAccent="Designed for precision."
          subtitle="We don't just build websites, 
          we engineer scalable infrastructures that serve 
          as the backbone for your digital enterprise."
          containerStyle={styles.sectionHeaderContainer}
          textWrapperStyle={styles.textWrapper}
          headingStyle={styles.heading}
          subtitleStyle={styles.subheading}
        />

        {/* Right Side: Small Stat Cards */}
        <div style={styles.smallCards} className="ds-grid ds-grid-2">
          {trustStats.map((stat) => (
            <TrustStatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      {/* Trust Grid Cards */}
      <div style={styles.grid} 
      className="ds-grid ds-grid-3">
        {trustFeatures.map((feature) => (
          <TrustFeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: `${spacing.section} 0`,
    borderTop: `1px solid ${colors.border.default}`,
  },

  header: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "48px",
    alignItems: "end",
    marginBottom: spacing["3xl"],
  },

  sectionHeaderContainer: {
    display: "flex",
    flexDirection: "column" as const,
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  },

  heading: {
    fontSize: "40px",
    fontWeight: 800,
    letterSpacing: "-1px",
    margin: `0 0 ${spacing.md} 0`,
    color: colors.text.main,
    lineHeight: "1.2",
  },

  subheading: {
    fontSize: "15px",
    color: colors.text.muted,
    maxWidth: "500px",
    lineHeight: "1.6",
    margin: 0,
  },

  smallCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: spacing.lg,
  },
};
