import React from "react";
import { Button } from "../ui/Button";

export type CTASectionVariant = "default" | "accent";

export type CTASectionProps = {
  variant?: CTASectionVariant;

  titleStart: string;
  titleAccent?: string;
  titleEnd?: string;

  subtitle?: string;

  primaryLabel: string;
  primaryTo?: string;
  onPrimaryClick?: () => void;

  secondaryLabel?: string;
  secondaryTo?: string;
};

export const CTASection: React.FC<CTASectionProps> = ({
  variant = "default",
  titleStart,
  titleAccent,
  titleEnd = "",
  subtitle,
  primaryLabel,
  primaryTo,
  onPrimaryClick,
  secondaryLabel,
  secondaryTo,
}) => {
  const isAccent = variant === "accent";

  return (
    <section style={styles.container}>
      <div
        style={{
          ...styles.card,
          ...(isAccent ? styles.accentCard : styles.defaultCard),
        }}
      >
        <div
          style={{
            ...styles.overlay,
            ...(isAccent ? styles.accentOverlay : styles.defaultOverlay),
          }}
        />

        <div style={styles.content}>
          <h2
            style={{
              ...styles.title,
              ...(isAccent ? styles.accentTitle : {}),
            }}
          >
            {titleStart}
            {titleAccent && (
              <span style={styles.accentText}>{titleAccent}</span>
            )}
            {titleEnd}
          </h2>

          {subtitle && (
            <p
              style={{
                ...styles.subtitle,
                ...(isAccent ? styles.accentSubtitle : {}),
              }}
            >
              {subtitle}
            </p>
          )}

          <div style={styles.actions}>
            <Button to={primaryTo} onClick={onPrimaryClick}>
              {primaryLabel}
            </Button>

            {secondaryLabel && secondaryTo && (
              <Button variant="secondary" to={secondaryTo}>
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "80px 0 120px 0",
    backgroundColor: "var(--bg-dark)",
    borderTop: "1px solid var(--border-color)",
  },

  card: {
    borderRadius: "32px",
    padding: "80px 40px",
    position: "relative" as const,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  defaultCard: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
  },

  accentCard: {
    background: "rgba(76, 100, 70, 0.8)",
    border: "1px solid var(--accent-green)",
  },

  overlay: {
    position: "absolute" as const,
    pointerEvents: "none" as const,
  },

  defaultOverlay: {
    inset: 0,
    backgroundImage:
      "radial-gradient(rgba(147, 181, 255, 0.15) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    opacity: 0.4,
  },

  accentOverlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "radial-gradient(rgba(147, 181, 255, 0.12) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    opacity: 0.5,
    maskImage:
      "linear-gradient(to bottom, transparent, rgba(0,0,0,1) 50%, transparent)",
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent, rgba(0,0,0,1) 50%, transparent)",
  },

  content: {
    position: "relative" as const,
    zIndex: 2,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    maxWidth: "720px",
  },

  title: {
    fontSize: "40px",
    fontWeight: 900,
    letterSpacing: "-1.5px",
    color: "var(--text-main)",
    margin: "0 0 20px 0",
  },

  accentTitle: {
    lineHeight: "1.2",
  },

  accentText: {
    color: "var(--accent-green)",
  },

  subtitle: {
    fontSize: "16px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
  },

  accentSubtitle: {
    maxWidth: "600px",
  },

  actions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
    justifyContent: "center",
    alignItems: "center",
  },
};
