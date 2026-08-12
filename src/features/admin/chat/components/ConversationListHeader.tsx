import React from "react";
import { spacing } from "../../../../design-system";
import {
  AdminActionButton,
  AdminCountBadge,
  AdminPanelHeader,
} from "../../components";

type ConversationListHeaderProps = {
  conversationCount: number;
  hasUnreadConversations: boolean;
  isMarkingAllRead: boolean;
  isLoading: boolean;
  onMarkAllRead: () => void;
  onRefresh: () => void;
};

export const ConversationListHeader: React.FC<ConversationListHeaderProps> = ({
  conversationCount,
  hasUnreadConversations,
  isMarkingAllRead,
  isLoading,
  onMarkAllRead,
  onRefresh,
}) => {
  return (
    <AdminPanelHeader
      title="Conversations"
      subtitle="Live chat inbox"
      actions={
        <div style={styles.headerActions}>
          <AdminCountBadge count={conversationCount} />

          {hasUnreadConversations && (
            <AdminActionButton
              variant="successGhost"
              size="sm"
              disabled={isMarkingAllRead || isLoading}
              onClick={onMarkAllRead}
            >
              {isMarkingAllRead ? "Marking..." : "Mark all read"}
            </AdminActionButton>
          )}

          <AdminActionButton
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={onRefresh}
          >
            {isLoading ? "..." : "Refresh"}
          </AdminActionButton>
        </div>
      }
    />
  );
};

const styles = {
  headerActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
    flexShrink: 0,
  },
};
