import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type { AdminConversation } from "./adminChat.types";

type ConversationListProps = {
  conversations: AdminConversation[];
  selectedConversationId: string | null;
  isLoading: boolean;
  onSelectConversation: (conversation: AdminConversation) => void;
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
};

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  isLoading,
  onSelectConversation,
}) => {
  return (
    <aside style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>Conversations</h2>
        <span style={styles.count}>{conversations.length}</span>
      </div>

      {isLoading && <p style={styles.stateText}>Loading conversations...</p>}

      {!isLoading && conversations.length === 0 && (
        <p style={styles.stateText}>No conversations yet.</p>
      )}

      <div style={styles.list}>
        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedConversationId;
          const hasUnread = conversation.unreadCount > 0;

          const visitorLabel =
            conversation.visitorName ??
            conversation.visitorEmail ??
            `Visitor ${conversation.visitorId.slice(0, 8)}`;

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
                      {conversation.unreadCount}
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

              <span style={styles.status}>{conversation.status}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const styles = {
  panel: {
    width: "340px",
    minWidth: "300px",
    borderRight: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    display: "flex",
    flexDirection: "column" as const,
  },

  header: {
    height: "72px",
    padding: `0 ${spacing.lg}`,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  count: {
    color: colors.background.dark,
    backgroundColor: colors.accent.green,
    borderRadius: radius.pill,
    padding: "4px 9px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    padding: spacing.lg,
  },

  list: {
    overflowY: "auto" as const,
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

  status: {
    color: colors.accent.green,
    fontSize: "11px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
};
