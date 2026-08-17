import React from "react";

import { colors, radius, spacing } from "../../../../design-system";

type AdminServiceFormPreviewProps = {
  imageUrl: string | null;
  title: string;
};

export const AdminServiceFormPreview: React.FC<
  AdminServiceFormPreviewProps
> = ({ imageUrl, title }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div style={styles.previewBox}>
      <span style={styles.previewLabel}>Image preview</span>

      <img src={imageUrl} alt={title} style={styles.preview} />
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
