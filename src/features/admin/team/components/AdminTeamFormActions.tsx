import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminTeamFormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
  onCancel: () => void;
};

export const AdminTeamFormActions: React.FC<AdminTeamFormActionsProps> = ({
  submitLabel,
  isSubmitting,
  onCancel,
}) => {
  return (
    <div style={styles.actions}>
      <button
        type="button"
        style={{
          ...styles.cancelButton,
          ...(isSubmitting ? styles.disabledButton : {}),
        }}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <button
        type="submit"
        style={{
          ...styles.submitButton,
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
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  cancelButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  submitButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
