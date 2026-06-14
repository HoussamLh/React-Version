import React from "react";

type Props = {
  title: string;
  accent?: string;
  subtitle?: string;
  center?: boolean;
};

export const SectionTitle: React.FC<Props> = ({
  title,
  accent,
  subtitle,
  center = false,
}) => {
  return (
    <div style={{ ...styles.wrapper, textAlign: center ? "center" : "left" }}>
      <h2 style={styles.title}>
        {title} {accent && <span style={styles.accent}>{accent}</span>}
      </h2>

      {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

const styles = {
  wrapper: {
    marginBottom: "60px",
  },
  title: {
    fontSize: "36px",
    fontWeight: 800,
    color: "var(--text-main)",
    letterSpacing: "-1px",
    margin: 0,
  },
  subtitle: {
    fontSize: "15px",
    color: "var(--text-muted)",
    marginTop: "12px",
    maxWidth: "540px",
    lineHeight: "1.6",
  },
  accent: {
    color: "var(--accent-green)",
  },
};
