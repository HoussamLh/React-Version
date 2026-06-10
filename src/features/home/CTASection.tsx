import React from "react";
import { Link } from "react-router";

export const CTASection: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.card}>
        {/* Subtle decorative wave grid overlay background simulation */}
        <div style={styles.gridOverlay} />

        <div style={styles.content}>
          <h2 style={styles.heading}>Ready to build your digital legacy?</h2>

          <p style={styles.subheading}>
            Join the elite cohort of founders who prioritize technical
            excellence and architectural integrity.
          </p>

          <div style={styles.btnGroup}>
            <button style={styles.primaryBtn}>
              <Link to="/contact" style={styles.primaryLink}>Book a Strategy Call</Link>
            </button>
            <button style={styles.secondaryBtn} className="mono-text">
              <Link to="/projects" style={styles.secondaryLink}> View Showcases</Link>
            </button>
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
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
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
      "radial-gradient(rgba(147, 181, 255, 0.45) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    opacity: 0.4,
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
    maxWidth: "680px",
  },
  heading: {
    fontSize: "44px",
    fontWeight: 900,
    letterSpacing: "-1.5px",
    color: "var(--text-main)",
    margin: "0 0 20px 0",
    lineHeight: "1.1",
  },
  subheading: {
    fontSize: "16px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    maxWidth: "580px",
  },
  btnGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: "var(--accent-green)",
    border: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(147, 181, 255, 0.15)",
    transition: "opacity 0.2s ease",
  },
  primaryLink: {
    color: "var(--bg-dark)",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "18px",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    border: "1px solid var(--accent-green)",
    boxShadow: "0 0 40px rgba(147, 181, 255, 0.25)",
    padding: "16px 32px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  secondaryLink: {
    color: "var(--text-main)",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "18px",
  },
};
