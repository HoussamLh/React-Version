import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import { CloudinaryImageUpload } from "../../../../shared/components/media/CloudinaryImageUpload";
import { CloudinaryVideoUpload } from "../../../../shared/components/media/CloudinaryVideoUpload";
import type { AdminProjectFormValues, ProjectMediaType } from "../types/projectsCms.types";

type AdminProjectMediaFieldsProps = {
  values: AdminProjectFormValues;
  imageFolder: string;
  videoFolder: string;
  onMediaTypeChange: (value: ProjectMediaType) => void;
  onImageChange: (value: { secureUrl: string | null; publicId: string | null }) => void;
  onVideoChange: (value: { secureUrl: string | null; publicId: string | null }) => void;
  onVideoPosterChange: (value: { secureUrl: string | null; publicId: string | null }) => void;
};

const mediaTypeOptions: ProjectMediaType[] = ["image", "video"];

export const AdminProjectMediaFields: React.FC<AdminProjectMediaFieldsProps> = ({
  values,
  imageFolder,
  videoFolder,
  onMediaTypeChange,
  onImageChange,
  onVideoChange,
  onVideoPosterChange,
}) => {
  return (
    <div style={styles.wrapper}>
      <label style={styles.field}>
        <span style={styles.label}>Media type</span>
        <select
          value={values.mediaType}
          onChange={(event) => onMediaTypeChange(event.target.value as ProjectMediaType)}
          style={styles.input}
        >
          {mediaTypeOptions.map((mediaType) => (
            <option key={mediaType} value={mediaType}>{mediaType}</option>
          ))}
        </select>
      </label>

      {values.mediaType === "image" ? (
        <div style={styles.mediaPanel}>
          <CloudinaryImageUpload
            value={values.imageUrl}
            publicId={values.imagePublicId}
            folder={imageFolder}
            label="Project image"
            onChange={onImageChange}
          />
        </div>
      ) : (
        <div style={styles.videoMediaStack}>
          <div style={styles.mediaPanel}>
            <CloudinaryVideoUpload
              value={values.videoUrl}
              publicId={values.videoPublicId}
              folder={videoFolder}
              label="Project video"
              onChange={onVideoChange}
            />
            <p style={styles.requiredNote}>Required when media type is video.</p>
          </div>

          <div style={styles.optionalMediaPanel}>
            <CloudinaryImageUpload
              value={values.videoPosterUrl}
              publicId={values.videoPosterPublicId}
              folder={imageFolder}
              label="Video poster image (optional)"
              onChange={onVideoPosterChange}
            />
            <p style={styles.optionalNote}>
              Optional thumbnail shown before the video starts playing.
            </p>
          </div>
        </div>
      )}

      <div style={styles.note}>
        {values.mediaType === "image"
          ? "Project images are stored in Cloudinary under the project's images folder."
          : "Project videos are stored under videos, while the optional poster image is stored under images."}
      </div>

      {values.mediaType === "video" && values.imageUrl && !values.videoPosterUrl && (
        <div style={styles.legacyNote}>
          This project has an existing image URL that is retained as a legacy video preview fallback.
        </div>
      )}

      {values.mediaType === "video" && values.videoUrl && (
        <label style={styles.field}>
          <span style={styles.label}>Video URL</span>
          <input value={values.videoUrl} readOnly style={styles.readonlyInput} />
        </label>
      )}

      {values.mediaType === "image" && values.imageUrl && (
        <label style={styles.field}>
          <span style={styles.label}>Image delivery URL</span>
          <input value={values.imageUrl} readOnly style={styles.readonlyInput} />
        </label>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", flexDirection: "column", gap: spacing.md },
  field: { display: "flex", flexDirection: "column", gap: spacing.sm },
  label: { color: colors.text.muted, fontSize: "12px", fontWeight: typography.fontWeight.bold },
  input: { width: "100%", border: `1px solid ${colors.border.default}`, borderRadius: radius.md, backgroundColor: colors.background.dark, color: colors.text.main, padding: `${spacing.sm} ${spacing.md}`, outline: "none", fontSize: "14px", boxSizing: "border-box" },
  videoMediaStack: { display: "flex", flexDirection: "column" as const, gap: spacing.md },
  mediaPanel: { border: `1px solid ${colors.border.default}`, borderRadius: radius.lg, padding: spacing.md, backgroundColor: "rgba(255, 255, 255, 0.02)" },
  optionalMediaPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  requiredNote: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "17px",
    margin: `${spacing.sm} 0 0 0`,
  },
  optionalNote: {
    color: colors.text.muted,
    fontSize: "11px",
    lineHeight: "17px",
    margin: `${spacing.sm} 0 0 0`,
  },
  note: { color: colors.text.muted, fontSize: "11px", lineHeight: "17px" },
  legacyNote: { color: colors.accent.yellow, fontSize: "11px", lineHeight: "17px" },
  readonlyInput: { width: "100%", border: `1px solid ${colors.border.default}`, borderRadius: radius.md, backgroundColor: "rgba(255, 255, 255, 0.02)", color: colors.text.muted, padding: `${spacing.sm} ${spacing.md}`, fontSize: "12px", boxSizing: "border-box" },
};
