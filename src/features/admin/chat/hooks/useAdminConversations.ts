import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminConversations,
  markConversationReadForAdmin,
} from "../services/adminChat.service";
import { subscribeToAllAdminMessages } from "../services/adminChat.realtime.service";
import type { AdminConversation } from "../types/adminChat.types";
import { getAdminConversationSearchableText } from "../helpers/adminChat.helpers";
import type { AdminConversationFilter } from "../components/ConversationListFilters";

export const useAdminConversations = () => {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<AdminConversation | null>(null);

  const [conversationFilter, setConversationFilter] =
    useState<AdminConversationFilter>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
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

  const hasUnreadConversations = filterCounts.unread > 0;

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

      return getAdminConversationSearchableText(conversation).includes(
        normalizedSearchQuery,
      );
    });
  }, [conversationFilter, conversations, searchQuery]);

  const hasActiveFilters =
    conversationFilter !== "all" || searchQuery.trim().length > 0;

  const handleMarkAllRead = useCallback(async () => {
    const unreadConversationIds = conversations
      .filter((conversation) => conversation.unreadCount > 0)
      .map((conversation) => conversation.id);

    if (unreadConversationIds.length === 0) {
      return;
    }

    setIsMarkingAllRead(true);
    setError("");

    try {
      await Promise.all(
        unreadConversationIds.map((conversationId) =>
          markConversationReadForAdmin(conversationId),
        ),
      );

      await loadConversations();

      window.dispatchEvent(new Event("admin-badges-changed"));
    } catch {
      setError("Could not mark conversations as read.");
    } finally {
      setIsMarkingAllRead(false);
    }
  }, [conversations, loadConversations]);

  const handleResetFilters = useCallback(() => {
    setConversationFilter("all");
    setSearchQuery("");
  }, []);

  // Initial conversation load.
  useEffect(() => {
    void Promise.resolve().then(() => {
      void loadConversations();
    });
  }, [loadConversations]);

  // Keep the conversation inbox updated when a new message arrives.
  useEffect(() => {
    const unsubscribe = subscribeToAllAdminMessages({
      onMessage: () => {
        void loadConversations();
      },
    });

    return unsubscribe;
  }, [loadConversations]);

  // Mark the selected conversation as read.
  useEffect(() => {
    if (!selectedConversationId || selectedConversationUnreadCount === 0) {
      return;
    }

    let isMounted = true;

    void Promise.resolve().then(async () => {
      try {
        await markConversationReadForAdmin(selectedConversationId);

        if (!isMounted) {
          return;
        }

        await loadConversations();
      } catch {
        // Keep the inbox usable if the read-state update fails.
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

  return {
    conversations,
    selectedConversation,

    conversationFilter,
    searchQuery,

    isLoading,
    isMarkingAllRead,
    error,

    filterCounts,
    filteredConversations,

    hasUnreadConversations,
    hasActiveFilters,

    selectedConversationId,
    selectedConversationUnreadCount,

    setSelectedConversation,
    setConversationFilter,
    setSearchQuery,

    loadConversations,
    handleMarkAllRead,
    handleResetFilters,
  };
};
