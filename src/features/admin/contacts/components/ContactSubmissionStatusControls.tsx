import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { ContactSubmissionStatus } from "../types/contactSubmissions.types";

type ContactSubmissionStatusControlsProps = {
  submissionId: string;
  status: ContactSubmissionStatus;
  isCompactContacts: boolean;
  isNarrowContacts: boolean;
  isUpdatingStatus: boolean;
  statusOptions: ContactSubmissionStatus[];
  statusMeta: Record<
    ContactSubmissionStatus,
    {
      label: string;
      description: string;
    }
  >;
  onStatusChange: (
    submissionId: string,
    status: ContactSubmissionStatus,
  ) => void | Promise<void>;
};

export const ContactSubmissionStatusControls: React.FC<
  ContactSubmissionStatusControlsProps
> = ({
  submissionId,
  status,
  isCompactContacts,
  isNarrowContacts,
  isUpdatingStatus,
  statusOptions,
  statusMeta,
  onStatusChange,
}) => {
  return (
    <div
      style={{
        ...styles.statusControls,
        ...(isCompactContacts ? styles.statusControlsCompact : {}),
      }}
    >
      <select
        value={status}
        disabled={isUpdatingStatus}
        style={{
          ...styles.statusSelect,
          ...(isNarrowContacts ? styles.statusSelectNarrow : {}),
          ...(isUpdatingStatus ? styles.disabledAction : {}),
        }}
        onChange={(event) =>
          onStatusChange(
            submissionId,
            event.target.value as ContactSubmissionStatus,
          )
        }
      >
        {statusOptions.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusMeta[statusOption].label}
          </option>
        ))}
      </select>

      <div
        style={{
          ...styles.quickStatusActions,
          ...(isCompactContacts ? styles.quickStatusActionsCompact : {}),
          ...(isNarrowContacts ? styles.quickStatusActionsNarrow : {}),
        }}
      >
        {status !== "contacted" && (
          <button
            type="button"
            disabled={isUpdatingStatus}
            style={{
              ...styles.actionButton,
              ...styles.actionButtonPrimary,
              ...(isNarrowContacts ? styles.actionButtonFullWidth : {}),
            }}
            onClick={() => onStatusChange(submissionId, "contacted")}
          >
            Mark contacted
          </button>
        )}

        {status !== "closed" && (
          <button
            type="button"
            disabled={isUpdatingStatus}
            style={{
              ...styles.actionButton,
              ...styles.actionButtonSecondary,
              ...(isNarrowContacts ? styles.actionButtonFullWidth : {}),
            }}
            onClick={() => onStatusChange(submissionId, "closed")}
          >
            Close
          </button>
        )}

        {status !== "new" && (
          <button
            type="button"
            disabled={isUpdatingStatus}
            style={{
              ...styles.actionButton,
              ...styles.actionButtonSecondary,
              ...(isNarrowContacts ? styles.actionButtonFullWidth : {}),
            }}
            onClick={() => onStatusChange(submissionId, "new")}
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  statusControls: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: spacing.sm,
    flexShrink: 0,
  },

  statusControlsCompact: {
    width: "100%",
    alignItems: "flex-start",
  },

  statusSelect: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    textTransform: "capitalize" as const,
    outline: "none",
  },

  statusSelectNarrow: {
    width: "100%",
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  quickStatusActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
    justifyContent: "flex-end",
  },

  quickStatusActionsCompact: {
    justifyContent: "flex-start",
  },

  quickStatusActionsNarrow: {
    width: "100%",
    flexDirection: "column" as const,
    alignItems: "stretch",
  },

  actionButton: {
    borderRadius: radius.md,
    padding: "9px 13px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  actionButtonPrimary: {
    border: `1px solid ${colors.accent.green}`,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
  },

  actionButtonSecondary: {
    border: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    color: colors.text.main,
  },

  actionButtonFullWidth: {
    width: "100%",
  },
};
