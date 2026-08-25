import React, { useMemo, useState } from "react";

import { radius, spacing } from "../../../design-system";
import {
  cleanupAdminCloudinaryFolder,
  deleteAdminImageFromCloudinary,
} from "../../../shared/services/cloudinaryUpload.service";

import { AdminTeamFormActions } from "./components/AdminTeamFormActions";
import { AdminTeamFormDescription } from "./components/AdminTeamFormDescription";
import { AdminTeamFormFields } from "./components/AdminTeamFormFields";
import { AdminTeamFormMedia } from "./components/AdminTeamFormMedia";
import {
  defaultTeamMemberFormValues,
  getTeamMemberFormValues,
} from "./helpers/teamCms.helpers";
import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "./types/teamCms.types";

type AdminTeamMemberFormProps = {
  initialMember?: AdminTeamMember | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (
    values: AdminTeamMemberFormValues,
    memberId: string,
  ) => Promise<void>;
};

export const AdminTeamMemberForm: React.FC<AdminTeamMemberFormProps> = ({
  initialMember,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<AdminTeamMemberFormValues>(() =>
    initialMember
      ? getTeamMemberFormValues(initialMember)
      : defaultTeamMemberFormValues,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadedPublicIds, setUploadedPublicIds] = useState<string[]>([]);

  const mediaFolderId = useMemo(
    () => initialMember?.id ?? globalThis.crypto.randomUUID(),
    [initialMember?.id],
  );

  const mediaFolder = `devbysam/team/${mediaFolderId}/images`;

  const updateValue = <Key extends keyof AdminTeamMemberFormValues>(
    key: Key,
    value: AdminTeamMemberFormValues[Key],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));

    if (key === "imagePublicId" && typeof value === "string" && value) {
      setUploadedPublicIds((currentIds) =>
        currentIds.includes(value) ? currentIds : [...currentIds, value],
      );
    }
  };

  const cleanupUploadedAssets = async (publicIds: string[]) => {
    await Promise.allSettled(
      publicIds.map((publicId) => deleteAdminImageFromCloudinary(publicId)),
    );
  };

  const cleanupFolder = async () => {
    try {
      await cleanupAdminCloudinaryFolder(`devbysam/team/${mediaFolderId}`);
    } catch (cleanupError) {
      console.error(
        "Could not clean up empty Cloudinary team folders:",
        cleanupError,
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValues: AdminTeamMemberFormValues = {
      ...values,
      name: values.name.trim(),
      role: values.role.trim(),
      description: values.description.trim(),
      imageUrl: values.imageUrl.trim(),
      imageAlt: values.imageAlt.trim() || values.name.trim(),
      sortOrder: Number(values.sortOrder) || 0,
    };

    if (!nextValues.name) {
      setValidationError("Team member name is required.");
      return;
    }

    if (!nextValues.role) {
      setValidationError("Team member role is required.");
      return;
    }

    if (!nextValues.description) {
      setValidationError("Team member description is required.");
      return;
    }

    if (!nextValues.imageUrl || !nextValues.imagePublicId) {
      setValidationError("Team photo is required.");
      return;
    }

    setValidationError(null);

    try {
      await onSubmit(nextValues, mediaFolderId);

      const retainedPublicId = nextValues.imagePublicId;
      const cleanupIds = uploadedPublicIds.filter(
        (publicId) => publicId !== retainedPublicId,
      );

      if (cleanupIds.length > 0) {
        await cleanupUploadedAssets(cleanupIds);
      }

      setUploadedPublicIds([]);
      await cleanupFolder();
    } catch (submitError) {
      if (uploadedPublicIds.length > 0) {
        await cleanupUploadedAssets(uploadedPublicIds);
      }

      await cleanupFolder();
      setUploadedPublicIds([]);
      throw submitError;
    }
  };

  const handleCancel = async () => {
    if (uploadedPublicIds.length > 0) {
      await cleanupUploadedAssets(uploadedPublicIds);
    }

    await cleanupFolder();
    setUploadedPublicIds([]);
    onCancel();
  };

  return (
    <form style={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      {(validationError || error) && (
        <div style={styles.errorBox}>{validationError || error}</div>
      )}

      <AdminTeamFormFields values={values} onValueChange={updateValue} />

      <AdminTeamFormDescription
        value={values.description}
        onChange={(value) => updateValue("description", value)}
      />

      <AdminTeamFormMedia
        values={values}
        folder={mediaFolder}
        disabled={isSubmitting}
        onValueChange={updateValue}
      />


      <AdminTeamFormActions
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
        onCancel={() => void handleCancel()}
      />
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
  },
};
