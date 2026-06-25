import React from "react";
import { 
  colors, 
  typography 
} from "../../tokens";

type TextVariant = "hero" | "section" | "body" | "small";

type TextProps = {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: React.CSSProperties;
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  style,
}) => {
  return (
    <p style={{ 
      ...styles.base, 
      ...styles[variant], 
      ...style }}>
      {children}
    </p>
  );
};

const styles: Record<
"base" | TextVariant, 
React.CSSProperties> = {
  base: {
    color: colors.text.muted,
    margin: 0,
  },

  hero: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.relaxed,
    margin: "0 0 40px 0",
    maxWidth: "520px",
  },

  section: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: "500px",
  },

  body: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.relaxed,
  },

  small: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
  },
};
