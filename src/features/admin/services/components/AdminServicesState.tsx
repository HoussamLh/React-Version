import React from "react";
import { colors, radius, spacing } from "../../../../design-system";

type AdminServicesStateProps = {
  isLoading: boolean;
  hasServices: boolean;
  hasError: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onRetry: () => void;
};

export const AdminServicesState: React.FC<AdminServicesStateProps> = ({
  isLoading,
  hasServices,
  hasError,
  error,
  hasActiveFilters,
  onRetry,
}) => {
  if (isLoading && !hasServices) {
    return <p style={styles.stateText}>Loading services...</p>;
  }

  if (hasError && error) {
    return (
      <div style={styles.errorBox}>
        <p style={styles.errorText}>{error}</p>

        <button type="button" style={styles.retryButton} onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (!isLoading && !hasError && !hasServices) {
    return (
      <div style={styles.emptyState}>
        <h2 style={styles.emptyTitle}>No services found</h2>

        <p style={styles.emptyText}>
          {hasActiveFilters
            ? "Try changing your search or filters."
            : "Services created in the CMS will appear here."}
        </p>
      </div>
    );
  }

  return null;
};

const styles = {
  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
  },

  errorBox: {
    border: `1px solid rgba(255, 193, 7, 0.35)`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 193, 7, 0.08)",
    padding: spacing.lg,
  },

  errorText: {
    color: colors.accent.yellow,
    fontSize: "14px",
    margin: `0 0 ${spacing.md} 0`,
  },

  retryButton: {
    border: `1px solid rgba(255, 193, 7, 0.45)`,
    borderRadius: radius.md,
    backgroundColor: "transparent",
    color: colors.accent.yellow,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
  },

  emptyState: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "18px",
    margin: 0,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
