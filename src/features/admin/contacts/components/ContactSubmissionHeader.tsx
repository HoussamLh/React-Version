import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { formatAdminDateTime } from "../../utils";
import type { ContactSubmissionStatus } from "../types/contactSubmissions.types";
import { ContactSubmissionStatusControls } from "./ContactSubmissionStatusControls";
import {
  statusMeta,
  statusOptions,
} from "../configuration/contactSubmissions.status";

type ContactSubmissionHeaderProps = {
  submissionId: string;
  name: string;
  status: ContactSubmissionStatus;
  createdAt: string;
  isCompactContacts: boolean;
  isNarrowContacts: boolean;
  isUpdatingStatus: boolean;
  onStatusChange: (
    submissionId: string,
    status: ContactSubmissionStatus,
  ) => void | Promise<void>;
};

const getStatusTone = (
  status: ContactSubmissionStatus,
): "success" | "warning" | "muted" => {
  if (status === "new") {
    return "warning";
  }

  if (status === "closed") {
    return "muted";
  }

  return "success";
};

export const ContactSubmissionHeader: React.FC<
  ContactSubmissionHeaderProps
> = ({
  submissionId,
  name,
  status,
  createdAt,
  isCompactContacts,
  isNarrowContacts,
  isUpdatingStatus,
  onStatusChange,
}) => {
  const statusTone = getStatusTone(status);

  return (
    <header
      style={{
        ...styles.detailHeader,
        ...(isCompactContacts ? styles.detailHeaderCompact : {}),
      }}
    >
      <div style={styles.detailHeaderContent}>
        <span
          style={{
            ...styles.statusBadge,
            ...(statusTone === "success" ? styles.statusBadgeSuccess : {}),
            ...(statusTone === "warning" ? styles.statusBadgeWarning : {}),
            ...(statusTone === "muted" ? styles.statusBadgeMuted : {}),
          }}
        >
          {status}
        </span>

        <h3
          style={{
            ...styles.detailTitle,
            ...(isNarrowContacts ? styles.detailTitleNarrow : {}),
          }}
        >
          {name}
        </h3>

        <p style={styles.detailMeta}>
          Submitted {formatAdminDateTime(createdAt)}
        </p>

        <p style={styles.statusDescription}>{statusMeta[status].description}</p>
      </div>

      <ContactSubmissionStatusControls
        submissionId={submissionId}
        status={status}
        isCompactContacts={isCompactContacts}
        isNarrowContacts={isNarrowContacts}
        isUpdatingStatus={isUpdatingStatus}
        statusOptions={statusOptions}
        statusMeta={statusMeta}
        onStatusChange={onStatusChange}
      />
    </header>
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

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: radius.pill,
    padding: "5px 10px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
    border: `1px solid ${colors.border.default}`,
  },

  statusBadgeSuccess: {
    color: colors.accent.green,
    borderColor: colors.accent.green,
    backgroundColor: "rgba(147, 220, 92, 0.1)",
  },

  statusBadgeWarning: {
    color: colors.text.main,
    borderColor: colors.border.default,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
  },

  statusBadgeMuted: {
    color: colors.text.muted,
    borderColor: colors.border.default,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  detailTitle: {
    color: colors.text.main,
    fontSize: "28px",
    fontWeight: typography.fontWeight.black,
    margin: `${spacing.md} 0 0 0`,
    overflowWrap: "anywhere" as const,
  },

  detailTitleNarrow: {
    fontSize: "24px",
  },

  detailMeta: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: `${spacing.sm} 0 0 0`,
  },

  statusDescription: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
