import React from "react";
import { colors, spacing } from "../../../design-system";
import { liveChatAgent } from "../data/liveChat.data";

export const LiveChatFeedbackBanner: React.FC = () => {
  return <div style={styles.feedbackText}>{liveChatAgent.feedbackText}</div>;
};

const styles = {
  feedbackText: {
    textAlign: "center" as const,
    color: colors.text.muted,
    fontSize: "13px",
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.03)`,
  },
};
