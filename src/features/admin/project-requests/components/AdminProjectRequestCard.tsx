import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminProjectRequest } from "../types/adminProjectRequests.types";
import {
  formatProjectRequestDate,
  formatProjectRequestLabel,
} from "../utils/adminProjectRequests.utils";

type AdminProjectRequestCardProps = {
  request: AdminProjectRequest;
  unreadCount: number;
  isDeleting: boolean;
  onReview: (request: AdminProjectRequest) => void;
  onDelete: (request: AdminProjectRequest) => void;
};

export const AdminProjectRequestCard: React.FC<
  AdminProjectRequestCardProps
> = ({ request, unreadCount, isDeleting, onReview, onDelete }) => {
  return (
    <article style={styles.requestCard}>
      <div style={styles.requestTop}>
        <div>
          <p style={styles.requestType}>
            {formatProjectRequestLabel(request.projectType)}
          </p>

          <div style={styles.titleRow}>
            <h2 style={styles.requestTitle}>{request.title}</h2>

            {unreadCount > 0 && (
              <span style={styles.messageBadge}>{unreadCount} new message</span>
            )}
          </div>

          <p style={styles.customerLine}>
            {request.customerName || "Unknown customer"} ·{" "}
            {request.customerEmail || "No email"}
          </p>
        </div>

        <span style={styles.statusBadge}>
          {formatProjectRequestLabel(request.status)}
        </span>
      </div>

      <p style={styles.requestText}>{request.description}</p>

      {request.goals && (
        <p style={styles.requestText}>
          <strong style={styles.strongText}>Goals:</strong> {request.goals}
        </p>
      )}

      <div style={styles.metaGrid}>
        <span style={styles.metaItem}>
          Package: {request.selectedPackage || "Not selected"}
        </span>

        <span style={styles.metaItem}>
          Category: {formatProjectRequestLabel(request.packageCategory)}
        </span>

        <span style={styles.metaItem}>
          Budget: {request.budgetRange || "Not provided"}
        </span>

        <span style={styles.metaItem}>
          Timeline: {request.timeline || "Not provided"}
        </span>

        <span style={styles.metaItem}>
          Submitted: {formatProjectRequestDate(request.createdAt)}
        </span>
      </div>

      <div style={styles.customerDetails}>
        <span>Company: {request.customerCompany || "Not provided"}</span>

        <span>Phone: {request.customerPhone || "Not provided"}</span>
      </div>

      {request.adminNotes && (
        <div style={styles.notesBox}>
          <strong style={styles.strongText}>Admin notes:</strong>{" "}
          {request.adminNotes}
        </div>
      )}

      <div style={styles.cardActions}>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => onReview(request)}
        >
          Review
        </button>

        <button
          type="button"
          style={{
            ...styles.deleteButton,
            ...(isDeleting ? styles.disabledButton : {}),
          }}
          disabled={isDeleting}
          onClick={() => onDelete(request)}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

const styles: Record<string, React.CSSProperties> = {
  requestCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.xl,
  },

  requestTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.lg,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },

  requestType: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.xs} 0`,
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },

  requestTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  messageBadge: {
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,90,90,0.12)",
    border: "1px solid rgba(255,90,90,0.45)",
    color: "#ff7777",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  customerLine: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  statusBadge: {
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  requestText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `0 0 ${spacing.md} 0`,
  },

  strongText: {
    color: colors.text.main,
  },

  metaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: "8px 12px",
  },

  customerDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.md,
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    marginBottom: spacing.md,
  },

  notesBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.muted,
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    marginBottom: spacing.md,
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
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
