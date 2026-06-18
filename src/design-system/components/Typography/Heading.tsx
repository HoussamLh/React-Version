import React from "react";
import { 
  colors, 
  typography 
} from "../../components/tokens";

type HeadingTag = "h1" | "h2" | "h3";
type HeadingVariant = "hero" | "section" | "card";

type HeadingProps = {
  children: React.ReactNode;
  as?: HeadingTag;
  variant?: HeadingVariant;
  style?: React.CSSProperties;
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  as = "h2",
  variant = "section",
  style,
}) => {
  const Tag = as;

  return (
    <Tag style={{ 
      ...styles.base, 
      ...styles[variant], 
      ...style }}>
      {children}
    </Tag>
  );
};

const styles: Record<
"base" | HeadingVariant, 
React.CSSProperties> = {
  base: {
    color: colors.text.main,
    margin: 0,
  },

  hero: {
    fontFamily: typography.fontFamily.system,
    fontSize: typography.fontSize.heroTitle,
    fontWeight: typography.fontWeight.extraBold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.wide,
    margin: "0 0 24px 0",
  },

  section: {
    fontSize: typography.fontSize.sectionTitle,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: "1.2",
    margin: "0 0 16px 0",
  },

  card: {
    fontSize: typography.fontSize.cardTitle,
    fontWeight: typography.fontWeight.bold,
    lineHeight: "1.3",
    margin: "0 0 16px 0",
  },
};
