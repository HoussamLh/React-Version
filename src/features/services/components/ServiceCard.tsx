import React from "react";
import { ExceptionalCard, colors } from "../../../design-system";
import type { ExceptionalCardAccent } from "../../../design-system";
import type { Service } from "../data/services.data";

export type ServiceCardAccent = ExceptionalCardAccent;

type ServiceCardProps = Service & {
  hoverAccent?: ServiceCardAccent;
};

const accentColors: Record<ServiceCardAccent, string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
  yellow: colors.accent.yellow,
  cyan: colors.accent.cyan,
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
    <ExceptionalCard
      interactive
      accent={hoverAccent}
      icon={icon}
      badge={badge}
      title={title}
      text={text}
      className="service-card"
      style={{ gridColumn: span }}
      bodyStyle={styles.body}
      footer={
        monitoring ? (
          <>
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
          </>
        ) : undefined
      }
    >
      {image && (
        <div className="ds-card-media" style={styles.media}>
          <img
            src={image}
            className="ds-card-image ds-zoom-image"
            style={styles.image}
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
    </ExceptionalCard>
  );
};

const styles = {
  body: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "18px",
  },

  media: {
    width: "100%",
    height: "220px",
    minHeight: "180px",
    flexShrink: 0,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
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
