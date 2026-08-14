import React from "react";
import { colors, spacing, radius } from "../../../design-system";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "./contactSubmissions.types";
import { getContactSubmissionMailtoHref } from "./contactSubmissions.helpers";

type ContactSubmissionDetailsProps = {
  submission: ContactSubmission;
  isCompactContacts: boolean;
  isNarrowContacts: boolean;
  isUpdatingStatus: boolean;
  copiedField: "email" | "phone" | null;
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
  onCopy: (value: string, field: "email" | "phone") => void | Promise<void>;
};

export const ContactSubmissionDetails: React.FC<
  ContactSubmissionDetailsProps
> = ({
  submission,
  isCompactContacts,
  isNarrowContacts,
  isUpdatingStatus,
  copiedField,
  statusOptions,
  statusMeta,
  onStatusChange,
  onCopy,
}) => {
  return (
    <>
      <header
        style={{
          ...styles.detailHeader,
          ...(isCompactContacts ? styles.detailHeaderCompact : {}),
        }}
      >
        <div style={styles.detailHeaderContent}>
          <p style={styles.detailMeta}>
            Submitted {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>

        <div
          style={{
            ...styles.statusControls,
            ...(isCompactContacts ? styles.statusControlsCompact : {}),
          }}
        >
          <select
            value={submission.status}
            disabled={isUpdatingStatus}
            style={{
              ...styles.statusSelect,
              ...(isNarrowContacts ? styles.statusSelectNarrow : {}),
              ...(isUpdatingStatus ? styles.disabledAction : {}),
            }}
            onChange={(event) =>
              onStatusChange(
                submission.id,
                event.target.value as ContactSubmissionStatus,
              )
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusMeta[status].label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div style={styles.placeholderDetails}>
        <p style={styles.placeholderText}>
          Contact submission details remain here temporarily.
        </p>

        <p style={styles.placeholderText}>
          The details section will be extracted into
          ContactSubmissionDetails.tsx in the next step.
        </p>

        <button type="button" onClick={() => onCopy(submission.email, "email")}>
          {copiedField === "email" ? "Email copied" : "Copy email"}
        </button>

        <a href={getContactSubmissionMailtoHref(submission)}>
          {submission.email}
        </a>
      </div>
    </>
  );
};

const styles = {
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  detailHeaderCompact: {
    flexDirection: "column" as const,
  },

  detailHeaderContent: {
    minWidth: 0,
  },

  detailMeta: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: 0,
  },

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

  placeholderDetails: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
  },

  placeholderText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `0 0 ${spacing.sm} 0`,
  },
};
