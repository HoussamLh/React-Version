import React from "react";

type LabelProps = {
  text: string;
};

export const Label: React.FC<LabelProps> = ({ text }) => {
  return (
    <div style={styles.metaLabel} className="mono-text">
      <div style={styles.badge} className="mono-text">
        <span style={styles.badgeDot}>•</span>
        {text}
      </div>
    </div>
  );
};

const styles = {
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
};
