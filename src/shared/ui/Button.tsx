import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  to?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  href,
  to,
  onClick,
  style,
  className,
}) => {
  const buttonStyle =
    variant === "primary" ? styles.primaryBtn : styles.secondaryBtn;

  const linkTarget = href || to;

  if (linkTarget) {
    return (
      <a
        href={linkTarget}
        style={{ ...buttonStyle, ...style }}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...buttonStyle, ...style }}
      className={className}
    >
      {children}
    </button>
  );
};

const styles: Record<"primaryBtn" | "secondaryBtn", React.CSSProperties> = {
  primaryBtn: {
    backgroundColor: "var(--accent-green)",
    color: "#0d0f12",
    border: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(147, 181, 255, 0.15)",
    transition: "opacity 0.2s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryBtn: {
    backgroundColor: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--accent-green)",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "15px",
    textDecoration: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
};
