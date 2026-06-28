import React from "react";
import { colors, SectionHeader, spacing } from "../../../design-system";
import { BuildProcessStep } from "../components/BuildProcessStep";
import { buildProcessSteps } from "../data/buildProcess.data";

const hoverAccents = ["green", "purple", "blue", "pink"] as const;

export const BuildProcess: React.FC = () => {
  return (
    <section style={styles.container}>
      <SectionHeader
        badgeText="OUR PROCESS"
        title="Our Build"
        titleAccent="Process."
        subtitle="We follow a rigorous, methodology-driven approach to ensure every line of code serves your strategic business objectives."
        containerStyle={styles.header}
        textWrapperStyle={styles.textWrapper}
      />

      <div style={styles.grid} className="ds-grid ds-grid-4">
        {buildProcessSteps.map((step, index) => (
          <BuildProcessStep
            key={step.number}
            step={step}
            hoverAccent={hoverAccents[index]}
          />
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: `${spacing.section} 0`,
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },

  header: {
    marginBottom: spacing["3xl"],
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  },

  grid: {
    gap: spacing.lg,
  },
};
