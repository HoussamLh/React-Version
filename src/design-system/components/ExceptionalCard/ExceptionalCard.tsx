import React from "react";
import { Card } from "../Card";
import { Badge } from "../Badge";

export type ExceptionalCardAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

type ExceptionalCardProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  text?: React.ReactNode;
  badge?: React.ReactNode;
  accent?: ExceptionalCardAccent;
  interactive?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
};

const accentColors: Record<ExceptionalCardAccent, string> = {
  green: "var(--accent-green)",
  blue: "var(--accent-blue)",
  purple: "var(--accent-purple)",
  pink: "var(--accent-pink)",
  yellow: "var(--accent-yellow)",
  cyan: "var(--accent-cyan)",
};

export const ExceptionalCard: React.FC<ExceptionalCardProps> = ({
  icon,
  title,
  text,
  badge,
  accent = "green",
  interactive = false,
  children,
  footer,
  className = "",
  style,
  titleStyle,
  textStyle,
  bodyStyle,
}) => {
  const accentColor = accentColors[accent];

  const cardClassName = ["ds-card-stack", className].filter(Boolean).join(" ");

  return (
    <Card
      interactive={interactive}
      hoverAccent={accent}
      className={cardClassName}
      style={style}
    >
      <div style={styles.header}>
        <div
          className="ds-card-toolbar"
          style={{
            ...styles.iconToolbar,
            justifyContent: badge ? "space-between" : "flex-start",
          }}
        >
          <div
            className="ds-icon-box"
            style={{
              borderColor: accentColor,
              color: accentColor,
            }}
          >
            {icon}
          </div>

          {badge && <Badge accent={accent}>{badge}</Badge>}
        </div>

        <h3
          className="ds-card-title"
          style={{
            ...styles.title,
            ...titleStyle,
          }}
        >
          {title}
        </h3>

        {text && (
          <p
            className="ds-card-text"
            style={{
              ...styles.text,
              ...textStyle,
            }}
          >
            {text}
          </p>
        )}
      </div>

      {children && (
        <div
          style={{
            ...styles.body,
            ...bodyStyle,
          }}
        >
          {children}
        </div>
      )}

      {footer && <div className="ds-card-footer-row">{footer}</div>}
    </Card>
  );
};

const styles = {
  header: {
    flexShrink: 0,
  },

  iconToolbar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "nowrap" as const,
    marginBottom: "24px",
  },

  title: {
    marginBottom: "10px",
  },

  text: {
    marginBottom: 0,
  },

  body: {
    flex: 1,
    minWidth: 0,
  },
};
