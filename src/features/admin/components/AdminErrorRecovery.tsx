import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

type AdminErrorRecoveryProps = {
  message: string;
  isLoading?: boolean;
  retryLabel?: string;
  loadingLabel?: string;
  onRetry: () => void;
};

export const AdminErrorRecovery: React.FC<AdminErrorRecoveryProps> = ({
  message,
  isLoading = false,
  retryLabel = "Retry",
  loadingLabel = "Retrying...",
  onRetry,
}) => {
  return (
    <div style={styles.errorRecovery}>
      <p style={styles.errorRecoveryText}>{message}</p>

      <button
        type="button"
        style={{
          ...styles.errorRecoveryButton,
          ...(isLoading ? styles.disabledAction : {}),
        }}
        onClick={onRetry}
        disabled={isLoading}
      >
        {isLoading ? loadingLabel : retryLabel}
      </button>
    </div>
  );
};

const styles = {
  errorRecovery: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    border: `1px solid rgba(255, 210, 122, 0.35)`,
    backgroundColor: "rgba(255, 210, 122, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  errorRecoveryText: {
    color: colors.accent.yellow,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },

  errorRecoveryButton: {
    border: `1px solid rgba(255, 210, 122, 0.45)`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.accent.yellow,
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    flexShrink: 0,
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
