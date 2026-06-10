import React from "react";

export const BuildProcess: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Discovery",
      desc: "Deep dive into technical requirements and architecture planning.",
    },
    {
      num: "02",
      title: "Prototyping",
      desc: "High-fidelity UI/UX design and core logic validation.",
    },
    {
      num: "03",
      title: "Engineering",
      desc: "Agile development cycles with continuous integration and testing.",
    },
    {
      num: "04",
      title: "Deployment",
      desc: "Zero-downtime shipping and proactive monitoring setup.",
    },
  ];

  return (
    <section style={styles.container}>
      {/* Section Headers */}
      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>Our Build Process</h2>
        <p style={styles.sectionSubtitle}>
          We follow a rigorous, methodology-driven approach to ensure every line
          of code serves your strategic business objectives.
        </p>
      </div>

      {/* Horizontal Steps Layout Grid */}
      <div style={styles.grid}>
        {steps.map((step, index) => (
          <div key={index} style={styles.stepCard}>
            {/* Circular Number Callout Indicator */}
            <div style={styles.circleNumber} className="mono-text">
              {step.num}
            </div>

            <h3 style={styles.stepTitle}>{step.title}</h3>
            <p style={styles.stepDesc}>{step.desc}</p>
          </div>
        ))}
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
    color: "var(--text-muted)",
    backgroundColor: "rgba(255, 255, 255, 0.01)",
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
