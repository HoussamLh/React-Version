import React from "react";
import { colors, radius, spacing } from "../../../../design-system";
import { formatAdminDateTime } from "../../utils";
import type { ContactSubmission } from "../types/contactSubmissions.types";

type ContactSubmissionMessageProps = {
  submission: ContactSubmission;
  isNarrowContacts: boolean;
};

export const ContactSubmissionMessage: React.FC<
  ContactSubmissionMessageProps
> = ({ submission, isNarrowContacts }) => {
  return (
    <article style={styles.messageCard}>
      <div
        style={{
          ...styles.messageHeader,
          ...(isNarrowContacts ? styles.messageHeaderNarrow : {}),
        }}
      >
        <span style={styles.infoLabel}>Message</span>

        <span style={styles.messageDate}>
          {formatAdminDateTime(submission.createdAt)}
        </span>
      </div>

      <p style={styles.messageText}>{submission.message}</p>
    </article>
  );
};

const styles = {
  messageCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
  },

  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  messageHeaderNarrow: {
    flexDirection: "column" as const,
    gap: spacing.xs,
  },

  infoLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "12px",
  },

  messageDate: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  messageText: {
    color: colors.text.main,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    whiteSpace: "pre-line" as const,
    overflowWrap: "anywhere" as const,
  },
};
