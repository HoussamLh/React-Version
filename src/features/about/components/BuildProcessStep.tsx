import React from "react";
import {
  Card,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";
import type { BuildProcessStepItem } from "../data/buildProcess.data";

type HoverAccent = "green" | "blue" | "purple" | "pink";

type BuildProcessStepProps = {
  step: BuildProcessStepItem;
  hoverAccent?: HoverAccent;
};

const accentColors: Record<HoverAccent, string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
};

export const BuildProcessStep: React.FC<BuildProcessStepProps> = ({
  step,
  hoverAccent = "green",
}) => {
  const accentColor = accentColors[hoverAccent];

  return (
    <Card
      interactive
      hoverAccent={hoverAccent}
      style={styles.card}
      className="about-build-process-step"
    >
      <div
        style={{
          ...styles.numberCircle,
          border: `1px solid ${accentColor}`,
          color: accentColor,
        }}
        className="mono-text"
      >
        {step.number}
      </div>

      <h3 style={styles.title}>{step.title}</h3>

      <p style={styles.description}>{step.description}</p>
    </Card>
  );
};

const styles = {
  card: {
    padding: spacing.xl,
    borderRadius: radius["2xl"],
    minHeight: "220px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  numberCircle: {
    width: "48px",
    height: "48px",
    borderRadius: radius.pill,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: typography.fontSize.cardTitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.main,
    margin: `0 0 ${spacing.md} 0`,
  },

  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.muted,
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },
};
