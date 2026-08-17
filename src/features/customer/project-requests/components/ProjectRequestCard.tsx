import React from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { ProjectRequest } from "../types/projectRequests.types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const formatLabel = (value: string) => value.replaceAll("_", " ");

type ProjectRequestCardProps = {
  request: ProjectRequest;
  unreadCount: number;
};

export const ProjectRequestCard: React.FC<ProjectRequestCardProps> = ({
  request,
  unreadCount,
}) => (
  <article style={styles.card}>
    <div style={styles.top}>
      <div>
        <p style={styles.type}>{formatLabel(request.projectType)}</p>
        <h3 style={styles.title}>{request.title}</h3>
      </div>
      <div style={styles.badges}>
        <span style={styles.statusBadge}>{formatLabel(request.status)}</span>
        {unreadCount > 0 && (
          <span style={styles.messageBadge}>
            {unreadCount} new message{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>

    <p style={styles.text}>{request.description}</p>

    <div style={styles.metaGrid}>
      <span style={styles.metaItem}>
        Package: {request.selectedPackage || "Not selected"}
      </span>
      <span style={styles.metaItem}>
        Budget: {request.budgetRange || "Not provided"}
      </span>
      <span style={styles.metaItem}>
        Timeline: {request.timeline || "Not provided"}
      </span>
      <span style={styles.metaItem}>Submitted: {formatDate(request.createdAt)}</span>
    </div>

    <Link to={`/customer/projects/${request.id}`} style={styles.detailsLink}>
      View Details →
    </Link>
  </article>
);

const styles = {
  card: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    padding: spacing.xl,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.lg,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  type: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.xs} 0`,
  },
  title: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },
  badges: {
    display: "flex",
    gap: spacing.sm,
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  statusBadge: {
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize" as const,
    whiteSpace: "nowrap" as const,
  },
  messageBadge: {
    borderRadius: radius.md,
    backgroundColor: "rgba(116,245,66,0.12)",
    border: `1px solid ${colors.accent.pink}`,
    color: colors.accent.pink,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },
  text: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `0 0 ${spacing.md} 0`,
  },
  metaGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
  },
  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: "8px 12px",
  },
  detailsLink: {
    display: "inline-flex",
    marginTop: spacing.md,
    color: colors.accent.green,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
