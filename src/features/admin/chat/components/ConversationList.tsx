import React from "react";
import { 
  colors 
} from "../../../../design-system";
import {
  AdminEmptyState,
  AdminErrorRecovery,
  AdminLoadingText,
} from "../../components";
import type {
  AdminConversation
} from "../types/adminChat.types";
import { 
  ConversationListHeader 
} from "./ConversationListHeader";
import { 
  ConversationListFilters 
} from "./ConversationListFilters";
import type { 
  AdminConversationFilter 
} from "./ConversationListFilters";
import { 
  ConversationListItem 
} from "./ConversationListItem";

type ConversationListProps = {
  conversations: AdminConversation[];
  totalConversationCount: number;
  selectedConversationId: string | null;
  isLoading: boolean;
  error: string;
  searchQuery: string;
  conversationFilter: AdminConversationFilter;
  filterCounts: Record<AdminConversationFilter, number>;
  hasActiveFilters: boolean;
  hasUnreadConversations: boolean;
  isCompactChat: boolean;
  isNarrowChat: boolean;
  isMarkingAllRead: boolean;
  onSearchChange: (value: string) => void;
  onMarkAllRead: () => void;
  onFilterChange: (filter: AdminConversationFilter) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onSelectConversation: (conversation: AdminConversation) => void;
};

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  totalConversationCount,
  selectedConversationId,
  isLoading,
  error,
  searchQuery,
  conversationFilter,
  filterCounts,
  hasActiveFilters,
  hasUnreadConversations,
  isCompactChat,
  isNarrowChat,
  isMarkingAllRead,
  onSearchChange,
  onMarkAllRead,
  onFilterChange,
  onResetFilters,
  onRefresh,
  onSelectConversation,
}) => {
  return (
    <aside
      style={{
        ...styles.panel,
        ...(isCompactChat ? styles.panelCompact : {}),
      }}
    >
      <ConversationListHeader
        conversationCount={conversations.length}
        hasUnreadConversations={hasUnreadConversations}
        isMarkingAllRead={isMarkingAllRead}
        isLoading={isLoading}
        onMarkAllRead={onMarkAllRead}
        onRefresh={onRefresh}
      />
      <ConversationListFilters
        totalConversationCount={totalConversationCount}
        visibleConversationCount={conversations.length}
        searchQuery={searchQuery}
        conversationFilter={conversationFilter}
        filterCounts={filterCounts}
        hasActiveFilters={hasActiveFilters}
        isNarrowChat={isNarrowChat}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />

      {error && (
        <AdminErrorRecovery
          message={error}
          isLoading={isLoading}
          onRetry={onRefresh}
        />
      )}

      {isLoading && (
        <AdminLoadingText padded>Loading conversations...</AdminLoadingText>
      )}

      {!isLoading && !error && conversations.length === 0 && (
        <AdminEmptyState
          title="No conversations found"
          text="Try another search term or reset the filters."
        />
      )}

      <div
        style={{
          ...styles.list,
          ...(isCompactChat ? styles.listCompact : {}),
        }}
      >
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </aside>
  );
};

const styles = {
  panel: {
    width: "380px",
    minWidth: "320px",
    borderRight: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    display: "flex",
    flexDirection: "column" as const,
  },

  panelCompact: {
    width: "100%",
    minWidth: 0,
    borderRight: "none",
    borderBottom: `1px solid ${colors.border.default}`,
  },

  list: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto" as const,
  },

  listCompact: {
    maxHeight: "420px",
  },
};
