import React from "react";
import { colors, spacing } from "../../../design-system";
import type { LiveChatMessage } from "../types/liveChat.types";

type LiveChatMessageBubbleProps = {
  message: LiveChatMessage;
};

const formatTime = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const LiveChatMessageBubble: React.FC<LiveChatMessageBubbleProps> = ({
  message,
}) => {
  const isVisitor = message.senderType === "visitor";
  const isSystem = message.senderType === "system";

  if (isSystem) {
    return (
      <div style={styles.systemRow}>
        <span style={styles.systemMessage}>{message.body}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.messageRow,
        alignItems: isVisitor ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          ...styles.messageBubble,
          ...(isVisitor ? styles.visitorMessage : styles.agentMessage),
        }}
      >
        {message.body}
      </div>

      <div
        style={{
          ...styles.messageMeta,
          textAlign: isVisitor ? "right" : "left",
        }}
      >
        {isVisitor ? "You" : "Sam"} · {formatTime(message.createdAt)}
      </div>
    </div>
  );
};

const styles = {
  messageRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },

  messageBubble: {
    width: "fit-content",
    maxWidth: "85%",
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    lineHeight: "20px",
  },

  agentMessage: {
    borderRadius: "18px 18px 18px 6px",
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.main,
  },

  visitorMessage: {
    borderRadius: "18px 18px 6px 18px",
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    border: "none",
  },

  messageMeta: {
    color: colors.text.muted,
    fontSize: "12px",
  },

  systemRow: {
    display: "flex",
    justifyContent: "center",
  },

  systemMessage: {
    color: colors.text.muted,
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
};
