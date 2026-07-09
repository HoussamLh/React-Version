import React from "react";
import { colors, spacing } from "../../../design-system";
import type { AdminMessage } from "./adminChat.types";

type AdminMessageBubbleProps = {
  message: AdminMessage;
};

const formatTime = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const AdminMessageBubble: React.FC<AdminMessageBubbleProps> = ({
  message,
}) => {
  const isAdmin = message.senderType === "admin";
  const isSystem = message.senderType === "system";

  const senderLabel = isAdmin ? "You" : isSystem ? "Sam" : "Visitor";

  return (
    <div
      style={{
        ...styles.row,
        alignItems: isAdmin ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          ...styles.bubble,
          ...(isAdmin ? styles.adminBubble : styles.visitorBubble),
        }}
      >
        {message.body}
      </div>

      <span
        style={{
          ...styles.meta,
          textAlign: isAdmin ? "right" : "left",
        }}
      >
        {senderLabel} · {formatTime(message.createdAt)}
      </span>
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },

  bubble: {
    width: "fit-content",
    maxWidth: "78%",
    minWidth: 0,
    boxSizing: "border-box" as const,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    lineHeight: "20px",
    whiteSpace: "pre-line" as const,
    overflowWrap: "anywhere" as const,
    wordBreak: "break-word" as const,
  },

  adminBubble: {
    borderRadius: "18px 18px 6px 18px",
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
  },

  visitorBubble: {
    borderRadius: "18px 18px 18px 6px",
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.main,
  },

  meta: {
    color: colors.text.muted,
    fontSize: "12px",
  },
};
