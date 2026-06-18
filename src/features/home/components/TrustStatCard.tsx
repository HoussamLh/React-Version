import React from "react";
import { 
  Card, 
  colors, 
  spacing, 
  typography 
} from "../../../design-system";
import type { 
  TrustStat 
} from "../data/trust.data";

type TrustStatCardProps = {
  stat: TrustStat;
};

export const TrustStatCard: 
React.FC<TrustStatCardProps> = ({ stat }) => {
  return (
    <Card interactive style={styles.card}>
      <span style={styles.statNumber} 
      className="mono-text">
        {stat.value}
      </span>

      <h3 style={styles.statLabel} 
      className="mono-text">
        {stat.label}
      </h3>
    </Card>
  );
};

const styles = {
  card: {
    padding: spacing.lg,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  statNumber: {
    fontSize: "28px",
    fontWeight: typography.fontWeight.extraBold,
    color: colors.accent.green,
    marginBottom: spacing.xs,
  },

  statLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.text.muted,
    margin: 0,
  },
};
