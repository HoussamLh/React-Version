import React from "react";
import {
  Archive,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Presentation,
  ExternalLink,
} from "lucide-react";
import { colors, radius, spacing } from "../../../design-system";
import type { ProjectMessageMedia } from "../../types/projectMessageMedia.types";

type Props = {
  media: ProjectMessageMedia[];
};

type FileDisplayInfo = {
  label: string;
  icon: React.ElementType;
  action: "Open" | "Download";
};

const getFileDisplayInfo = (item: ProjectMessageMedia): FileDisplayInfo => {
  const filename = item.originalFilename.toLowerCase();
  const mimeType = item.mimeType?.toLowerCase() ?? "";

  if (mimeType === "application/pdf" || filename.endsWith(".pdf")) {
    return {
      label: "PDF",
      icon: FileText,
      action: "Open",
    };
  }

  if (
    mimeType.includes("word") ||
    filename.endsWith(".doc") ||
    filename.endsWith(".docx")
  ) {
    return {
      label: filename.endsWith(".doc") ? "DOC" : "DOCX",
      icon: FileText,
      action: "Download",
    };
  }

  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    filename.endsWith(".xls") ||
    filename.endsWith(".xlsx") ||
    filename.endsWith(".csv")
  ) {
    return {
      label: filename.endsWith(".csv")
        ? "CSV"
        : filename.endsWith(".xls")
          ? "XLS"
          : "XLSX",
      icon: FileSpreadsheet,
      action: "Download",
    };
  }

  if (
    mimeType.includes("presentation") ||
    filename.endsWith(".ppt") ||
    filename.endsWith(".pptx")
  ) {
    return {
      label: filename.endsWith(".ppt") ? "PPT" : "PPTX",
      icon: Presentation,
      action: "Download",
    };
  }

  if (mimeType === "text/plain" || filename.endsWith(".txt")) {
    return {
      label: "TXT",
      icon: FileText,
      action: "Open",
    };
  }

  if (
    filename.endsWith(".zip") ||
    filename.endsWith(".rar") ||
    filename.endsWith(".7z") ||
    filename.endsWith(".tar") ||
    filename.endsWith(".gz")
  ) {
    const extension = filename.split(".").pop()?.toUpperCase() ?? "ARCHIVE";

    return {
      label: extension,
      icon: Archive,
      action: "Download",
    };
  }

  const extension = filename.includes(".")
    ? filename.split(".").pop()?.toUpperCase()
    : undefined;

  return {
    label: extension || "FILE",
    icon: File,
    action: "Download",
  };
};

const formatFileSize = (fileSize: number | null): string | null => {
  if (fileSize === null || fileSize < 0) return null;

  if (fileSize < 1024) {
    return `${fileSize} B`;
  }

  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  }

  if (fileSize < 1024 * 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(fileSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const ProjectMessageMediaList: React.FC<Props> = ({ media }) => {
  if (media.length === 0) return null;

  return (
    <div style={styles.list}>
      {media.map((item) => {
        if (item.mediaType === "image") {
          return (
            <a
              key={item.id}
              href={item.secureUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.imageLink}
              aria-label={`Open ${item.originalFilename}`}
            >
              <img
                src={item.secureUrl}
                alt={item.originalFilename}
                loading="lazy"
                style={styles.image}
              />
            </a>
          );
        }

        const fileInfo = getFileDisplayInfo(item);
        const Icon = fileInfo.icon;
        const fileSize = formatFileSize(item.fileSize);

        return (
          <a
            key={item.id}
            href={item.secureUrl}
            target="_blank"
            rel="noreferrer"
            download={
              fileInfo.action === "Download" ? item.originalFilename : undefined
            }
            style={styles.file}
            aria-label={`${fileInfo.action} ${item.originalFilename}`}
          >
            <div style={styles.fileInfo}>
              <div style={styles.fileIcon}>
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <div style={styles.fileDetails}>
                <span style={styles.fileName}>{item.originalFilename}</span>

                <span style={styles.fileMeta}>
                  {fileInfo.label}
                  {fileSize ? ` • ${fileSize}` : ""}
                </span>
              </div>
            </div>

            <span style={styles.fileAction}>
              {fileInfo.action === "Open" ? (
                <ExternalLink size={15} strokeWidth={2} />
              ) : (
                <Download size={15} strokeWidth={2} />
              )}

              {fileInfo.action}
            </span>
          </a>
        );
      })}
    </div>
  );
};

const styles = {
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  imageLink: {
    display: "block",
    maxWidth: "360px",
    borderRadius: radius.md,
    overflow: "hidden",
    border: `1px solid ${colors.border.default}`,
  },

  image: {
    display: "block",
    width: "100%",
    maxHeight: "280px",
    objectFit: "cover" as const,
  },

  file: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    width: "100%",
    maxWidth: "520px",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: "10px 12px",
    color: colors.text.main,
    textDecoration: "none",
    boxSizing: "border-box" as const,
  },

  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },

  fileIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "36px",
    height: "36px",
    borderRadius: radius.sm,
    backgroundColor: colors.background.card,
    color: colors.accent.green,
  },

  fileDetails: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "3px",
    minWidth: 0,
  },

  fileName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    fontSize: "14px",
    fontWeight: 600,
  },

  fileMeta: {
    fontSize: "12px",
    color: colors.text.muted,
  },

  fileAction: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexShrink: 0,
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: 700,
  },
};
