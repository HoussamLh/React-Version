import React, { useState } from "react";

import { colors, radius, spacing } from "../../../../design-system";
import {
  cleanupAdminCloudinaryFolder,
  deleteAdminMediaFromCloudinary,
} from "../../../../shared/services/cloudinaryUpload.service";
import { useAdminProjectForm } from "../hooks/useAdminProjectForm";
import type { AdminProjectFormValues } from "../types/projectsCms.types";
import { AdminProjectFormActions } from "./AdminProjectFormActions";
import { AdminProjectFormFields } from "./AdminProjectFormFields";
import { AdminProjectFormMediaPreview } from "./AdminProjectFormMediaPreview";
import { AdminProjectMediaFields } from "./AdminProjectMediaFields";
import { AdminProjectSettingsFields } from "./AdminProjectSettingsFields";

type AdminProjectFormProps = {
  initialValues?: AdminProjectFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  projectId: string;
  onCancel: () => void;
  onSubmit: (values: AdminProjectFormValues) => void | Promise<void>;
};

type UploadedAsset = {
  publicId: string;
  resourceType: "image" | "video";
};

export const AdminProjectForm: React.FC<AdminProjectFormProps> = ({
  initialValues,
  submitLabel,
  isSubmitting = false,
  projectId,
  onCancel,
  onSubmit,
}) => {
  const {
    values,
    tagsInput,
    validationError,
    mediaPreview,
    updateValue,
    handleTitleChange,
    handleSlugChange,
    handleMediaTypeChange,
    handleSubmit,
    setTagsInput,
  } = useAdminProjectForm({ initialValues, isSubmitting, onSubmit });

  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);

  const trackUpload = (asset: UploadedAsset) => {
    setUploadedAssets((currentAssets) =>
      currentAssets.some((currentAsset) => currentAsset.publicId === asset.publicId)
        ? currentAssets
        : [...currentAssets, asset],
    );
  };

  const cleanupAssets = async (assets: UploadedAsset[]) => {
    await Promise.allSettled(
      assets.map((asset) => deleteAdminMediaFromCloudinary(asset.publicId, asset.resourceType)),
    );
  };

  const handleImageChange = (nextValue: { secureUrl: string | null; publicId: string | null }) => {
    if (nextValue.publicId) trackUpload({ publicId: nextValue.publicId, resourceType: "image" });
    updateValue("imageUrl", nextValue.secureUrl);
    updateValue("imagePublicId", nextValue.publicId);
  };

  const handleVideoChange = (nextValue: { secureUrl: string | null; publicId: string | null }) => {
    if (nextValue.publicId) trackUpload({ publicId: nextValue.publicId, resourceType: "video" });
    updateValue("videoUrl", nextValue.secureUrl);
    updateValue("videoPublicId", nextValue.publicId);
  };

  const handleVideoPosterChange = (nextValue: { secureUrl: string | null; publicId: string | null }) => {
    if (nextValue.publicId) trackUpload({ publicId: nextValue.publicId, resourceType: "image" });
    updateValue("videoPosterUrl", nextValue.secureUrl);
    updateValue("videoPosterPublicId", nextValue.publicId);
  };

  const handleCancel = async () => {
    await cleanupAssets(uploadedAssets);

    try {
      if (projectId) {
        await cleanupAdminCloudinaryFolder(`devbysam/projects/${projectId}`);
      }
    } catch (error) {
      console.error("Could not clean up empty Cloudinary project folders:", error);
    }

    setUploadedAssets([]);
    onCancel();
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const didSubmit = await handleSubmit(event);

      if (!didSubmit) {
        return;
      }

      const retainedIds = new Set(
        [values.imagePublicId, values.videoPublicId, values.videoPosterPublicId].filter(
          (value): value is string => Boolean(value),
        ),
      );

      const cleanupCandidates = uploadedAssets.filter(
        (asset) => !retainedIds.has(asset.publicId),
      );

      if (cleanupCandidates.length > 0) {
        await cleanupAssets(cleanupCandidates);
      }

      try {
        if (projectId) {
          await cleanupAdminCloudinaryFolder(`devbysam/projects/${projectId}`);
        }
      } catch (cleanupError) {
        console.error("Could not clean up empty Cloudinary project folders:", cleanupError);
      }

      setUploadedAssets([]);
    } catch (error) {
      await cleanupAssets(uploadedAssets);

      try {
        if (projectId) {
          await cleanupAdminCloudinaryFolder(`devbysam/projects/${projectId}`);
        }
      } catch (cleanupError) {
        console.error("Could not clean up empty Cloudinary project folders:", cleanupError);
      }

      setUploadedAssets([]);
      throw error;
    }
  };

  return (
    <form style={styles.form} onSubmit={(event) => void handleFormSubmit(event)}>
      {validationError && <div style={styles.errorBox}>{validationError}</div>}

      <AdminProjectFormFields
        values={values}
        tagsInput={tagsInput}
        onTitleChange={handleTitleChange}
        onSlugChange={handleSlugChange}
        onTagsChange={setTagsInput}
        onUpdateValue={updateValue}
      />

      <AdminProjectMediaFields
        values={values}
        imageFolder={`devbysam/projects/${projectId}/images`}
        videoFolder={`devbysam/projects/${projectId}/videos`}
        onMediaTypeChange={handleMediaTypeChange}
        onImageChange={handleImageChange}
        onVideoChange={handleVideoChange}
        onVideoPosterChange={handleVideoPosterChange}
      />

      <AdminProjectSettingsFields values={values} onUpdateValue={updateValue} />

      <AdminProjectFormMediaPreview mediaPreview={mediaPreview} title={values.title} />

      <AdminProjectFormActions
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
        onCancel={() => void handleCancel()}
      />
    </form>
  );
};

const styles = {
  form: { display: "flex", flexDirection: "column" as const, gap: spacing.lg },
  errorBox: { border: "1px solid rgba(255, 193, 7, 0.35)", borderRadius: radius.md, backgroundColor: "rgba(255, 193, 7, 0.08)", color: colors.accent.yellow, padding: spacing.md, fontSize: "13px" },
};
