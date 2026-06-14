import React from "react";

export const WorkflowSection: React.FC = () => {

  return (
    <section style={styles.container}>
      {/* Section Headers */}
      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>
          Our Technical
          <span style={styles.accentText}> Workflow. </span>
        </h2>
        <p style={styles.sectionSubtitle}>
          A structured engineering process that ensures predictable, scalable
          results.
        </p>
      </div>
      <div style={styles.grid} className="workflow-grid">
        <div style={styles.stepCard} className="workflow-step">
          <span style={styles.circleNumber} className="build-process">
            01
          </span>
          <h3 style={styles.stepTitle}>Discovery</h3>
          <p style={styles.stepDesc}>
            Understanding requirements and constraints.
          </p>
        </div>

        <div style={styles.stepCard} className="workflow-step">
          <span style={styles.circleNumber} className="build-process">
            02
          </span>
          <h3 style={styles.stepTitle}>Architecture</h3>
          <p style={styles.stepDesc}>Designing scalable system architecture.</p>
        </div>

        <div style={styles.stepCard} className="workflow-step">
          <span style={styles.circleNumber} className="build-process">
            03
          </span>
          <h3 style={styles.stepTitle}>Development</h3>
          <p style={styles.stepDesc}>
            Agile implementation with CI/CD pipelines.
          </p>
        </div>

        <div style={styles.stepCard} className="workflow-step">
          <span style={styles.circleNumber} className="build-process">
            04
          </span>
          <h3 style={styles.stepTitle}>Deployment</h3>
          <p style={styles.stepDesc}>Zero-downtime production releases.</p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "100px 0",
    backgroundColor: "var(--bg-dark)",
    borderTop: "1px solid var(--border-color)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "64px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  accentText: {
    color: "var(--accent-green)",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 16px 0",
    letterSpacing: "-1px",
  },
  sectionSubtitle: {
    fontSize: "15px",
    color: "var(--text-muted)",
    maxWidth: "540px",
    lineHeight: "1.6",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "32px",
  },
  stepCard: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
  },
  circleNumber: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--accent-green)",
    backgroundColor: "var(--bg-dark)",
    marginBottom: "24px",
  },
  stepTitle: {
    fontSize: "20px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 12px 0",
  },
  stepDesc: {
    fontSize: "14px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: 0,
    maxWidth: "240px",
  },
};
