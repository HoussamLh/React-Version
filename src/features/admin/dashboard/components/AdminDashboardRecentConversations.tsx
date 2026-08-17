import React from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { AdminEmptyState, AdminPanel, AdminStatusBadge } from "../../components";
import { getAdminConversationVisitorLabel } from "../../chat/helpers/adminChat.helpers";
import { formatAdminShortDateTime } from "../../utils";
import type { AdminConversation } from "../../chat/types/adminChat.types";

type AdminDashboardRecentConversationsProps = {
  conversations: AdminConversation[];
  isLoading: boolean;
  isNarrow: boolean;
};

export const AdminDashboardRecentConversations: React.FC<
  AdminDashboardRecentConversationsProps
> = ({ conversations, isLoading, isNarrow }) => {
  const recentConversations = conversations.slice(0, 5);

  return (
    <AdminPanel>
      <div
        style={{
          ...styles.panelHeader,
          ...(isNarrow ? styles.panelHeaderNarrow : {}),
        }}
      >
        <div>
          <h3 style={styles.panelTitle}>Recent live chats</h3>
          <p style={styles.panelSubtitle}>
            Latest visitor conversations and unread messages.
          </p>
        </div>

        <Link to="/admin/chat" style={styles.panelLink}>
          View all
        </Link>
      </div>

      <div style={styles.list}>
        {!isLoading && recentConversations.length === 0 && (
          <AdminEmptyState
            title="No live chat conversations yet"
            text="New visitor conversations will appear here after someone starts a chat."
            actionLabel="Open chat inbox"
            actionTo="/admin/chat"
          />
        )}

        {recentConversations.map((conversation) => (
          <Link
            key={conversation.id}
            to="/admin/chat"
            style={styles.listItem}
          >
            <div style={styles.listTop}>
              <span style={styles.itemTitle}>
                {getAdminConversationVisitorLabel(conversation)}
              </span>

              <span style={styles.itemDate}>
                {formatAdminShortDateTime(conversation.lastMessageAt)}
              </span>
            </div>

            <p style={styles.itemText}>
              {conversation.lastMessageBody ?? "New conversation"}
            </p>

            <div style={styles.itemFooter}>
              <span style={styles.serviceBadge}>
                {conversation.chatMode === "offline"
                  ? "Offline message"
                  : "Live chat"}
              </span>

              <AdminStatusBadge>
                {conversation.unreadCount > 0
                  ? `${conversation.unreadCount} unread`
                  : conversation.status}
              </AdminStatusBadge>
            </div>
          </Link>
        ))}
      </div>
    </AdminPanel>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panelHeader: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
  },

  panelHeaderNarrow: {
    flexDirection: "column",
    gap: spacing.sm,
  },

  panelTitle: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  panelSubtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  panelLink: {
    color: colors.accent.green,
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: typography.fontWeight.bold,
    flexShrink: 0,
  },

  list: {
    display: "flex",
    flexDirection: "column",
  },

  listItem: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    textDecoration: "none",
    display: "block",
    minWidth: 0,
  },

  listTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  itemTitle: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },

  itemDate: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  itemText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  itemFooter: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },

  serviceBadge: {
    color: colors.text.main,
    backgroundColor: "rgba(255,255,255,0.05)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
  },
};
