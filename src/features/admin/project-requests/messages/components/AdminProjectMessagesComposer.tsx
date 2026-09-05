import React from "react";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../../design-system";
import { ProjectMessageAttachmentPicker } from "../../../../../shared/components/media/ProjectMessageAttachmentPicker";

type Props = {
  value: string;
  images: File[];
  files: File[];
  isSending: boolean;
  onChange: (value: string) => void;
  onImagesChange: React.Dispatch<React.SetStateAction<File[]>>;
  onFilesChange: React.Dispatch<React.SetStateAction<File[]>>;
  onError: (message: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const AdminProjectMessagesComposer: React.FC<Props> = ({
  value,
  images,
  files,
  isSending,
  onChange,
  onImagesChange,
  onFilesChange,
  onError,
  onSubmit,
}) => (
  <form style={styles.form} onSubmit={onSubmit}>
    <textarea
      style={styles.input}
      value={value}
      placeholder="Reply to customer..."
      onChange={(event) => onChange(event.target.value)}
      disabled={isSending}
    />

    <ProjectMessageAttachmentPicker
      images={images}
      files={files}
      onImagesChange={onImagesChange}
      onFilesChange={onFilesChange}
      onError={onError}
      disabled={isSending}
    />

    <button
      type="submit"
      style={{
        ...styles.button,
        ...(isSending ? styles.disabled : {}),
      }}
      disabled={isSending}
    >
      {isSending ? "Sending..." : "Send Reply"}
    </button>
  </form>
);

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  input: {
    minHeight: "100px",
    resize: "vertical" as const,
    padding: spacing.md,
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
  },
  button: {
    alignSelf: "flex-end" as const,
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "12px 20px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};
