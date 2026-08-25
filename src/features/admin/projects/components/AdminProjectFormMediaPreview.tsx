import React from "react";

import { colors, radius, spacing } from "../../../../design-system";
import { getCloudinaryVideoDeliveryUrl } from "../../../../shared/utils/cloudinaryMedia.helpers";

type AdminProjectFormMediaPreviewProps = {
  mediaType: "image" | "video";
  mediaUrl: string | null;
  posterUrl: string | null;
  title: string;
};

export const AdminProjectFormMediaPreview: React.FC<
  AdminProjectFormMediaPreviewProps
> = ({ mediaType, mediaUrl, posterUrl, title }) => {
  const videoUrl =
    mediaType === "video" ? getCloudinaryVideoDeliveryUrl(mediaUrl) : null;

  if (!mediaUrl && !posterUrl) {
    return null;
  }

  return (
    <div style={styles.previewBox}>
      <span style={styles.previewLabel}>Media preview</span>

      {mediaType === "video" && videoUrl ? (
        <video
          src={videoUrl}
          poster={posterUrl ?? undefined}
          controls
          playsInline
          preload="metadata"
          aria-label={`${title || "Project"} video preview`}
          style={styles.preview}
        />
      ) : (
        <img
          src={mediaUrl ?? posterUrl ?? ""}
          alt={title || "Project media preview"}
          style={styles.preview}
        />
      )}
    </div>
  );
};

const styles = {
  previewBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.background.dark,
  },

  previewLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "12px",
    marginBottom: spacing.sm,
  },

  preview: {
    width: "100%",
    maxHeight: "320px",
    borderRadius: radius.md,
    objectFit: "contain" as const,
    display: "block",
    backgroundColor: "#000",
  },
};
