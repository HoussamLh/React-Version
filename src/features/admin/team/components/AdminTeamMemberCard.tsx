import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminTeamMember } from "../types/teamCms.types";

const accentColorMap: Record<AdminTeamMember["hoverAccent"], string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
};

type AdminTeamMemberCardProps = {
  member: AdminTeamMember;
  isDeleting: boolean;
  onEdit: (member: AdminTeamMember) => void;
  onDelete: (member: AdminTeamMember) => void;
};

export const AdminTeamMemberCard: React.FC<AdminTeamMemberCardProps> = ({
  member,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const accentColor = accentColorMap[member.hoverAccent];

  return (
    <article style={styles.card}>
      <div style={styles.imageWrapper}>
        <img
          src={member.imageUrl}
          alt={member.imageAlt}
          style={styles.image}
        />
      </div>

      <div style={styles.cardContent}>
        <div style={styles.cardTop}>
          <div>
            <p
              style={{ ...styles.role, color: accentColor }}
              className="mono-text"
            >
              {member.role}
            </p>

            <h2 style={styles.memberName}>{member.name}</h2>
          </div>

          <span
            style={{
              ...styles.statusBadge,
              ...(member.status === "published"
                ? styles.statusPublished
                : styles.statusDraft),
            }}
          >
            {member.status}
          </span>
        </div>

        <p style={styles.description}>{member.description}</p>

        <div style={styles.metaList}>
          <span style={styles.metaItem}>Accent: {member.hoverAccent}</span>
          <span style={styles.metaItem}>Order: {member.sortOrder}</span>
        </div>

        <div style={styles.cardActions}>
          <button
            type="button"
            style={styles.editButton}
            onClick={() => onEdit(member)}
          >
            Edit
          </button>

          <button
            type="button"
            style={{
              ...styles.deleteButton,
              ...(isDeleting ? styles.disabledButton : {}),
            }}
            disabled={isDeleting}
            onClick={() => onDelete(member)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
};

const styles = {
  card: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    overflow: "hidden" as const,
  },

  imageWrapper: {
    width: "100%",
    height: "220px",
    backgroundColor: colors.background.dark,
    overflow: "hidden" as const,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  cardContent: {
    padding: spacing.lg,
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    alignItems: "flex-start",
  },

  role: {
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    margin: `0 0 ${spacing.xs} 0`,
  },

  memberName: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  statusBadge: {
    borderRadius: radius.pill,
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: "11px",
    lineHeight: 1,
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    fontWeight: typography.fontWeight.black,
  },

  statusPublished: {
    backgroundColor: "rgba(116, 245, 66, 0.12)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
  },

  statusDraft: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${colors.border.default}`,
    color: colors.text.muted,
  },

  description: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.md} 0`,
  },

  metaList: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap" as const,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: `${spacing.xs} ${spacing.sm}`,
  },

  cardActions: {
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
