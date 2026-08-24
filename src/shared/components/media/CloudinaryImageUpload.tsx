import React, { useRef, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { uploadAdminImageToCloudinary } from "../../services/cloudinaryUpload.service";

type CloudinaryImageUploadProps = {
  value: string | null;
  publicId: string | null;
  folder: string;
  label?: string;
  disabled?: boolean;
  onChange: (value: { secureUrl: string; publicId: string } | { secureUrl: null; publicId: null }) => void;
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  value,
  publicId,
  folder,
  label = "Image",
  disabled = false,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAdminImageToCloudinary({
        file,
        folder,
        fileBaseName: file.name.replace(/\.[^/.]+$/, ""),
      });

      onChange({
        secureUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload image.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange({ secureUrl: null, publicId: null });
  };

  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>{label}</span>

      {value && (
        <div style={styles.previewBox}>
          <img src={value} alt="Uploaded preview" style={styles.preview} />
        </div>
      )}

      <div style={styles.actions}>
        <button
          type="button"
          style={{
            ...styles.button,
            ...(isUploading || disabled ? styles.disabled : {}),
          }}
          disabled={isUploading || disabled}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
        </button>

        {value && (
          <button
            type="button"
            style={styles.clearButton}
            disabled={isUploading || disabled}
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={styles.hiddenInput}
        onChange={(event) => void handleFileChange(event)}
      />

      <span style={styles.helper}>
        Images are uploaded to Cloudinary and the delivery URL is saved with the
        service.
      </span>

      {publicId && <span style={styles.assetInfo}>Cloudinary asset linked.</span>}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  },

  label: {
    color: colors.text.muted,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  previewBox: {
    width: "100%",
    maxWidth: "360px",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    overflow: "hidden",
  },

  preview: {
    display: "block",
    width: "100%",
    maxHeight: "220px",
    objectFit: "cover",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },

  button: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  clearButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  disabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  hiddenInput: {
    display: "none",
  },

  helper: {
    color: colors.text.muted,
    fontSize: "11px",
    lineHeight: "17px",
  },

  assetInfo: {
    color: colors.text.muted,
    fontSize: "11px",
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
  },
};
