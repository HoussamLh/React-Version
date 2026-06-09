import React from "react";

export const TrustSection: React.FC = () => {
  return (
    <section style={styles.container}>
      {/* Section Header Grid Wrapper */}
      <div style={styles.header}>
        {/* Left Side: Header Elements */}
        <div style={styles.textWrapper}>
          <div style={styles.badge} className="mono-text">
            <span style={styles.badgeDot}>•</span> WHY CHOOSE US
          </div>
          <h2 style={styles.heading}>
            Built for scale.{" "}
            <span style={styles.accentText}>Designed for precision.</span>
          </h2>
          <p style={styles.subheading}>
            We don't just build websites, we engineer scalable infrastructures
            that serve as the backbone for your digital enterprise.
          </p>
        </div>

        {/* Right Side: Small Stat Cards */}
        <div style={styles.smallCards}>
          {/* Card 1: uptime */}
          <div style={styles.uptimeCard}>
            <span style={styles.statNumber} className="mono-text">
              99.9%
            </span>
            <h3 style={styles.statLabel} className="mono-text">
              UPTIME
            </h3>
          </div>

          {/* Card 2: shipped */}
          <div style={styles.shippedCard}>
            <span style={styles.statNumber} className="mono-text">
              50+
            </span>
            <h3 style={styles.statLabel} className="mono-text">
              SHIPPED
            </h3>
          </div>
        </div>
      </div>

      {/* Trust Grid Cards */}
      <div style={styles.grid}>
        {/* Card 1: Custom Web Apps */}
        <div style={styles.card}>
          <div
            className="mono-text"
            style={{ ...styles.iconContainer, color: "var(--accent-green)" }}
          >
            Custom Web Apps
          </div>
          <h3 style={styles.cardTitle}>Custom Web Apps</h3>
          <p style={styles.cardText}>
            Next.js and React architectures optimized for SEO and conversion.
          </p>
        </div>

        {/* Card 2: Mobile Solutions */}
        <div style={styles.card}>
          <div
            className="mono-text"
            style={{ ...styles.iconContainer, color: "var(--accent-blue)" }}
          >
            Mobile Solutions
          </div>
          <h3 style={styles.cardTitle}>Mobile Solutions</h3>
          <p style={styles.cardText}>
            Native-feel experiences built with Flutter and React Native.
          </p>
        </div>

        {/* Card 3: Backend Systems */}
        <div style={styles.card}>
          <div
            style={{ ...styles.iconContainer, color: "var(--accent-purple)" }}
            className="mono-text"
          >
            Backend Systems
          </div>
          <h3 style={styles.cardTitle}>Backend Systems</h3>
          <p style={styles.cardText}>
            Robust Node.js and Python APIs built to handle massive traffic.
          </p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "100px 0",
    borderTop: "1px solid var(--border-color)",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr", 
    gap: "48px",
    alignItems: "end", 
    marginBottom: "64px",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
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
    marginBottom: "24px",
  },
  badgeDot: {
    color: "var(--accent-green)",
    fontSize: "14px",
  },
  heading: {
    fontSize: "40px", 
    fontWeight: 800,
    letterSpacing: "-1px",
    margin: "0 0 16px 0",
    color: "var(--text-main)",
    lineHeight: "1.2",
  },
  accentText: {
    color: "var(--accent-green)",
  },
  subheading: {
    fontSize: "15px",
    color: "var(--text-muted)",
    maxWidth: "500px",
    lineHeight: "1.6",
    margin: 0,
  },
  smallCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
  },
  uptimeCard: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  shippedCard: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: 800,
    color: "var(--accent-green)",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "var(--text-muted)",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "24px",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    transition: "border-color 0.2s ease",
  },
  iconContainer: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    marginBottom: "32px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--text-main)",
    margin: "0 0 16px 0",
  },
  cardText: {
    fontSize: "15px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: 0,
  },
};
