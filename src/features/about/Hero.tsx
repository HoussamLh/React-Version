import React, { useState } from "react";
import heroImage from '../../Assets/heroAbout.png';

export const Hero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section style={styles.container}>
      {/* Top Meta Label */}
      <div style={styles.metaLabel} className="mono-text">
        <div style={styles.badge} className="mono-text">
          <span style={styles.badgeDot}>•</span>
          ENGINEERED FOR TECHNICAL AUTHORITY
        </div>
      </div>

      {/* Main Splitted Headline */}
      <h1 style={styles.heading}>
        Architecting the Future of <br />
        <span style={styles.accentText}>Digital Commerce.</span>
      </h1>

      {/* Pitch Paragraph */}
      <p style={styles.subheading}>
        Devbysam, we engineer scalable, resilient systems that empower
        enterprise stakeholders and forward-thinking founders to lead their
        industries with confidence.
      </p>

      {/* Immersive Server Room Image Frame with Hover Matrix */}
      <div
        style={{
          ...styles.imageContainer,
          // Dynamics: change the border color of the container on hover
          borderColor: isHovered
            ? "var(--accent-green)"
            : "var(--border-color)",
        }}
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
          src={heroImage}
          alt="Data Center Server Infrastructure"
          style={{
            ...styles.image,
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "80px 0 60px 0",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  metaLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "var(--accent-green)",
    marginBottom: "20px",
  },
    badge: {
    backgroundColor: "#1c1f26",
    border: "1px solid var(--border-color)",
    color: "var(--accent-green)",
    boxShadow: "0 0 40px rgba(147, 181, 255, 0.25)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
  },
  badgeDot: {
    color: "var(--accent-green)",
    fontSize: "14px",
  },
  heading: {
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
  subheading: {
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
    transition:'border-color 0.5s ease-in-out',
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
