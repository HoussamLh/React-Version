import React from "react";
import { colors, radius, spacing } from "../../../design-system";

type AdminSuccessMessageProps = {
  children: React.ReactNode;
};

export const AdminSuccessMessage: React.FC<AdminSuccessMessageProps> = ({
  children,
}) => {
  return (
    <p style={styles.successText} role="status">
      {children}
    </p>
  );
};

const styles = {
  successText: {
    color: colors.accent.green,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.lg} 0 0 0`,
    padding: spacing.md,
    borderRadius: radius.md,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    backgroundColor: "rgba(147, 220, 92, 0.08)",
  },
};
