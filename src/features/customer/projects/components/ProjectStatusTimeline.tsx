import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { CustomerProjectStatus } from "../customerProjects.types";

type ProjectStatusTimelineProps = {
  status: CustomerProjectStatus;
};

const steps = [
  {
    key: "submitted",
    label: "Submitted",
  },
  {
    key: "reviewed",
    label: "Reviewed",
  },
  {
    key: "in_progress",
    label: "In Progress",
  },
  {
    key: "completed",
    label: "Completed",
  },
] as const;

const statusOrder = ["submitted", "reviewed", "in_progress", "completed"];

export const ProjectStatusTimeline: React.FC<ProjectStatusTimelineProps> = ({
  status,
}) => {
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Project Progress</h3>

      <div style={styles.timeline}>
        {steps.map((step, index) => {
          const completed = index < currentIndex;

          const active = index === currentIndex;

          return (
            <div key={step.key} style={styles.step}>
              <div
                style={{
                  ...styles.circle,
                  ...(completed || active ? styles.activeCircle : {}),
                }}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                style={{
                  ...styles.label,
                  ...(active ? styles.activeLabel : {}),
                }}
              >
                {step.label}
              </span>

              {index < steps.length - 1 && (
                <div
                  style={{
                    ...styles.line,
                    ...(completed ? styles.completedLine : {}),
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTop: `1px solid ${colors.border.default}`,
  },

  title: {
    color: colors.text.main,
    fontSize: "20px",
    fontWeight: typography.fontWeight.black,
    marginBottom: spacing.lg,
  },

  timeline: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  step: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: spacing.sm,
  },

  circle: {
    width: "34px",
    height: "34px",
    borderRadius: radius.xl,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.dark,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.muted,
    fontWeight: typography.fontWeight.bold,
    fontSize: "13px",
  },

  activeCircle: {
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    border: `1px solid ${colors.accent.green}`,
  },

  label: {
    color: colors.text.muted,
    fontSize: "12px",
    textAlign: "center",
  },

  activeLabel: {
    color: colors.text.main,
    fontWeight: typography.fontWeight.bold,
  },

  line: {
    position: "absolute",
    top: "17px",
    left: "60%",
    width: "80%",
    height: "2px",
    backgroundColor: colors.border.default,
  },

  completedLine: {
    backgroundColor: colors.accent.green,
  },
};
