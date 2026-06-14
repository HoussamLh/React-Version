import React from "react";

export const Badge: React.FC<{
  label: string;
}> = ({ label }) => {
  return <div style={styles.badge}>{label}</div>;
};

const styles = {
  badge: {
    backgroundColor: "var(--accent-green)",
    color: "#000",
    fontSize: "12px",
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
};
