
export const Hero: React.FC = () => {

  return (
    <section style={styles.container}>
      {/* Top Meta Label */}
      <div style={styles.metaLabel} className="mono-text">
        <div style={styles.badge} className="mono-text">
          <span style={styles.badgeDot}>•</span>
          TECHNICAL EXPERTISE
        </div>
      </div>

      {/* Main Splitted Headline */}
      <h1 style={styles.heading}>
        Engineering Excellence. <br />
        <span style={styles.accentText}>Built to Scale.</span>
      </h1>

      {/* Pitch Paragraph */}
      <p style={styles.subheading}>
        High-performance web, mobile, and cloud solutions designed for ambitious
        businesses.
      </p>
    </section>
  );
};

const styles = {
  container: {
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
    marginBottom: "24px",
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
};
