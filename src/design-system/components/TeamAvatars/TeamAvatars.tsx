import React from "react";

export type TeamAvatar = {
  src: string;
  alt: string;
};

type TeamAvatarsProps = {
  avatars: TeamAvatar[];
  size?: number;
  borderColor?: string;
  overlap?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const TeamAvatars: React.FC<TeamAvatarsProps> = ({
  avatars,
  size = 64,
  borderColor = "#2a2a2a",
  overlap = 16,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        ...styles.group,
        ...style,
      }}
    >
      {avatars.map((avatar, index) => (
        <img
          key={avatar.src}
          src={avatar.src}
          alt={avatar.alt}
          style={{
            ...styles.avatar,
            width: size,
            height: size,
            border: `4px solid ${borderColor}`,
            marginLeft: index === 0 ? 0 : -overlap,
          }}
        />
      ))}
    </div>
  );
};

const styles = {
  group: {
    display: "flex",
    alignItems: "center",
  },

  avatar: {
    borderRadius: "999px",
    objectFit: "cover" as const,
    display: "block",
    flexShrink: 0,
  },
};
