import React from "react";
import { SendHorizontal } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";

type LiveChatPrimaryButtonVariant = "card" | "pill";

type LiveChatPrimaryButtonProps = {
  children: React.ReactNode;
  variant?: LiveChatPrimaryButtonVariant;
  onClick: () => void;
};

export const LiveChatPrimaryButton: React.FC<LiveChatPrimaryButtonProps> = ({
  children,
  variant = "card",
  onClick,
}) => {
  return (
    <button
      type="button"
      style={{
        ...styles.base,
        ...(variant === "pill" ? styles.pill : styles.card),
      }}
      onClick={onClick}
    >
      <span>{children}</span>
      <SendHorizontal size={18} />
    </button>
  );
};

const styles = {
  base: {
    display: "flex",
    alignItems: "center",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  card: {
    width: "100%",
    minHeight: "54px",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: colors.text.main,
    color: colors.background.dark,
    justifyContent: "space-between",
    padding: `0 ${spacing.lg}`,
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
  },

  pill: {
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: spacing.xl,
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.pink,
    color: colors.text.main,
    justifyContent: "center",
    gap: spacing.md,
    padding: "13px 22px",
  },
};
