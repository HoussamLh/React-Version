import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, radius } from "../../../design-system";
import {
  getAdminConversations,
  markConversationReadForAdmin,
  subscribeToAllAdminMessages,
} from "./adminChat.service";
import type { AdminConversation } from "./adminChat.types";
import { AdminChatWindow } from "./AdminChatWindow";
import {
  ConversationList,
  type AdminConversationFilter,
} from "./ConversationList";

const getSearchableConversationText = (conversation: AdminConversation) => {
  return [
    conversation.visitorName,
    conversation.visitorEmail,
    conversation.visitorId,
    conversation.lastMessageBody,
    conversation.status,
    conversation.source,
    conversation.chatMode,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export const AdminChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<AdminConversation | null>(null);
  const [conversationFilter, setConversationFilter] =
    useState<AdminConversationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedConversationId = selectedConversation?.id ?? null;
  const selectedConversationUnreadCount =
    selectedConversation?.unreadCount ?? 0;

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError("");

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
    } catch {
      setError("Could not load conversations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterCounts = useMemo(() => {
    return {
      all: conversations.length,
      open: conversations.filter(
        (conversation) => conversation.status === "open",
      ).length,
      pending: conversations.filter(
        (conversation) => conversation.status === "pending",
      ).length,
      closed: conversations.filter(
        (conversation) => conversation.status === "closed",
      ).length,
      unread: conversations.filter(
        (conversation) => conversation.unreadCount > 0,
      ).length,
      offline: conversations.filter(
        (conversation) => conversation.chatMode === "offline",
      ).length,
    };
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesFilter =
        conversationFilter === "all" ||
        conversation.status === conversationFilter ||
        (conversationFilter === "unread" && conversation.unreadCount > 0) ||
        (conversationFilter === "offline" &&
          conversation.chatMode === "offline");

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      return getSearchableConversationText(conversation).includes(
        normalizedSearchQuery,
      );
    });
  }, [conversationFilter, conversations, searchQuery]);

  const hasActiveFilters =
    conversationFilter !== "all" || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setConversationFilter("all");
    setSearchQuery("");
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      void loadConversations();
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
        conversations={filteredConversations}
        totalConversationCount={conversations.length}
        selectedConversationId={selectedConversationId}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        conversationFilter={conversationFilter}
        filterCounts={filterCounts}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchQuery}
        onFilterChange={setConversationFilter}
        onResetFilters={handleResetFilters}
        onRefresh={loadConversations}
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
