import React from "react";
import { Card, colors } from "../../../design-system";
import type { Service } from "../data/services.data";

export type ServiceCardAccent = "green" | "blue" | "purple" | "pink";

type ServiceCardProps = Service & {
  hoverAccent?: ServiceCardAccent;
};

const accentColors: Record<ServiceCardAccent, string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  text,
  image,
  icon,
  pills,
  span,
  badge,
  monitoring,
  hoverAccent = "green",
}) => {
  const accentColor = accentColors[hoverAccent];

  const avatarStyles = [
    styles.avatarFirst,
    { ...styles.avatarSecond, backgroundColor: accentColor },
    styles.avatarThird,
  ];

  return (
    <Card
      interactive
      hoverAccent={hoverAccent}
      className="service-card ds-card-stack"
      style={{ gridColumn: span }}
    >
      {/* Icon + Badge */}
      <div style={styles.iconRow}>
        <div
          className="ds-card-toolbar"
          style={{
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

          {badge && (
            <span
              style={{
                color: accentColor,
                borderColor: accentColor,
              }}
              className="ds-badge mono-text"
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      <h3 className="ds-card-title">{title}</h3>

      <p className="ds-card-text">{text}</p>

      {image && (
        <div className="ds-card-media">
          <img
            src={image}
            className="ds-card-image"
            alt={title}
          />
        </div>
      )}

      {pills && (
        <div className="ds-pill-row">
          {pills.map((pill) => (
            <span key={pill} className="ds-pill mono-text">
              {pill}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Monitoring Section */}
      {monitoring && (
        <div className="ds-card-footer-row">
          <div style={styles.avatarGroup}>
            {avatarStyles.map((avatarStyle, index) => (
              <div
                key={index}
                style={{
                  ...styles.avatar,
                  ...avatarStyle,
                }}
              />
            ))}
          </div>

          <span style={styles.monitoringText} className="mono-text">
            24/7 Monitoring Dashboard
          </span>
        </div>
      )}
    </Card>
  );
};

const styles = {
  iconRow: {
    marginBottom: "10px",
  },

  avatarGroup: {
    display: "flex",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    border: `2px solid ${colors.background.card}`,
    marginLeft: "-10px",
  },

  avatarFirst: {
    marginLeft: "0",
    backgroundColor: colors.text.muted,
  },

  avatarSecond: {
    backgroundColor: colors.accent.green,
  },

  avatarThird: {
    backgroundColor: colors.text.main,
  },

  monitoringText: {
    fontSize: "12px",
    color: colors.text.main,
  },
};
