import React from "react";

import { colors, spacing, typography } from "../../../../design-system";
import { getCloudinaryVideoDeliveryUrl } from "../../../../shared/utils/cloudinaryMedia.helpers";
import type { AdminProject } from "../types/projectsCms.types";

type AdminProjectCardMediaPreviewProps = {
  project: AdminProject;
};

export const AdminProjectCardMediaPreview: React.FC<
  AdminProjectCardMediaPreviewProps
> = ({ project }) => {
  const videoUrl =
    project.mediaType === "video"
      ? getCloudinaryVideoDeliveryUrl(project.videoUrl)
      : null;

  return (
    <div style={styles.mediaWrap}>
      {project.mediaType === "video" && videoUrl ? (
        <video
          src={videoUrl}
          poster={project.videoPosterUrl ?? project.imageUrl ?? undefined}
          controls
          muted
          playsInline
          preload="metadata"
          aria-label={`${project.title} video`}
          style={styles.mediaVideo}
        />
      ) : project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.title}
          style={styles.mediaImage}
        />
      ) : (
        <div style={styles.mediaPlaceholder}>No media preview</div>
      )}

      <span style={styles.mediaBadge}>
        {project.mediaType === "video" ? "Video" : "Image"}
      </span>
    </div>
  );
};

const styles = {
  mediaWrap: {
    height: "220px",
    position: "relative" as const,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    overflow: "hidden",
  },

  mediaVideo: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
    display: "block",
    backgroundColor: "#000",
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

  mediaBadge: {
    position: "absolute" as const,
    right: spacing.md,
    top: spacing.md,
    borderRadius: "999px",
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    color: colors.text.main,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    pointerEvents: "none" as const,
  },
};
