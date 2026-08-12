import React from "react";
import { colors, radius, spacing } from "../../../../design-system";
import type { AdminConversation } from "../types/adminChat.types";
import { useAdminChat } from "../hooks/useAdminChat";
import { AdminMessageComposer } from "./AdminMessageComposer";
import { AdminChatHeader } from "./AdminChatHeader";
import { AdminChatMessages } from "./AdminChatMessages";

type AdminChatWindowProps = {
  conversation: AdminConversation | null;
  isCompactChat: boolean;
  isNarrowChat: boolean;
  onConversationUpdated: () => void;
};

export const AdminChatWindow: React.FC<AdminChatWindowProps> = ({
  conversation,
  isCompactChat,
  isNarrowChat,
  onConversationUpdated,
}) => {
  const {
    messages,
    reply,
    isLoading,
    isSending,
    isUpdatingStatus,
    error,
    successMessage,
    isVisitorOnline,
    isVisitorTyping,
    setReply,
    handleTypingChange,
    handleStatusChange,
    handleSubmit,
  } = useAdminChat({
    conversation,
    onConversationUpdated,
  });

  if (!conversation) {
    return (
      <section
        style={{
          ...styles.emptyState,
          ...(isCompactChat ? styles.emptyStateCompact : {}),
        }}
      >
        <h2 style={styles.emptyTitle}>Select a conversation</h2>

        <p style={styles.emptyText}>
          Choose a visitor conversation from the inbox to view messages and
          reply.
        </p>
      </section>
    );
  }

  return (
    <section
      style={{
        ...styles.window,
        ...(isCompactChat ? styles.windowCompact : {}),
      }}
    >
      <AdminChatHeader
        conversation={conversation}
        isCompactChat={isCompactChat}
        isNarrowChat={isNarrowChat}
        isUpdatingStatus={isUpdatingStatus}
        isVisitorOnline={isVisitorOnline}
        isVisitorTyping={isVisitorTyping}
        onStatusChange={handleStatusChange}
      />

      <AdminChatMessages
        messages={messages}
        isLoading={isLoading}
        isVisitorTyping={isVisitorTyping}
        error={error}
        successMessage={successMessage}
        isCompactChat={isCompactChat}
      />

      <AdminMessageComposer
        value={reply}
        isSending={isSending}
        onChange={setReply}
        onTypingChange={handleTypingChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

const styles = {
  window: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: colors.background.dark,
  },

  emptyState: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "24px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    maxWidth: "360px",
  },

  windowCompact: {
    minHeight: "620px",
  },

  emptyStateCompact: {
    minHeight: "420px",
  },
};
