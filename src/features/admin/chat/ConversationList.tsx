import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type {
  AdminConversation,
  AdminConversationStatus,
} from "./adminChat.types";

export type AdminConversationFilter =
  | "all"
  | AdminConversationStatus
  | "unread"
  | "offline";

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

const filterOptions: {
  label: string;
  value: AdminConversationFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
  { label: "Unread", value: "unread" },
  { label: "Offline", value: "offline" },
];

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
};

const getVisitorLabel = (conversation: AdminConversation) => {
  return (
    conversation.visitorName ??
    conversation.visitorEmail ??
    `Visitor ${conversation.visitorId.slice(0, 8)}`
  );
};

const getStatusStyle = (status: AdminConversationStatus) => {
  if (status === "open") {
    return {
      ...styles.status,
      color: colors.accent.green,
      borderColor: "rgba(147, 220, 92, 0.4)",
      backgroundColor: "rgba(147, 220, 92, 0.1)",
    };
  }

  if (status === "pending") {
    return {
      ...styles.status,
      color: "#93b5ff",
      borderColor: "rgba(147, 181, 255, 0.4)",
      backgroundColor: "rgba(147, 181, 255, 0.1)",
    };
  }

  return {
    ...styles.status,
    color: colors.text.muted,
    borderColor: colors.border.default,
    backgroundColor: "rgba(255,255,255,0.04)",
  };
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
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Conversations</h2>
          <p style={styles.subtitle}>Live chat inbox</p>
        </div>

        <div style={styles.headerActions}>
          <span style={styles.count}>{conversations.length}</span>

          {hasUnreadConversations && (
            <button
              type="button"
              style={{
                ...styles.markReadButton,
                ...(isMarkingAllRead || isLoading ? styles.disabledAction : {}),
              }}
              onClick={onMarkAllRead}
              disabled={isMarkingAllRead || isLoading}
            >
              {isMarkingAllRead ? "Marking..." : "Mark all read"}
            </button>
          )}

          <button
            type="button"
            style={{
              ...styles.refreshButton,
              ...(isLoading ? styles.disabledAction : {}),
            }}
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Refresh"}
          </button>
        </div>
      </div>

      <div
        style={{
          ...styles.searchArea,
          ...(isNarrowChat ? styles.searchAreaNarrow : {}),
        }}
      >
        <input
          type="search"
          value={searchQuery}
          placeholder="Search visitor, email, message..."
          style={styles.searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        {hasActiveFilters && (
          <button
            type="button"
            style={{
              ...styles.resetButton,
              ...(isNarrowChat ? styles.resetButtonNarrow : {}),
            }}
            onClick={onResetFilters}
          >
            Reset
          </button>
        )}
      </div>

      <div style={styles.filters}>
        {filterOptions.map((filter) => (
          <button
            key={filter.value}
            type="button"
            style={{
              ...styles.filterButton,
              ...(conversationFilter === filter.value
                ? styles.filterButtonActive
                : {}),
            }}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
            <span style={styles.filterCount}>{filterCounts[filter.value]}</span>
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <p style={styles.activeFilterText}>
          Showing {conversations.length} of {totalConversationCount}{" "}
          conversations.
        </p>
      )}

      {error && <p style={styles.errorText}>{error}</p>}

      {isLoading && <p style={styles.stateText}>Loading conversations...</p>}

      {!isLoading && conversations.length === 0 && (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No conversations found</h3>
          <p style={styles.emptyText}>
            Try another filter, reset search, or wait for new visitor messages.
          </p>
        </div>
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
          const visitorLabel = getVisitorLabel(conversation);

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
                    {formatDate(conversation.lastMessageAt)}
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
                <span style={getStatusStyle(conversation.status)}>
                  {conversation.status}
                </span>

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

  header: {
    minHeight: "72px",
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  title: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: "4px 0 0 0",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
    flexShrink: 0,
  },

  count: {
    color: colors.background.dark,
    backgroundColor: colors.accent.green,
    borderRadius: radius.pill,
    padding: "4px 9px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  markReadButton: {
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    borderRadius: radius.pill,
    backgroundColor: "rgba(147, 220, 92, 0.08)",
    color: colors.accent.green,
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  refreshButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.text.muted,
    padding: "6px 10px",
    fontSize: "11px",
    cursor: "pointer",
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  searchArea: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
  },

  searchAreaNarrow: {
    flexDirection: "column" as const,
  },

  searchInput: {
    width: "100%",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "11px 12px",
    fontSize: "13px",
    outline: "none",
  },

  resetButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: "0 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    flexShrink: 0,
  },

  resetButtonNarrow: {
    padding: "11px 12px",
  },

  filters: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.text.muted,
    padding: "7px 12px",
    fontSize: "12px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  filterButtonActive: {
    backgroundColor: "rgba(147, 220, 92, 0.12)",
    borderColor: colors.accent.green,
    color: colors.accent.green,
  },

  filterCount: {
    minWidth: "18px",
    height: "18px",
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
  },

  activeFilterText: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  errorText: {
    color: colors.accent.yellow,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    padding: spacing.lg,
  },

  emptyState: {
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "16px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
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

  status: {
    border: "1px solid",
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
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
