import React from "react";
import { 
  colors, 
  radius, 
  spacing, 
  typography, 
} from "../../../../design-system";
import {
  AdminEmptyState,
  AdminErrorRecovery,
  AdminStatusBadge,
  AdminLoadingText,
} from "../../components";
import { 
  formatAdminTimeWithDate 
} from "../../utils";
import type {
  AdminConversation
} from "../types/adminChat.types";
import {
  getConversationStatusTone,
  getAdminConversationVisitorLabel,
} from "../helpers/adminChat.helpers";
import { 
  ConversationListHeader 
} from "./ConversationListHeader";
import { 
  ConversationListFilters 
} from "./ConversationListFilters";
import type { 
  AdminConversationFilter 
} from "./ConversationListFilters";

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
        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedConversationId;
          const hasUnread = conversation.unreadCount > 0;
          const visitorLabel = getAdminConversationVisitorLabel(conversation);

          return (
            <button
              key={conversation.id}
              type="button"
              style={{
                ...styles.item,
                ...(isActive ? styles.itemActive : {}),
                ...(hasUnread ? styles.itemUnread : {}),
              }}
              onClick={() => onSelectConversation(conversation)}
            >
              <div style={styles.itemTop}>
                <span
                  style={{
                    ...styles.visitorName,
                    ...(hasUnread ? styles.visitorNameUnread : {}),
                  }}
                >
                  {visitorLabel}
                </span>

                <div style={styles.itemMeta}>
                  {hasUnread && (
                    <span style={styles.unreadBadge}>
                      {conversation.unreadCount > 99
                        ? "99+"
                        : conversation.unreadCount}
                    </span>
                  )}

                  <span style={styles.time}>
                    {formatAdminTimeWithDate(conversation.lastMessageAt)}
                  </span>
                </div>
              </div>

              <p
                style={{
                  ...styles.preview,
                  ...(hasUnread ? styles.previewUnread : {}),
                }}
              >
                {conversation.lastMessageBody ?? "New conversation"}
              </p>

              <div style={styles.itemFooter}>
                <AdminStatusBadge
                  tone={getConversationStatusTone(conversation.status)}
                >
                  {conversation.status}
                </AdminStatusBadge>

                <span style={styles.modeBadge}>
                  {conversation.chatMode === "offline"
                    ? "Offline"
                    : "Live chat"}
                </span>
              </div>
            </button>
          );
        })}
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

  item: {
    width: "100%",
    border: "none",
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    textAlign: "left" as const,
    padding: spacing.lg,
    cursor: "pointer",
    boxSizing: "border-box" as const,
  },

  itemActive: {
    backgroundColor: "rgba(147, 220, 92, 0.08)",
  },

  itemUnread: {
    backgroundColor: "rgba(255, 155, 196, 0.06)",
  },

  itemTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  visitorName: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    minWidth: 0,
  },

  visitorNameUnread: {
    color: colors.text.main,
    fontWeight: typography.fontWeight.black,
  },

  itemMeta: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 0,
  },

  unreadBadge: {
    minWidth: "20px",
    height: "20px",
    borderRadius: "999px",
    backgroundColor: colors.accent.pink,
    color: colors.text.main,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: typography.fontWeight.black,
  },

  time: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  preview: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },

  previewUnread: {
    color: colors.text.main,
    fontWeight: typography.fontWeight.bold,
  },

  itemFooter: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  modeBadge: {
    color: colors.text.muted,
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
  },
};
