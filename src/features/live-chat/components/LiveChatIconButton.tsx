import React from "react";
import { colors, radius } from "../../../design-system";

type LiveChatIconButtonVariant = "main" | "muted";

type LiveChatIconButtonProps = {
  ariaLabel: string;
  children: React.ReactNode;
  variant?: LiveChatIconButtonVariant;
  style?: React.CSSProperties;
  onClick: () => void;
};

export const LiveChatIconButton: React.FC<LiveChatIconButtonProps> = ({
  ariaLabel,
  children,
  variant = "muted",
  style,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      style={{
        ...styles.button,
        ...(variant === "main" ? styles.main : styles.muted),
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const styles = {
  button: {
    width: "34px",
    height: "34px",
    borderRadius: radius.md,
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  main: {
    color: colors.text.main,
  },

  muted: {
    color: colors.text.muted,
  },
};
