import React from "react";
import heroImg from '../assets/heroImg.png';

export const Hero: React.FC = () => {
  return (
    <section style={styles.heroContainer}>
      {/* Left Column: Copy & CTA */}
      <div style={styles.leftCol}>
        <div style={styles.badge} className="mono-text">
          <span style={styles.badgeDot}>•</span> NEXT-GEN ARCHITECTURE
        </div>

        <h1 style={styles.heading}>
          Engineering the <span style={styles.accentText}>Future</span> of Web &
          Mobile
        </h1>

        <p style={styles.subheading}>
          We build robust, high-performance digital products for tech-forward
          founders. Precision-engineered code meets{" "}
          <span style={styles.accentText}>modern</span> corporate minimalism.
        </p>

        <div style={styles.ctaGroup}>
          <button style={styles.primaryBtn}>
            View Pricing <span style={{ marginLeft: "8px" }}>→</span>
          </button>
          <button style={styles.secondaryBtn} className="mono-text">
            Contact Us
          </button>
        </div>
      </div>

      {/* Right Column: Visual Terminal Display Hero Image */}
      <div style={styles.rightCol}>
        <div style={styles.mockupContainer}>
          {/* Container holding Hero Image */}
          <div style={styles.imageWindow}>
            <img
              src={heroImg}
              alt="Devbysam Hero Image"
              style={styles.imageRender}
            />
          </div>
          </div>
          {/* Floating Terminal Code Card */}
          <div style={styles.terminalCard}>
            <div style={styles.terminalHeader}>
              <span style={{ ...styles.dot, backgroundColor: "#ff5f56" }} />
              <span style={{ ...styles.dot, backgroundColor: "#ffbd2e" }} />
              <span style={{ ...styles.dot, backgroundColor: "#27c93f" }} />
            </div>
            <div style={styles.terminalBody} className="mono-text">
              <span style={{ color: "#8a8f98" }}>const</span>{" "}
              <span style={{ color: "var(--accent-green)" }}>future</span> ={" "}
              <span style={{ color: "#8a8f98" }}>await</span>{" "}
              <span style={{ color: "#fff" }}>engineering</span>.
              <span style={{ color: "var(--accent-green)" }}>deploy</span>();
              <div style={styles.terminalStatus}>Status: Optimized</div>
            </div>
          </div>
        </div>
    </section>
  );
};

const styles = {
  heroContainer: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "40px",
    alignItems: "center",
    padding: "80px 0",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  badge: {
    backgroundColor: "#1c1f26",
    border: "1px solid var(--border-color)",
    color: "var(--accent-green)",
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
    fontSize: "64px",
    fontWeight: 900,
    lineHeight: "1.1",
    letterSpacing: "-1.5px",
    margin: "0 0 24px 0",
    color: "var(--text-main)",
  },
  accentText: {
    color: "var(--accent-green)",
    textShadow: "0 0 40px rgba(147, 181, 255, 0.25)",
  },
  subheading: {
    fontSize: "18px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    maxWidth: "520px",
  },
  ctaGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  primaryBtn: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--accent-green)",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  rightCol: {
    display: "flex",
    justifyContent: "center",
    position: "relative" as const,
  },
  mockupContainer: {
    position: "relative" as const,
    width: "100%",
    maxWidth: "500px",
  },
  imageWindow: {
    width: "100%",
    height: "450px",
    backgroundColor: "#131518",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
    overflow: "hidden",
  },
  imageRender: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  terminalCard: {
    position: "absolute" as const,
    bottom: "-20px",
    left: "-30px",
    backgroundColor: "#181a1e",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "16px 20px",
    width: "85%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  },
  terminalHeader: {
    display: "flex",
    gap: "6px",
    marginBottom: "14px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  terminalBody: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#e1e4ea",
  },
  terminalStatus: {
    marginTop: "8px",
    color: "var(--accent-green)",
    fontSize: "12px",
  },
};
