import React from "react";
import { Link } from "react-router-dom";

export const CTASection: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.card}>
        {/* Subtle mesh dot grid matrix effect */}
        <div style={styles.gridOverlay} />

        <div style={styles.content}>
          <h2 style={styles.heading}>
            Ready to Scale Your <span style={styles.accentText}> Business.</span>?
          </h2>

          <p style={styles.subheading}>
            Let’s discuss your project, technical challenges, and growth goals.
          </p>

          <div style={styles.btnGroup}>
            <button style={styles.primaryBtn}>Book a Consultation</button>
            <Link to="/pricing" style={styles.secondaryBtn}>
              View Pricing
            </Link>
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
    background: "rgba(76, 100, 70, 0.8)",
    border: "1px solid var(--accent-green)",
    borderRadius: "32px",
    padding: "80px 40px",
    position: "relative" as const,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gridOverlay: {
    position: "absolute" as const,
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
    pointerEvents: "none" as const,
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
  heading: {
    fontSize: "40px",
    fontWeight: 900,
    letterSpacing: "-1.5px",
    color: "var(--text-main)",
    margin: "0 0 20px 0",
    lineHeight: "1.2",
  },
  subheading: {
    fontSize: "16px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    maxWidth: "600px",
  },
  btnGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
    justifyContent: "center",
    alignItems: "center",
  },
  accentText: {
    color: "var(--accent-green)",
  },
  primaryBtn: {
    backgroundColor: "var(--accent-green)",
    color: "#0d0f12",
    border: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(147, 181, 255, 0.15)",
    transition: "opacity 0.2s ease",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--accent-green)",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "15px",
    textDecoration: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    transition: "all 0.2s ease",
  },
};
