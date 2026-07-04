import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

type ContactActionRowProps = {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  active?: boolean;
};

export const ContactActionRow: React.FC<ContactActionRowProps> = ({
  href,
  label,
  value,
  icon,
  active = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        ...styles.actionRow,
        ...(isHovered ? styles.actionRowHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.rowContent}>
        <span
          style={{
            ...styles.statusDot,
            ...(active || isHovered ? styles.statusDotActive : {}),
          }}
        />

        <div style={styles.rowText}>
          <p style={styles.rowLabel}>{label}</p>

          <p
            style={{
              ...styles.rowValue,
              ...(isHovered ? styles.rowValueHover : {}),
            }}
          >
            {value}
          </p>
        </div>
      </div>

      <span
        style={{
          ...styles.rowIcon,
          ...(isHovered ? styles.rowIconHover : {}),
        }}
      >
        {icon}
      </span>
    </a>
  );
};

const styles = {
  actionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: "rgba(26, 28, 36, 0.5)",
    border: "1px solid transparent",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },

  actionRowHover: {
    borderColor: "rgba(255, 155, 196, 0.3)",
    backgroundColor: "#1A1C24",
  },

  rowContent: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
  },

  rowText: {
    minWidth: 0,
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#6B6F7B",
    flexShrink: 0,
    transition: "all 0.3s ease",
  },

  statusDotActive: {
    backgroundColor: colors.accent.pink,
    boxShadow: "0 0 8px rgba(255, 155, 196, 0.5)",
  },

  rowLabel: {
    fontSize: "11px",
    color: "#6B6F7B",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: typography.fontWeight.bold,
    margin: `0 0 4px 0`,
  },

  rowValue: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: typography.fontWeight.bold,
    color: "#d1d5db",
    margin: 0,
    transition: "color 0.3s ease",
    wordBreak: "break-word" as const,
  },

  rowValueHover: {
    color: colors.text.main,
  },

  rowIcon: {
    color: "#6B6F7B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "color 0.3s ease",
  },

  rowIconHover: {
    color: colors.accent.pink,
  },
};
