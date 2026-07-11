import React from "react";
import { colors, radius, typography } from "../../../design-system";

type AdminResetButtonProps = {
  label?: string;
  isNarrow?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const AdminResetButton: React.FC<AdminResetButtonProps> = ({
  label = "Reset",
  isNarrow = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      style={{
        ...styles.button,
        ...(isNarrow ? styles.buttonNarrow : {}),
        ...(disabled ? styles.disabled : {}),
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const styles = {
  button: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: "0 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    flexShrink: 0,
    boxSizing: "border-box" as const,
  },

  buttonNarrow: {
    width: "100%",
    padding: "11px 12px",
  },

  disabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
