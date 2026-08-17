import React from "react";

import { colors, radius, spacing } from "../../../../design-system";

type AdminProjectFormMediaPreviewProps = {
  mediaPreview: string | null;
  title: string;
};

export const AdminProjectFormMediaPreview: React.FC<
  AdminProjectFormMediaPreviewProps
> = ({ mediaPreview, title }) => {
  if (!mediaPreview) {
    return null;
  }

  return (
    <div style={styles.previewBox}>
      <span style={styles.previewLabel}>Media preview</span>

      <img src={mediaPreview} alt={title} style={styles.preview} />
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
    maxHeight: "220px",
    borderRadius: radius.md,
    objectFit: "cover" as const,
    display: "block",
  },
};
