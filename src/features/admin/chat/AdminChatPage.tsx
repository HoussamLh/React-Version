import React, { useCallback, useEffect, useState } from "react";
import { colors, radius } from "../../../design-system";
import {
  getAdminConversations,
  markConversationReadForAdmin,
  subscribeToAllAdminMessages,
} from "./adminChat.service";
import type { AdminConversation } from "./adminChat.types";
import { AdminChatWindow } from "./AdminChatWindow";
import { ConversationList } from "./ConversationList";

export const AdminChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<AdminConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversationId = selectedConversation?.id ?? null;
  const selectedConversationUnreadCount =
    selectedConversation?.unreadCount ?? 0;

  const loadConversations = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextConversations = await getAdminConversations();

      setConversations(nextConversations);

      setSelectedConversation((current) => {
        if (!current) {
          return nextConversations[0] ?? null;
        }

        return (
          nextConversations.find(
            (conversation) => conversation.id === current.id,
          ) ??
          nextConversations[0] ??
          null
        );
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => {
      loadConversations();
    });
  }, [loadConversations]);

  useEffect(() => {
    const unsubscribe = subscribeToAllAdminMessages({
      onMessage: () => {
        void loadConversations();
      },
    });

    return unsubscribe;
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConversationId || selectedConversationUnreadCount === 0) {
      return;
    }

    let isMounted = true;

    void Promise.resolve().then(async () => {
      try {
        await markConversationReadForAdmin(selectedConversationId);

        if (!isMounted) return;

        await loadConversations();
      } catch {
        // Keep the inbox usable even if read-state update fails.
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    selectedConversationId,
    selectedConversationUnreadCount,
    loadConversations,
  ]);

  return (
    <section style={styles.shell}>
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        isLoading={isLoading}
        onSelectConversation={setSelectedConversation}
      />

      <AdminChatWindow
        conversation={selectedConversation}
        onConversationUpdated={loadConversations}
      />
    </section>
  );
};

const styles = {
  shell: {
    height: "calc(100vh - 146px)",
    minHeight: "620px",
    borderRadius: radius.lg,
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    display: "flex",
    backgroundColor: colors.background.dark,
  },
};
