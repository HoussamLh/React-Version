import React, { useEffect } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type { Project } from "../data/projects.data";
import { getProjectVideoEmbedUrl } from "../utils";

type ProjectVideoModalProps = {
  project: Project | null;
  onClose: () => void;
};

export const ProjectVideoModal: React.FC<ProjectVideoModalProps> = ({
  project,
  onClose,
}) => {
  const embedUrl = getProjectVideoEmbedUrl(project?.videoUrl);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, project]);

  if (!project) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Project demo</p>
            <h2 style={styles.title}>{project.title}</h2>
          </div>

          <button type="button" style={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        {embedUrl ? (
          <>
            <div style={styles.videoFrameWrap}>
              <iframe
                src={embedUrl}
                title={`${project.title} video demo`}
                style={styles.videoFrame}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.watchOnPlatformLink}
              >
                Open video in new tab
              </a>
            )}
          </>
        ) : (
          <div style={styles.fallbackBox}>
            <p style={styles.fallbackText}>
              This video cannot be embedded directly.
            </p>

            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                style={styles.externalLink}
              >
                Open video
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },

  modal: {
    width: "min(980px, 100%)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    margin: `0 0 ${spacing.xs} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "30px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  closeButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontWeight: typography.fontWeight.bold,
  },

  videoFrameWrap: {
    position: "relative" as const,
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  videoFrame: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },

  fallbackBox: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.xl,
    textAlign: "center" as const,
    backgroundColor: colors.background.dark,
  },

  fallbackText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: `0 0 ${spacing.md} 0`,
  },

  externalLink: {
    color: colors.accent.green,
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },

  watchOnPlatformLink: {
    display: "inline-flex",
    marginTop: spacing.md,
    color: colors.accent.green,
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
