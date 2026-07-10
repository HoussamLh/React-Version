import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

type AdminActionButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "successGhost"
  | "warningGhost";

type AdminActionButtonSize = "sm" | "md";

type AdminActionButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: AdminActionButtonVariant;
  size?: AdminActionButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};

const getVariantStyle = (variant: AdminActionButtonVariant) => {
  if (variant === "primary") {
    return styles.primary;
  }

  if (variant === "secondary") {
    return styles.secondary;
  }

  if (variant === "successGhost") {
    return styles.successGhost;
  }

  if (variant === "warningGhost") {
    return styles.warningGhost;
  }

  return styles.ghost;
};

const getSizeStyle = (size: AdminActionButtonSize) => {
  if (size === "sm") {
    return styles.small;
  }

  return styles.medium;
};

export const AdminActionButton: React.FC<AdminActionButtonProps> = ({
  children,
  type = "button",
  variant = "secondary",
  size = "md",
  disabled = false,
  fullWidth = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      style={{
        ...styles.base,
        ...getVariantStyle(variant),
        ...getSizeStyle(size),
        ...(fullWidth ? styles.fullWidth : {}),
        ...(disabled ? styles.disabled : {}),
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const styles = {
  base: {
    borderRadius: radius.md,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    boxSizing: "border-box" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    whiteSpace: "nowrap" as const,
  },

  small: {
    padding: "6px 10px",
    fontSize: "11px",
    borderRadius: radius.pill,
  },

  medium: {
    padding: "9px 12px",
    fontSize: "12px",
  },

  primary: {
    border: "none",
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    fontWeight: typography.fontWeight.black,
  },

  secondary: {
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    color: colors.text.main,
  },

  ghost: {
    border: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    color: colors.text.muted,
  },

  successGhost: {
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    backgroundColor: "rgba(147, 220, 92, 0.08)",
    color: colors.accent.green,
  },

  warningGhost: {
    border: `1px solid rgba(255, 210, 122, 0.45)`,
    backgroundColor: "transparent",
    color: colors.accent.yellow,
  },

  fullWidth: {
    width: "100%",
  },

  disabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
