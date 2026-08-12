import React, { useEffect, useRef } from "react";
import { colors, spacing } from "../../../../design-system";
import type { AdminMessage } from "../types/adminChat.types";
import { AdminSuccessMessage } from "../../components";
import { AdminMessageBubble } from "./AdminMessageBubble";
import { TypingIndicator } from "../../../../shared/components";

type AdminChatMessagesProps = {
  messages: AdminMessage[];
  isLoading: boolean;
  isVisitorTyping: boolean;
  error: string;
  successMessage: string;
  isCompactChat: boolean;
};

export const AdminChatMessages: React.FC<AdminChatMessagesProps> = ({
  messages,
  isLoading,
  isVisitorTyping,
  error,
  successMessage,
  isCompactChat,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, isVisitorTyping]);

  return (
    <div
      style={{
        ...styles.body,
        ...(isCompactChat ? styles.bodyCompact : {}),
      }}
    >
      {isLoading && <p style={styles.stateText}>Loading messages...</p>}

      {!isLoading && messages.length === 0 && (
        <p style={styles.stateText}>No messages in this conversation yet.</p>
      )}

      {messages.map((message) => (
        <AdminMessageBubble key={message.id} message={message} />
      ))}

      {isVisitorTyping && <TypingIndicator label="Visitor is typing" />}

      {error && <p style={styles.error}>{error}</p>}

      {successMessage && (
        <AdminSuccessMessage>{successMessage}</AdminSuccessMessage>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

const styles = {
  body: {
    flex: 1,
    overflowY: "auto" as const,
    padding: spacing.lg,
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "13px",
    margin: 0,
  },

  bodyCompact: {
    minHeight: "420px",
  },
};
