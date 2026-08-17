import React from "react";

import { colors, spacing, typography } from "../../../../design-system";
import type { AdminProject } from "../types/projectsCms.types";

type AdminProjectCardMediaPreviewProps = {
  project: AdminProject;
};

const getProjectMediaPreview = (project: AdminProject) => {
  if (project.mediaType === "video") {
    return project.videoPosterUrl ?? project.imageUrl;
  }

  return project.imageUrl ?? project.videoPosterUrl;
};

export const AdminProjectCardMediaPreview: React.FC<
  AdminProjectCardMediaPreviewProps
> = ({ project }) => {
  const mediaPreview = getProjectMediaPreview(project);

  return (
    <div style={styles.mediaWrap}>
      {mediaPreview ? (
        <img src={mediaPreview} alt={project.title} style={styles.mediaImage} />
      ) : (
        <div style={styles.mediaPlaceholder}>No media preview</div>
      )}

      {project.mediaType === "video" && (
        <span style={styles.videoBadge}>Video</span>
      )}
    </div>
  );
};

const styles = {
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
};
