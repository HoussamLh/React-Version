import React from "react";
import { colors, radius } from "../../../design-system";

type AdminFilterButtonProps = {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick: () => void;
};

export const AdminFilterButton: React.FC<AdminFilterButtonProps> = ({
  label,
  count,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      style={{
        ...styles.button,
        ...(isActive ? styles.buttonActive : {}),
      }}
      onClick={onClick}
    >
      {label}

      {typeof count === "number" && <span style={styles.count}>{count}</span>}
    </button>
  );
};

const styles = {
  button: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.text.muted,
    padding: "7px 12px",
    fontSize: "12px",
    textTransform: "capitalize" as const,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  buttonActive: {
    backgroundColor: "rgba(147, 220, 92, 0.12)",
    borderColor: colors.accent.green,
    color: colors.accent.green,
  },

  count: {
    minWidth: "18px",
    height: "18px",
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
  },
};
