import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminPricingCardActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  editLabel?: string;
  deleteLabel?: string;
};

export const AdminPricingCardActions: React.FC<
  AdminPricingCardActionsProps
> = ({
  onEdit,
  onDelete,
  isDeleting = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
}) => {
  return (
    <div style={styles.actions}>
      <button type="button" style={styles.editButton} onClick={onEdit}>
        {editLabel}
      </button>

      <button
        type="button"
        style={{
          ...styles.deleteButton,
          ...(isDeleting ? styles.disabledButton : {}),
        }}
        disabled={isDeleting}
        onClick={onDelete}
      >
        {isDeleting ? "Deleting..." : deleteLabel}
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  editButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  deleteButton: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
