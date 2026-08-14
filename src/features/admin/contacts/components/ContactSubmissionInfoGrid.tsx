import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { ContactSubmission } from "../types/contactSubmissions.types";
import { getContactSubmissionMailtoHref } from "../helpers/contactSubmissions.helpers";

type ContactSubmissionInfoGridProps = {
  submission: ContactSubmission;
  isCompactContacts: boolean;
  isNarrowContacts: boolean;
  copiedField: "email" | "phone" | null;
  onCopy: (value: string, field: "email" | "phone") => void | Promise<void>;
};

export const ContactSubmissionInfoGrid: React.FC<
  ContactSubmissionInfoGridProps
> = ({
  submission,
  isCompactContacts,
  isNarrowContacts,
  copiedField,
  onCopy,
}) => {
  return (
    <div
      style={{
        ...styles.infoGrid,
        ...(isCompactContacts ? styles.infoGridCompact : {}),
        ...(isNarrowContacts ? styles.infoGridNarrow : {}),
      }}
    >
      <div style={styles.infoCard}>
        <div style={styles.infoCardHeader}>
          <span style={styles.infoLabel}>Email</span>

          <button
            type="button"
            style={{
              ...styles.copyButton,
              ...(copiedField === "email" ? styles.copyButtonSuccess : {}),
            }}
            onClick={() => onCopy(submission.email, "email")}
          >
            {copiedField === "email" ? "Copied" : "Copy"}
          </button>
        </div>

        <a
          href={getContactSubmissionMailtoHref(submission)}
          style={styles.infoValue}
        >
          {submission.email}
        </a>

        <a
          href={getContactSubmissionMailtoHref(submission)}
          style={styles.contactActionLink}
        >
          Send email
        </a>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoCardHeader}>
          <span style={styles.infoLabel}>Phone</span>

          <button
            type="button"
            style={{
              ...styles.copyButton,
              ...(copiedField === "phone" ? styles.copyButtonSuccess : {}),
            }}
            onClick={() => onCopy(submission.phone, "phone")}
          >
            {copiedField === "phone" ? "Copied" : "Copy"}
          </button>
        </div>

        <a href={`tel:${submission.phone}`} style={styles.infoValue}>
          {submission.phone}
        </a>

        <a href={`tel:${submission.phone}`} style={styles.contactActionLink}>
          Call number
        </a>
      </div>

      <div style={styles.infoCard}>
        <span style={styles.infoLabel}>Service</span>

        <span style={styles.infoValue}>{submission.service}</span>
      </div>

      <div style={styles.infoCard}>
        <span style={styles.infoLabel}>Source</span>

        <span style={styles.infoValue}>{submission.source}</span>
      </div>
    </div>
  );
};

const styles = {
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  infoGridCompact: {
    gridTemplateColumns: "1fr",
  },

  infoGridNarrow: {
    gridTemplateColumns: "1fr",
  },

  infoCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    minWidth: 0,
  },

  infoCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  infoLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "12px",
  },

  infoValue: {
    color: colors.text.main,
    fontSize: "14px",
    lineHeight: "22px",
    textDecoration: "none",
    overflowWrap: "anywhere" as const,
    display: "block",
  },

  copyButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.text.muted,
    padding: "5px 9px",
    fontSize: "11px",
    cursor: "pointer",
  },

  copyButtonSuccess: {
    borderColor: colors.accent.green,
    color: colors.accent.green,
    backgroundColor: "rgba(147, 220, 92, 0.1)",
  },

  contactActionLink: {
    display: "inline-flex",
    marginTop: spacing.md,
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
