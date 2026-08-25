import React from "react";

import { spacing } from "../../../../design-system";
import { CloudinaryImageUpload } from "../../../../shared/components/media/CloudinaryImageUpload";
import type { AdminTeamMemberFormValues } from "../types/teamCms.types";

type AdminTeamFormMediaProps = {
  values: AdminTeamMemberFormValues;
  folder: string;
  disabled?: boolean;
  onValueChange: <Key extends keyof AdminTeamMemberFormValues>(
    key: Key,
    value: AdminTeamMemberFormValues[Key],
  ) => void;
};

export const AdminTeamFormMedia: React.FC<AdminTeamFormMediaProps> = ({
  values,
  folder,
  disabled = false,
  onValueChange,
}) => {
  return (
    <div style={styles.wrapper}>
      <CloudinaryImageUpload
        value={values.imageUrl || null}
        publicId={values.imagePublicId}
        folder={folder}
        label="Team photo"
        disabled={disabled}
        onChange={(nextValue) => {
          onValueChange("imageUrl", nextValue.secureUrl ?? "");
          onValueChange("imagePublicId", nextValue.publicId);
        }}
      />
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },
};
