import React from "react";
import { colors } from "../../../../design-system";
import type { AdminConversation } from "../types/adminChat.types";
import { useAdminChat } from "../hooks/useAdminChat";
import { AdminMessageComposer } from "./AdminMessageComposer";
import { AdminChatHeader } from "./AdminChatHeader";
import { AdminChatMessages } from "./AdminChatMessages";
import { AdminChatEmptyState } from "./AdminChatEmptyState";

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
    return <AdminChatEmptyState isCompactChat={isCompactChat} />;
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

  windowCompact: {
    minHeight: "620px",
  },
};
