import React from "react";
import { colors } from "../../../design-system";
import { useMediaQuery } from "../../../shared/hooks";
import { AdminPanel } from "../components";
import { useAdminConversations } from "./hooks/useAdminConversations";
import { AdminChatWindow } from "./AdminChatWindow";
import { ConversationList } from "./ConversationList";

export const AdminChatPage: React.FC = () => {
  const isCompactChat = useMediaQuery("(max-width: 1250px)");
  const isNarrowChat = useMediaQuery("(max-width: 640px)");

  const {
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
    setSelectedConversation,
    setConversationFilter,
    setSearchQuery,
    loadConversations,
    handleMarkAllRead,
    handleResetFilters,
  } = useAdminConversations();

  return (
    <AdminPanel
      style={{
        ...styles.shell,
        ...(isCompactChat ? styles.shellCompact : {}),
      }}
    >
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
        hasUnreadConversations={hasUnreadConversations}
        isCompactChat={isCompactChat}
        isNarrowChat={isNarrowChat}
        isMarkingAllRead={isMarkingAllRead}
        onSearchChange={setSearchQuery}
        onMarkAllRead={handleMarkAllRead}
        onFilterChange={setConversationFilter}
        onResetFilters={handleResetFilters}
        onRefresh={loadConversations}
        onSelectConversation={setSelectedConversation}
      />

      <AdminChatWindow
        conversation={selectedConversation}
        isCompactChat={isCompactChat}
        isNarrowChat={isNarrowChat}
        onConversationUpdated={loadConversations}
      />
    </AdminPanel>
  );
};

const styles = {
  shell: {
    height: "calc(100vh - 146px)",
    minHeight: "620px",
    display: "flex",
    backgroundColor: colors.background.dark,
  },

  shellCompact: {
    height: "auto",
    minHeight: "auto",
    flexDirection: "column" as const,
    overflow: "visible",
  },
};
