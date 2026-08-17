import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminTeamFormPreviewProps = {
  imageUrl: string;
  imageAlt: string;
};

export const AdminTeamFormPreview: React.FC<AdminTeamFormPreviewProps> = ({
  imageUrl,
  imageAlt,
}) => {
  if (!imageUrl.trim()) {
    return null;
  }

  return (
    <div style={styles.previewBox}>
      <span style={styles.label}>Image preview</span>
      <img src={imageUrl} alt={imageAlt} style={styles.preview} />
    </div>
  );
};

const styles = {
  previewBox: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  label: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  preview: {
    width: "160px",
    height: "120px",
    objectFit: "cover" as const,
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.dark,
  },
};
