import React, { useRef, useState } from "react";
import { Card, colors, spacing, typography } from "../../../../design-system";
import type { Project } from "../data/projects.data";
import { getCloudinaryVideoDeliveryUrl } from "../../../../shared/utils/cloudinaryMedia.helpers";

type ProjectCardProps = {
  project: Project;
  onPlayVideo?: (project: Project) => void;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPlayVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const isVideoProject =
    project.mediaType === "video" && Boolean(project.videoUrl);

  const hasProjectLinks = Boolean(project.demoUrl || project.githubUrl);

  const videoDeliveryUrl = isVideoProject
    ? getCloudinaryVideoDeliveryUrl(project.videoUrl)
    : null;

  const handleVideoEnter = () => {
    const video = videoRef.current;

    if (!video || !videoDeliveryUrl) return;

    video.currentTime = 0;
    video.muted = true;
    setIsMuted(true);

    void video.play().catch(() => {
      // Browsers can reject autoplay in some environments.
    });
  };

  const handleVideoLeave = () => {
    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.muted = true;
    setIsMuted(true);
  };

  const handleSoundToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const video = videoRef.current;

    if (!video) return;

    const nextMuted = !video.muted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      void video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
      });
    }
  };

  const handleVideoClick = () => {
    onPlayVideo?.(project);
  };

  return (
    <Card
      interactive
      hoverAccent={project.hoverAccent}
      className="ds-card-stack"
      style={{ gridColumn: project.span }}
    >
      <div
        className="ds-card-media"
        style={{
          height: project.imageHeight,
          marginBottom: "24px",
          position: "relative",
          cursor: isVideoProject ? "pointer" : undefined,
        }}
        onMouseEnter={isVideoProject ? handleVideoEnter : undefined}
        onMouseLeave={isVideoProject ? handleVideoLeave : undefined}
        onClick={isVideoProject ? handleVideoClick : undefined}
      >
        {isVideoProject && videoDeliveryUrl ? (
          <video
            ref={videoRef}
            src={videoDeliveryUrl}
            poster={project.videoPosterUrl ?? project.image ?? undefined}
            muted={isMuted}
            playsInline
            loop
            preload="metadata"
            aria-label={`${project.title} project preview`}
            style={styles.video}
          />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="ds-card-image ds-zoom-image"
          />
        ) : (
          <div style={styles.mediaPlaceholder}>No media preview</div>
        )}

        {isVideoProject && videoDeliveryUrl && (
          <div style={styles.videoOverlay}>
            <span style={styles.videoHint}>Hover to preview</span>

            <button
              type="button"
              aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
              title={isMuted ? "Turn sound on" : "Turn sound off"}
              onClick={handleSoundToggle}
              style={styles.soundButton}
            >
              {isMuted ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={styles.soundIcon}
                >
                  <path
                    d="M11 5 6 9H3v6h3l5 4V5Zm6.5 4.5-5 5m0-5 5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={styles.soundIcon}
                >
                  <path
                    d="M11 5 6 9H3v6h3l5 4V5Zm4 3.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="ds-card-title">{project.title}</h3>

        <p className="ds-card-text">{project.text}</p>
      </div>

      <div className="ds-pill-row" style={{ marginTop: "24px" }}>
        {project.tags.map((tag) => (
          <span key={tag} className="ds-pill mono-text">
            {tag}
          </span>
        ))}
      </div>

      {hasProjectLinks && (
        <div style={styles.actionRow}>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.primaryLink}
            >
              Live Demo
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.secondaryLink}
            >
              GitHub
            </a>
          )}
        </div>
      )}
    </Card>
  );
};

const styles = {
  video: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    backgroundColor: "#000",
  },

  mediaPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    fontSize: "13px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  videoOverlay: {
    position: "absolute" as const,
    inset: 0,
    zIndex: 30,
    pointerEvents: "none" as const,
  },

  videoHint: {
    position: "absolute" as const,
    left: spacing.md,
    bottom: spacing.md,
    border: "1px solid rgba(255, 255, 255, 0.22)",
    borderRadius: "999px",
    backgroundColor: "rgba(0, 0, 0, 0.66)",
    color: colors.text.main,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    backdropFilter: "blur(10px)",
    pointerEvents: "none" as const,
  },

  soundButton: {
    position: "absolute" as const,
    right: spacing.md,
    top: spacing.md,
    zIndex: 31,
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    color: "#fff",
    cursor: "pointer",
    padding: 0,
    margin: 0,
    opacity: 1,
    visibility: "visible" as const,
    pointerEvents: "auto" as const,
    appearance: "none" as const,
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
  },

  soundIcon: {
    width: "20px",
    height: "20px",
    display: "block",
    flexShrink: 0,
  },

  actionRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTop: `1px solid ${colors.border.default}`,
  },

  primaryLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "9px 14px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },

  secondaryLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${colors.border.default}`,
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: "9px 14px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
