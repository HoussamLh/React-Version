import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminProjectFormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
  onCancel: () => void;
};

export const AdminProjectFormActions: React.FC<
  AdminProjectFormActionsProps
> = ({ submitLabel, isSubmitting, onCancel }) => {
  return (
    <div style={styles.actions}>
      <button
        type="button"
        style={styles.secondaryButton}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <button
        type="submit"
        style={{
          ...styles.primaryButton,
          ...(isSubmitting ? styles.disabledButton : {}),
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
};

const styles = {
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.lg}`,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.lg}`,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
