import React from "react";

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ProcessSectionProps = {
  titleStart: string;
  titleAccent?: string;
  subtitle?: string;
  steps: ProcessStep[];
  gridClassName?: string;
  cardClassName?: string;
  circleClassName?: string;
};

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  titleStart,
  titleAccent,
  subtitle,
  steps,
  gridClassName,
  cardClassName,
  circleClassName,
}) => {
  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          {titleStart}
          {titleAccent && (
            <>
              {" "}
              <span style={styles.accentText}>{titleAccent}</span>
            </>
          )}
        </h2>

        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* Grid */}
      <div style={styles.grid} className={gridClassName}>
        {steps.map((step) => (
          <div key={step.number} style={styles.card} className={cardClassName}>
            <span style={styles.circle} className={circleClassName}>
              {step.number}
            </span>

            <h3 style={styles.cardTitle}>{step.title}</h3>
            <p style={styles.cardText}>{step.description}</p>
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

  title: {
    fontSize: "36px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 16px 0",
    letterSpacing: "-1px",
  },

  accentText: {
    color: "var(--accent-green)",
  },

  subtitle: {
    fontSize: "15px",
    color: "var(--text-muted)",
    maxWidth: "540px",
    lineHeight: "1.6",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "32px",
  },

  card: {
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },

  circle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent-green)",
    backgroundColor: "var(--bg-dark)",
    marginBottom: "24px",
    fontSize: "12px",
    fontWeight: 700,
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 12px 0",
  },

  cardText: {
    fontSize: "14px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: 0,
    maxWidth: "240px",
  },
};
