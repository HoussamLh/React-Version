import React from "react";
import { colors, spacing, typography, radius } from "../../../../design-system";
import { AdminStatusBadge } from "../../components";
import { formatAdminDateTime } from "../../utils";
import type { ContactSubmission } from "../types/contactSubmissions.types";

type ContactSubmissionListItemProps = {
  submission: ContactSubmission;
  isActive: boolean;
  onSelect: (submission: ContactSubmission) => void;
};

const getSubmissionStatusTone = (
  status: ContactSubmission["status"],
): "success" | "warning" | "muted" => {
  if (status === "new") {
    return "warning";
  }

  if (status === "closed") {
    return "muted";
  }

  return "success";
};

export const ContactSubmissionListItem: React.FC<
  ContactSubmissionListItemProps
> = ({ submission, isActive, onSelect }) => {
  return (
    <button
      type="button"
      style={{
        ...styles.submissionItem,
        ...(isActive ? styles.submissionItemActive : {}),
      }}
      onClick={() => onSelect(submission)}
    >
      <div style={styles.itemTop}>
        <span style={styles.name}>{submission.name}</span>

        <span style={styles.date}>
          {formatAdminDateTime(submission.createdAt)}
        </span>
      </div>

      <p style={styles.preview}>{submission.message}</p>

      <div style={styles.itemFooter}>
        <span style={styles.serviceBadge}>{submission.service}</span>

        <AdminStatusBadge tone={getSubmissionStatusTone(submission.status)}>
          {submission.status}
        </AdminStatusBadge>
      </div>
    </button>
  );
};

const styles = {
  submissionItem: {
    width: "100%",
    border: "none",
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    textAlign: "left" as const,
    padding: spacing.lg,
    cursor: "pointer",
  },

  submissionItemActive: {
    backgroundColor: "rgba(147, 220, 92, 0.08)",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  name: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
    minWidth: 0,
  },

  date: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  preview: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
  },

  itemFooter: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  serviceBadge: {
    color: colors.text.main,
    backgroundColor: "rgba(255,255,255,0.05)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: "5px 9px",
    fontSize: "11px",
  },
};
