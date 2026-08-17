import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminProjectRequestEmptyStateProps = {
  hasSearchOrFilter: boolean;
};

export const AdminProjectRequestEmptyState: React.FC<
  AdminProjectRequestEmptyStateProps
> = ({ hasSearchOrFilter }) => {
  return (
    <div style={styles.stateBox}>
      <h2 style={styles.stateTitle}>No project requests found</h2>

      <p style={styles.stateText}>
        {hasSearchOrFilter
          ? "Try changing your search or status filter."
          : "New customer requests will appear here after they are submitted."}
      </p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  stateBox: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: spacing.xl,
    textAlign: "center",
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
