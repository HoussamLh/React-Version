import React from "react";
import coreAbout from '../../Assets/coreAbout.png';

export const CoreDomains: React.FC = () => {
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
      <h2 style={styles.heading}>
        Core Technical <span style={styles.accentText}>Domains.</span>
      </h2>

      {/* Grid Layout Layout Matrix */}
      <div style={styles.grid}>
        {/* Card 1: Complex Web Applications (Wider card) */}
        {/* ROW 1 - LEFT CARD: Takes 2 Grid Sizes */}
        <div style={{ ...styles.card, gridColumn: "span 2" }} className="group">
          <div style={styles.iconRow}>
            <span style={styles.icon}>💻</span>
          </div>
          <h3 style={styles.cardTitle}>Complex Web Applications</h3>
          <p style={styles.cardText}>
            From high-frequency trading dashboards to enterprise-grade CMS
            platforms, we build React and Next.js applications that prioritize
            speed, security, and developer experience.
          </p>
          {/* Tech Stack Tech Pills */}
          <div style={styles.pillContainer} className="mono-text">
            <span style={styles.pill}>REACT</span>
            <span style={styles.pill}>TYPESCRIPT</span>
            <span style={styles.pill}>NEXT.JS</span>
            <span style={styles.pill}>GRAPHQL</span>
          </div>
        </div>

        {/* Card 2: Native & Cross-Platform */}
        {/* ROW 1 - RIGHT CARD: Takes the rest (1 Grid Size) */}
        <div style={{ ...styles.card, gridColumn: "span 1" }} className="group">
          <div style={styles.iconRow}>
            <span style={styles.icon}>📱</span>
          </div>
          <h3 style={styles.cardTitle}>Native & Cross-Platform</h3>
          <p style={styles.cardText}>
            Exceptional mobile experiences delivered via Flutter and React
            Native. Zero-compromise performance and high-fidelity animations.
          </p>
          <div style={styles.pillContainer} className="mono-text">
            <span style={styles.pill}>FLUTTER</span>
            <span style={styles.pill}>IOS</span>
          </div>
        </div>

        {/* Card 3: Backend Systems */}
        {/* ROW 2 - LEFT CARD: Takes 1 Grid Size */}
        <div style={{ ...styles.card, gridColumn: "span 1" }} className="group">
          <div style={styles.iconRow}>
            <span style={styles.icon}>⚙️</span>
          </div>
          <h3 style={styles.cardTitle}>Backend Systems</h3>
          <p style={styles.cardText}>
            Robust Microservices and Cloud Infrastructure. We specialize in
            AWS/GCP orchestration for 99.9% uptime.
          </p>
        </div>

        {/* Card 4: Legacy Modernization (Split containing inner image layout) */}
        {/* ROW 2 - RIGHT CARD: Takes the rest (2 Grid Sizes) */}
        <div
          style={{ ...styles.card, ...styles.splitCard, gridColumn: "span 2" }}
          className="group"
        >
          <div style={styles.splitTextSide}>
            <div style={styles.iconRow}>
              <span style={styles.icon}>🔄</span>
            </div>
            <h3 style={styles.cardTitle}>Legacy Modernization</h3>
            <p style={styles.cardText}>
              We breathe new life into legacy systems, refactoring technical
              debt into competitive advantage without interrupting your business
              operations.
            </p>
          </div>
          {/* Inner Card Chip/Hardware Graphic preview element */}
          <div style={styles.graphicSide}>
            <img
              src={coreAbout}
              alt="Processor Hardware Microchip Graphic"
              style={styles.graphicImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "60px 0 80px 0",
    backgroundColor: "var(--bg-dark)",
  },
  metaLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "var(--accent-green)",
    marginBottom: "20px",
    display:'flex',
  },
  badge: {
    display:'inline-flex',
    backgroundColor: "#1c1f26",
    border: "1px solid var(--border-color)",
    color: "var(--accent-green)",
    boxShadow: "0 0 40px rgba(147, 181, 255, 0.25)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "24px",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "40px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    transition: "border-color 0.4s ease",
  },
  splitCard: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "32px",
    alignItems: "center",
  },
  splitTextSide: {
    flex: 1.2,
  },
  graphicSide: {
    flex: 0.8,
    height: "100%",
    minHeight: "160px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border-color)",
  },
  graphicImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    opacity: 0.7,
  },
  iconRow: {
    marginBottom: "28px",
  },
  icon: {
    fontSize: "20px",
    color: "var(--accent-blue)",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 14px 0",
  },
  cardText: {
    fontSize: "15px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  pillContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginTop: "auto",
  },
  pill: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--text-muted)",
    border: "1px solid var(--border-color)",
    padding: "4px 12px",
    borderRadius: "12px",
    letterSpacing: "0.5px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
};
