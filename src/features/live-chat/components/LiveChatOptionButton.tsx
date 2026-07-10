import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

type LiveChatOptionButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void | Promise<void>;
};

export const LiveChatOptionButton: React.FC<LiveChatOptionButtonProps> = ({
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      style={styles.button}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const styles = {
  button: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    textAlign: "left" as const,
  },
};
