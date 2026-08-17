import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminProject, ProjectStatus } from "../types/projectsCms.types";

type AdminProjectCardProps = {
  project: AdminProject;
  isDeleting: boolean;
  onEdit: (project: AdminProject) => void;
  onDelete: (project: AdminProject) => void;
};

const getProjectMediaPreview = (project: AdminProject) => {
  if (project.mediaType === "video") {
    return project.videoPosterUrl ?? project.imageUrl;
  }

  return project.imageUrl ?? project.videoPosterUrl;
};

const getProjectStatusStyle = (status: ProjectStatus) => {
  if (status === "published") {
    return styles.publishedBadge;
  }

  return styles.draftBadge;
};

export const AdminProjectCard: React.FC<AdminProjectCardProps> = ({
  project,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const mediaPreview = getProjectMediaPreview(project);

  return (
    <article style={styles.projectCard}>
      <div style={styles.mediaWrap}>
        {mediaPreview ? (
          <img
            src={mediaPreview}
            alt={project.title}
            style={styles.mediaImage}
          />
        ) : (
          <div style={styles.mediaPlaceholder}>No media preview</div>
        )}

        {project.mediaType === "video" && (
          <span style={styles.videoBadge}>Video</span>
        )}
      </div>

      <div style={styles.projectContent}>
        <div style={styles.projectTopRow}>
          <div>
            <h2 style={styles.projectTitle}>{project.title}</h2>

            <p style={styles.projectSlug}>/{project.slug}</p>
          </div>

          <span
            style={{
              ...styles.statusBadge,
              ...getProjectStatusStyle(project.status),
            }}
          >
            {project.status}
          </span>
        </div>

        <p style={styles.projectText}>{project.text}</p>

        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Category</span>
            <span style={styles.metaValue}>{project.category}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Layout</span>
            <span style={styles.metaValue}>
              {project.span} / {project.imageHeight}
            </span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Accent</span>
            <span style={styles.metaValue}>{project.hoverAccent}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Order</span>
            <span style={styles.metaValue}>{project.sortOrder}</span>
          </div>
        </div>

        <div style={styles.pillRow}>
          {project.tags.map((tag) => (
            <span key={tag} style={styles.pill}>
              {tag}
            </span>
          ))}
        </div>

        <div style={styles.cardActions}>
          <button
            type="button"
            style={styles.editButton}
            onClick={() => onEdit(project)}
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
            onClick={() => onDelete(project)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
};

const styles = {
  projectCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    overflow: "hidden",
  },

  mediaWrap: {
    height: "180px",
    position: "relative" as const,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  mediaImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  mediaPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    fontSize: "13px",
  },

  videoBadge: {
    position: "absolute" as const,
    right: spacing.md,
    top: spacing.md,
    borderRadius: "999px",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
    color: colors.text.main,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  projectContent: {
    padding: spacing.lg,
  },

  projectTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  projectTitle: {
    color: colors.text.main,
    fontSize: "17px",
    lineHeight: "22px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  projectSlug: {
    color: colors.text.muted,
    fontSize: "12px",
    margin: "4px 0 0 0",
  },

  statusBadge: {
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase" as const,
  },

  publishedBadge: {
    color: colors.accent.green,
    backgroundColor: "rgba(116, 245, 66, 0.1)",
    border: "1px solid rgba(116, 245, 66, 0.35)",
  },

  draftBadge: {
    color: colors.text.muted,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${colors.border.default}`,
  },

  projectText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.md} 0`,
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing.sm,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: spacing.sm,
  },

  metaLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "11px",
    marginBottom: "4px",
  },

  metaValue: {
    color: colors.text.main,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  pillRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  pill: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: "999px",
    color: colors.text.muted,
    padding: "5px 9px",
    fontSize: "11px",
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
    backgroundColor: colors.background.card,
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
