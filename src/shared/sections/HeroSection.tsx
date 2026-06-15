import React, { useState } from "react";
import { Label } from "../ui/Label";

export type HeroSectionProps = {
  badgeText: string;
  titleStart: string;
  titleAccent?: string;
  subtitle: string;

  headingAs?: "h1" | "h2";

  containerStyle?: React.CSSProperties;

  image?: string;
  imageAlt?: string;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  badgeText,
  titleStart,
  titleAccent,
  subtitle,
  headingAs = "h1",
  containerStyle,
  image,
  imageAlt = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const HeadingTag = headingAs;

  return (
    <section style={{ ...styles.container, ...containerStyle }}>
      <Label text={badgeText} />

      <HeadingTag style={styles.title}>
        {titleStart}
        {titleAccent && (
          <>
            <br />
            <span style={styles.accentText}>{titleAccent}</span>
          </>
        )}
      </HeadingTag>

      <p style={styles.subtitle}>{subtitle}</p>

      {image && (
        <div
          style={{
            ...styles.imageContainer,
            borderColor: isHovered
              ? "var(--accent-green)"
              : "var(--border-color)",
          }}
          className="team-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            style={{
              ...styles.imageOverlay,
              backgroundColor: isHovered
                ? "rgba(13, 15, 18, 0.4)"
                : "rgba(13, 15, 18, 0.5)",
              borderColor: "var(--accent-green)",
            }}
          />

          <img
            src={image}
            alt={imageAlt}
            style={{
              ...styles.image,
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>
      )}
    </section>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  title: {
    fontSize: "56px",
    fontWeight: 800,
    letterSpacing: "-1.5px",
    color: "var(--text-main)",
    lineHeight: "1.15",
    margin: "0 0 24px 0",
  },

  accentText: {
    color: "var(--accent-green)",
  },

  subtitle: {
    fontSize: "16px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    maxWidth: "640px",
    margin: "0 0 60px 0",
  },

  imageContainer: {
    position: "relative" as const,
    width: "100%",
    height: "420px",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    transition: "border-color 0.5s ease-in-out",
  },

  imageOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to bottom, transparent 40%, rgba(13, 15, 18, 0.7))",
    zIndex: 2,
    transition: "background-color 0.4s ease-in-out",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    filter: "brightness(0.7) grayscale(0.1)",
    transition:
      "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease",
    zIndex: 1,
  },
};
