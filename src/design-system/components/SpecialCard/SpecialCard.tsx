import React from "react";
import { Button } from "../Button";

export type SpecialCardAction = {
  label: React.ReactNode;
  to: string;
  variant?: "primary" | "secondary";
};

export type SpecialCardProps = {
  children: React.ReactNode;
  recommended?: boolean;
  recommendedLabel?: string;
  action?: SpecialCardAction;
  className?: string;
  style?: React.CSSProperties;
};

export const SpecialCard: React.FC<SpecialCardProps> = ({
  children,
  recommended = false,
  recommendedLabel = "RECOMMENDED",
  action,
  className = "",
  style,
}) => {
  const wrapperClassName = [
    "ds-special-card-wrapper",
    recommended ? "ds-special-card-wrapper-recommended" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardClassName = [
    "ds-special-card",
    recommended ? "ds-special-card-recommended" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {recommended && (
        <span className="ds-special-card-recommended-badge mono-text">
          {recommendedLabel}
        </span>
      )}

      <div className={cardClassName} style={style}>
        <div>{children}</div>

        {action && (
          <div style={styles.actionWrapper}>
            <Button
              to={action.to}
              variant={
                action.variant ?? (recommended ? "primary" : "secondary")
              }
              style={styles.actionButton}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  actionWrapper: {
    marginTop: "auto",
    width: "100%",
  },

  actionButton: {
    width: "100%",
    justifyContent: "center",
    minHeight: "42px",
    padding: "10px 14px",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap" as const,
  },
};
