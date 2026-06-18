import React from "react";
import { 
  Card, 
  colors, 
  spacing, 
  typography 
} from "../../../design-system";
import type { 
  TrustFeature 
} from "../data/trust.data";

type TrustFeatureCardProps = {
  feature: TrustFeature;
};

export const TrustFeatureCard: 
React.FC<TrustFeatureCardProps> = ({
  feature,
}) => {
  return (
    <Card interactive hoverAccent={feature.hoverAccent} 
    style={styles.card}>
      <div
        className="mono-text"
        style={{ 
          ...styles.iconContainer, 
          color: feature.color 
        }}
      >
        {feature.eyebrow}
      </div>

      <h3 style={styles.cardTitle}>{feature.title}</h3>

      <p style={styles.cardText}>{feature.text}</p>
    </Card>
  );
};

const styles = {
  card: {
    padding: `${spacing["2xl"]} ${spacing.xl}`,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  iconContainer: {
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.xl,
  },

  cardTitle: {
    fontSize: typography.fontSize.cardTitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.main,
    margin: `0 0 ${spacing.md} 0`,
  },

  cardText: {
    fontSize: typography.fontSize.md,
    color: colors.text.muted,
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },
};
