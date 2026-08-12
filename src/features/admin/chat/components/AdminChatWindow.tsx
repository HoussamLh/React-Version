import React, { useEffect, useRef } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminConversation,
  AdminConversationStatus,
} from "../types/adminChat.types";
import { useAdminChat } from "../hooks/useAdminChat";
import {
  AdminActionButton,
  AdminStatusBadge,
  AdminSuccessMessage,
  AdminMetaChip,
} from "../../components";
import { formatAdminDateTime } from "../../utils";
import { AdminMessageBubble } from "./AdminMessageBubble";
import { AdminMessageComposer } from "./AdminMessageComposer";
import {
  getConversationStatusTone,
  getAdminConversationVisitorLabel,
} from "../helpers/adminChat.helpers";

import { TypingIndicator } from "../../../../shared/components";

type AdminChatWindowProps = {
  conversation: AdminConversation | null;
  isCompactChat: boolean;
  isNarrowChat: boolean;
  onConversationUpdated: () => void;
};

const statusOptions: AdminConversationStatus[] = ["open", "pending", "closed"];


export const AdminChatWindow: React.FC<AdminChatWindowProps> = ({
  conversation,
  isCompactChat,
  isNarrowChat,
  onConversationUpdated,
}) => {

    const {
      messages,
      reply,
      isLoading,
      isSending,
      isUpdatingStatus,
      error,
      successMessage,
      isVisitorOnline,
      isVisitorTyping,
      setReply,
      handleTypingChange,
      handleStatusChange,
      handleSubmit,
    } = useAdminChat({
      conversation,
      onConversationUpdated,
    });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, isVisitorTyping]);

  if (!conversation) {
    return (
      <section
        style={{
          ...styles.emptyState,
          ...(isCompactChat ? styles.emptyStateCompact : {}),
        }}
      >
        <h2 style={styles.emptyTitle}>Select a conversation</h2>
        <p style={styles.emptyText}>
          Choose a visitor conversation from the inbox to view messages and
          reply.
        </p>
      </section>
    );
  }

  const visitorLabel = getAdminConversationVisitorLabel(conversation);
  const hasVisitorEmail = Boolean(conversation.visitorEmail);

  return (
    <section
      style={{
        ...styles.window,
        ...(isCompactChat ? styles.windowCompact : {}),
      }}
    >
      <header
        style={{
          ...styles.header,
          ...(isCompactChat ? styles.headerCompact : {}),
        }}
      >
        <div style={styles.headerMain}>
          <div style={styles.headerTitleRow}>
            <h2 style={styles.title}>{visitorLabel}</h2>

            <AdminStatusBadge
              tone={getConversationStatusTone(conversation.status)}
            >
              {conversation.status}
            </AdminStatusBadge>
          </div>

          <p style={styles.status}>
            {isVisitorOnline ? "Visitor online" : "Visitor offline"}
            {isVisitorTyping ? " · typing..." : ""}
          </p>

          <div style={styles.contactMeta}>
            {hasVisitorEmail && (
              <a
                href={`mailto:${conversation.visitorEmail}`}
                style={styles.contactLink}
              >
                {conversation.visitorEmail}
              </a>
            )}
            <AdminMetaChip>
              {conversation.chatMode === "offline"
                ? "Offline enquiry"
                : "Live chat"}
            </AdminMetaChip>
            <AdminMetaChip>Source: {conversation.source}</AdminMetaChip>
            <AdminMetaChip>
              {" "}
              Last message: {formatAdminDateTime(conversation.lastMessageAt)}
            </AdminMetaChip>
            <AdminMetaChip>
              Visitor ID: {conversation.visitorId.slice(0, 8)}
            </AdminMetaChip>
          </div>
        </div>

        <div
          style={{
            ...styles.headerActions,
            ...(isCompactChat ? styles.headerActionsCompact : {}),
          }}
        >
          <select
            value={conversation.status}
            disabled={isUpdatingStatus}
            style={{
              ...styles.statusSelect,
              ...(isNarrowChat ? styles.statusSelectNarrow : {}),
              ...(isUpdatingStatus ? styles.disabledAction : {}),
            }}
            onChange={(event) =>
              handleStatusChange(event.target.value as AdminConversationStatus)
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div
            style={{
              ...styles.quickActions,
              ...(isCompactChat ? styles.quickActionsCompact : {}),
              ...(isNarrowChat ? styles.quickActionsNarrow : {}),
            }}
          >
            {conversation.status !== "open" && (
              <AdminActionButton
                variant="primary"
                disabled={isUpdatingStatus}
                fullWidth={isNarrowChat}
                onClick={() => handleStatusChange("open")}
              >
                Open
              </AdminActionButton>
            )}

            {conversation.status !== "pending" && (
              <AdminActionButton
                variant="secondary"
                disabled={isUpdatingStatus}
                fullWidth={isNarrowChat}
                onClick={() => handleStatusChange("pending")}
              >
                Pending
              </AdminActionButton>
            )}

            {conversation.status !== "closed" && (
              <AdminActionButton
                variant="secondary"
                disabled={isUpdatingStatus}
                fullWidth={isNarrowChat}
                onClick={() => handleStatusChange("closed")}
              >
                Close
              </AdminActionButton>
            )}
          </div>
        </div>
      </header>

      <div
        style={{
          ...styles.body,
          ...(isCompactChat ? styles.bodyCompact : {}),
        }}
      >
        {isLoading && <p style={styles.stateText}>Loading messages...</p>}

        {!isLoading && messages.length === 0 && (
          <p style={styles.stateText}>No messages in this conversation yet.</p>
        )}

        {messages.map((message) => (
          <AdminMessageBubble key={message.id} message={message} />
        ))}

        {isVisitorTyping && <TypingIndicator label="Visitor is typing" />}

        {error && <p style={styles.error}>{error}</p>}
        {successMessage && (
          <AdminSuccessMessage>{successMessage}</AdminSuccessMessage>
        )}

        <div ref={bottomRef} />
      </div>

      <AdminMessageComposer
        value={reply}
        isSending={isSending}
        onChange={setReply}
        onTypingChange={handleTypingChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

const styles = {
  window: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: colors.background.dark,
  },

  header: {
    minHeight: "112px",
    borderBottom: `1px solid ${colors.border.default}`,
    padding: spacing.lg,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
  },

  headerMain: {
    minWidth: 0,
  },

  headerTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    flexWrap: "wrap" as const,
  },

  title: {
    color: colors.text.main,
    fontSize: "20px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  status: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: `${spacing.xs} 0 0 0`,
  },

  contactMeta: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
    marginTop: spacing.md,
  },

  contactLink: {
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
    overflowWrap: "anywhere" as const,
  },

  headerActions: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: spacing.sm,
    flexShrink: 0,
  },

  statusSelect: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    textTransform: "capitalize" as const,
    outline: "none",
    boxSizing: "border-box" as const,
  },

  quickActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  body: {
    flex: 1,
    overflowY: "auto" as const,
    padding: spacing.lg,
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "13px",
    margin: 0,
  },

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

  windowCompact: {
    minHeight: "620px",
  },

  headerCompact: {
    minHeight: "auto",
    flexDirection: "column" as const,
  },

  headerActionsCompact: {
    width: "100%",
    alignItems: "flex-start",
  },

  statusSelectNarrow: {
    width: "100%",
  },

  quickActionsCompact: {
    justifyContent: "flex-start",
  },

  quickActionsNarrow: {
    width: "100%",
    flexDirection: "column" as const,
    alignItems: "stretch",
  },

  bodyCompact: {
    minHeight: "420px",
  },

  emptyStateCompact: {
    minHeight: "420px",
  },
};
