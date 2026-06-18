import React from "react";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../../design-system";

export const HeroTerminalCard: React.FC = () => {
  return (
    <div style={styles.terminalCard} 
    className="ds-float-subtle">
      <div style={styles.terminalHeader}>
        <span style={{ 
          ...styles.dot, 
          backgroundColor: 
          "#ff5f56" }} />
        <span style={{ 
          ...styles.dot, 
          backgroundColor: 
          "#ffbd2e" }} />
        <span style={{ 
          ...styles.dot, 
          backgroundColor: 
          "#27c93f" }} />
      </div>

      <div style={styles.terminalBody} 
      className="mono-text">
        <span style={{ color: colors.text.muted }}>
          const</span>{" "}
        <span style={{ color: colors.accent.green }}>
          future</span> ={" "}
        <span style={{ color: colors.text.muted }}>
          await</span>{" "}
        <span style={{ color: colors.text.main }}>
          engineering</span>.
        <span style={{ color: colors.accent.green }}>
          deploy</span>();
        <div style={styles.terminalStatus}>
          Status: Optimized</div>
      </div>
    </div>
  );
};

const styles = {
  terminalCard: {
    position: "absolute" as const,
    bottom: "-20px",
    left: "-30px",
    zIndex: 100,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: `${spacing.md} 20px`,
    width: "70%",
    boxShadow: shadows.terminal,
  },

  terminalHeader: {
    display: "flex",
    gap: "6px",
    marginBottom: "14px",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: radius.pill,
  },

  terminalBody: {
    fontSize: "13px",
    lineHeight: typography.lineHeight.normal,
    color: "#e1e4ea",
  },

  terminalStatus: {
    marginTop: spacing.sm,
    color: colors.accent.green,
    fontSize: "12px",
  },
};
