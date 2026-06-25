import React from "react";
import { 
  colors, 
  shadows 
} from "../../tokens";

type AccentTextProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const AccentText: React.FC<AccentTextProps> = (
  { children, style }) => {
  return <span style={{ ...styles.accent, ...style }}>
    {children}</span>;
};

const styles = {
  accent: {
    color: colors.accent.green,
    textShadow: shadows.glow,
  },
};
