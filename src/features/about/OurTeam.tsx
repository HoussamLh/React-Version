import React from "react";
import samLala from "../../Assets/samLImg.png";
import ShannonRImg from "../../Assets/ShannonRImg.png";
import JackHImg from "../../Assets/JackHImg.png";
import RogerCImg from "../../Assets/RogerCImg.png";

export const OurTeam: React.FC = () => {
  return (
    <section style={styles.container}>
      {/* Top Meta Label */}
      <div style={styles.metaLabel} className="mono-text">
        <div style={styles.badge} className="mono-text">
          <span style={styles.badgeDot}>•</span>
          Technical Specialists
        </div>
      </div>

      {/* Main Splitted Headline */}
      <h2 style={styles.heading}>
        Our Experienced
        <span style={styles.accentText}> Team.</span>
      </h2>
      <div style={styles.headerRow}>
        <p style={styles.sectionSubtitle}>
          Our team consists of veteran architects and domain specialists who
          thrive on solving the hardest problems in software engineering.
        </p>
        <button style={styles.joinBtn} className="mono-text">
          Join Us
        </button>
      </div>

      {/* Grid Layout Layout Matrix */}
      <div style={styles.grid} className="team-grid">
        {/* Card 1: Sam Lala Card*/}
        {/* ROW 1 - LEFT CARD: Takes 1 Grid Sizes */}
        <div style={styles.card} className="team-card">
          {/* Sam L Image */}
          <div style={styles.graphicSide} className="team-image-wrapper">
            <div style={styles.imageOverlay}></div>
            <img
              src={samLala}
              alt="Sam L Image"
              style={styles.graphicImage}
              className="team-image"
            />
          </div>
          <div style={styles.nameRow}>
            <span style={styles.nameText}>Sam L</span>
          </div>
          <h3 style={styles.cardTitle}>CHIEF ARCHITECT</h3>
          <p style={styles.cardText}>
            15+ years in full-stack engineering and distributed systems.
          </p>
        </div>

        {/* Card 3: Shannon R Card*/}
        {/* ROW 1 - RIGHT CARD: Take 1 Grid Size */}
        <div style={styles.card} className="team-card">
          {/* Shannon R Image */}
          <div style={styles.graphicSide} className="team-image-wrapper">
            <div style={styles.imageOverlay}></div>
            <img
              src={ShannonRImg}
              alt="Shannon R Image"
              style={styles.graphicImage}
              className="team-image"
            />
          </div>
          <div style={styles.splitTextSide}>
            <div style={styles.nameRow}>
              <span style={styles.nameText}>Shannon R</span>
            </div>
            <h3 style={styles.cardTitle}>PRODUCT LEAD</h3>
            <p style={styles.cardText}>
              Expert in user-centric design and scalable frontend patterns.
            </p>
          </div>
        </div>

        {/* Card 3: Jack H Card*/}
        {/* ROW 2 - LEFT CARD: Takes 1 Grid Size */}
        <div style={styles.card} className="team-card">
          {/* Jack H Image */}
          <div style={styles.graphicSide} className="team-image-wrapper">
            <div style={styles.imageOverlay}></div>
            <img
              src={JackHImg}
              alt="Jack H Image"
              style={styles.graphicImage}
              className="team-image"
            />
          </div>
          <div style={styles.splitTextSide}>
            <div style={styles.nameRow}>
              <span style={styles.nameText}>Jack H</span>
            </div>
            <h3 style={styles.cardTitle}>DEVOPS HEAD</h3>
            <p style={styles.cardText}>
              Specialist in Kubernetes orchestration and security hardening.
            </p>
          </div>
        </div>

        {/* Card 4: Roger C image */}
        {/* ROW 2 - RIGHT CARD: Takes 1 Grid Sizes */}
        <div style={styles.card} className="team-card">
          {/* Roger C Image */}
          <div style={styles.graphicSide} className="team-image-wrapper">
            <div style={styles.imageOverlay}></div>
            <img
              src={RogerCImg}
              alt="Roger C Image"
              style={styles.graphicImage}
              className="team-image"
            />
          </div>
          <div style={styles.splitTextSide}>
            <div style={styles.nameRow}>
              <span style={styles.nameText}>Roger C</span>
            </div>
            <h3 style={styles.cardTitle}>MOBILE LEAD</h3>
            <p style={styles.cardText}>
              Pushing the boundaries of native performance in cross-platform
              apps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "20px 0 20px 0",
    backgroundColor: "var(--bg-dark)",
    borderTop: "1px solid var(--border-color)",
  },
  metaLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "var(--accent-green)",
    marginBottom: "20px",
    display: "flex",
  },
  badge: {
    display: "inline-flex",
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
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    width: "100%",
  },
  joinBtn: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
  },
  sectionSubtitle: {
    fontSize: "18px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    maxWidth: "520px",
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
  grid:{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "28px",
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
  imageOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.3), rgba(0,0,0,0))",
    zIndex: 1,
  },
  graphicSide: {
    position: "relative" as const,
    width: "100%",
    height: "280px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border-color)",
    marginBottom: "24px",
  },
  graphicImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    objectPosition: "center top",
    transition: "transform 0.5s ease",
  },
  nameRow: {
    marginBottom: "5px",
  },
  nameText: {
    fontSize: "26px",
    fontWeight: 900,
    color: "var(--text-main)",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 300,
    color: "var(--accent-green)",
    margin: "0 0 10px 0",
  },
  cardText: {
    fontSize: "15px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 10px 0",
  },
};
