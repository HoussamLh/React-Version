import React from "react";
import { 
  colors, 
  radius, 
  shadows, 
  spacing, 
  typography 
} from "../../tokens";

type LabelProps = {
  text: React.ReactNode;
  containerStyle?: React.CSSProperties;
  badgeStyle?: React.CSSProperties;
  dotStyle?: React.CSSProperties;
  showDot?: boolean;
};

export const Label: React.FC<LabelProps> = ({
  text,
  containerStyle,
  badgeStyle,
  dotStyle,
  showDot = true,
}) => {
  return (
    <div
      style={{ ...styles.container, ...containerStyle }}
      className="mono-text"
    >
      <div style={{ ...styles.badge, ...badgeStyle }} 
      className="mono-text">
        {showDot && 
        <span style={{ ...styles.dot, ...dotStyle }}>•</span>}
        {text}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: 0,
  },

  badge: {
    backgroundColor: "#1c1f26",
    border: `1px solid ${colors.border.default}`,
    color: colors.accent.green,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: radius.xl,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    boxShadow: shadows.glow,  
  },

  dot: {
    color: colors.accent.green,
    fontSize: typography.fontSize.sm,
  },
};
