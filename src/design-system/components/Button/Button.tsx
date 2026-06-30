import React, { useState } from "react";
import { Link } from "react-router";
import {
  colors,
  motion,
  radius,
  shadows,
  spacing,
  typography,
} from "../../tokens";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  type = "button",
  fullWidth = false,
  className,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyle =
    variant === "primary"
      ? styles.primary
      : isHovered
        ? styles.secondaryHover
        : styles.secondary;

  const buttonStyle = {
    ...styles.base,
    ...variantStyle,
    ...(fullWidth ? styles.fullWidth : {}),
    ...style,
  };

  const hoverEvents =
    variant === "secondary"
      ? {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
        }
      : {};

  if (to) {
    return (
      <Link to={to} style={buttonStyle} className={className} {...hoverEvents}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={buttonStyle} className={className} {...hoverEvents}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={buttonStyle}
      className={className}
      {...hoverEvents}
    >
      {children}
    </button>
  );
};

const styles = {
  base: {
    borderRadius: radius.md,
    padding: `${spacing.md} ${spacing.xl}`,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `all ${motion.duration.fast} ${motion.easing.default}`,
  },

  primary: {
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    border: "none",
    boxShadow: shadows.glow,
  },

  secondary: {
    backgroundColor: "#f4f1e8",
    color: colors.background.dark,
    border: `1px solid ${colors.accent.green}`,
    boxShadow: shadows.glow,
  },

  secondaryHover: {
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    border: `1px solid ${colors.accent.green}`,
    boxShadow: shadows.glow,
  },

  fullWidth: {
    width: "100%",
  },
};
