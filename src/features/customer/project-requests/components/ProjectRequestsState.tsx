import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

type ProjectRequestsStateProps = {
  title?: string;
  text: string;
};

export const ProjectRequestsState: React.FC<ProjectRequestsStateProps> = ({
  title,
  text,
}) => (
  <div style={styles.box}>
    {title && <h3 style={styles.title}>{title}</h3>}
    <p style={styles.text}>{text}</p>
  </div>
);

const styles = {
  box: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    padding: spacing.xl,
    textAlign: "center" as const,
  },
  title: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },
  text: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },
};
