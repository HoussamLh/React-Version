import React from "react";
import { colors, radius, spacing } from "../../../../design-system";

type AdminChatEmptyStateProps = {
  isCompactChat: boolean;
};

export const AdminChatEmptyState: React.FC<AdminChatEmptyStateProps> = ({
  isCompactChat,
}) => {
  return (
    <section
      style={{
        ...styles.emptyState,
        ...(isCompactChat ? styles.emptyStateCompact : {}),
      }}
    >
      <h2 style={styles.emptyTitle}>Select a conversation</h2>

      <p style={styles.emptyText}>
        Choose a visitor conversation from the inbox to view messages and reply.
      </p>
    </section>
  );
};

const styles = {
  emptyState: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "24px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    maxWidth: "360px",
  },

  emptyStateCompact: {
    minHeight: "420px",
  },
};
