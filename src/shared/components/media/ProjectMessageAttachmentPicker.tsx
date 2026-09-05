import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

export type ProjectMessageAttachmentPickerProps = {
  images: File[];
  files: File[];
  onImagesChange: React.Dispatch<React.SetStateAction<File[]>>;
  onFilesChange: React.Dispatch<React.SetStateAction<File[]>>;
  onError?: (message: string) => void;
  disabled?: boolean;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ProjectMessageAttachmentPicker: React.FC<
  ProjectMessageAttachmentPickerProps
> = ({
  images,
  files,
  onImagesChange,
  onFilesChange,
  onError,
  disabled = false,
}) => {
  
  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);

    const invalidType = selected.find(
      (file) => !file.type.startsWith("image/"),
    );

    if (invalidType) {
      onError?.("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);

    if (oversized) {
      onError?.(
        `Image is too large. ${formatFileSize(oversized.size)} selected. Maximum allowed is 10 MB.`,
      );
      event.target.value = "";
      return;
    }

    onError?.("");
    onImagesChange((current) => [...current, ...selected]);
    event.target.value = "";
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);

    if (oversized) {
      onError?.(
        `File is too large. ${formatFileSize(oversized.size)} selected. Maximum allowed is 10 MB.`,
      );
      event.target.value = "";
      return;
    }

    onError?.("");
    onFilesChange((current) => [...current, ...selected]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const removeFile = (index: number) => {
    onFilesChange((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.actions}>
        <label
          style={{ ...styles.button, ...(disabled ? styles.disabled : {}) }}
        >
          Add image
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled}
            onChange={handleImages}
            style={styles.hiddenInput}
          />
        </label>

        <label
          style={{ ...styles.button, ...(disabled ? styles.disabled : {}) }}
        >
          Add file
          <input
            type="file"
            multiple
            disabled={disabled}
            onChange={handleFiles}
            style={styles.hiddenInput}
          />
        </label>

        <span style={styles.help}>Images up to 10 MB · Files up to 10 MB</span>
      </div>

      {(images.length > 0 || files.length > 0) && (
        <div style={styles.list}>
          {images.map((file, index) => (
            <AttachmentRow
              key={`image-${file.name}-${index}`}
              file={file}
              onRemove={() => removeImage(index)}
            />
          ))}

          {files.map((file, index) => (
            <AttachmentRow
              key={`file-${file.name}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AttachmentRow: React.FC<{ file: File; onRemove: () => void }> = ({
  file,
  onRemove,
}) => (
  <div style={styles.row}>
    <span style={styles.filename}>{file.name}</span>
    <span style={styles.size}>{formatFileSize(file.size)}</span>
    <button
      type="button"
      style={styles.remove}
      onClick={onRemove}
      aria-label={`Remove ${file.name}`}
    >
      Remove
    </button>
  </div>
);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
  },
  button: {
    position: "relative" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: "9px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
  hiddenInput: {
    position: "absolute" as const,
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  },
  help: {
    color: colors.text.muted,
    fontSize: "11px",
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: "8px 10px",
  },
  filename: {
    color: colors.text.main,
    fontSize: "12px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    flex: 1,
  },
  size: { color: colors.text.muted, fontSize: "11px" },
  remove: {
    border: "none",
    background: "transparent",
    color: colors.text.muted,
    cursor: "pointer",
    fontSize: "11px",
  },
};
