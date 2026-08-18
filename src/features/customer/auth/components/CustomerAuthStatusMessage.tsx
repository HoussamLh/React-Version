import React from "react";
import { colors, radius, spacing } from "../../../../design-system";

const styles = {
  error: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },

  success: {
    border: `1px solid ${colors.accent.green}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    color: colors.accent.green,
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },
} satisfies Record<string, React.CSSProperties>;

type CustomerAuthStatusMessageProps = {
  type: "error" | "success";
  children: React.ReactNode;
};

export const CustomerAuthStatusMessage: React.FC<
  CustomerAuthStatusMessageProps
> = ({ type, children }) => {
  return <p style={styles[type]}>{children}</p>;
};
