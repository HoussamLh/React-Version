import React from "react";
import { colors, typography } from "../../../design-system";
import { teamAvatars } from "../../../data/teamAvatars.data";
import { liveChatAgent } from "../data/liveChat.data";

type LiveChatAgentAvatarProps = {
  size?: number;
};

export const LiveChatAgentAvatar: React.FC<LiveChatAgentAvatarProps> = ({
  size = 42,
}) => {
  const agentAvatar = teamAvatars[0];

  return (
    <span
      style={{
        ...styles.previewAvatar,
        width: size,
        height: size,
      }}
    >
      {agentAvatar ? (
        <img src={agentAvatar.src} alt={agentAvatar.alt} style={styles.image} />
      ) : (
        liveChatAgent.name.charAt(0)
      )}
    </span>
  );
};

const styles = {
  previewAvatar: {
    borderRadius: "50%",
    backgroundColor: colors.accent.pink,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
    flexShrink: 0,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover" as const,
    display: "block",
  },
};
