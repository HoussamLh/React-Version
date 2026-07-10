import React, { useEffect, useRef, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { getCurrentAdminProfile } from "../auth/adminAuth.service";
import {
  createAdminRealtimeChannel,
  getAdminConversationMessages,
  sendAdminMessage,
  subscribeToAdminConversationMessages,
  updateConversationStatus,
} from "./adminChat.service";
import type {
  AdminConversation,
  AdminConversationStatus,
  AdminMessage,
} from "./adminChat.types";
import {
  AdminActionButton,
  AdminStatusBadge,
  AdminSuccessMessage,
  AdminMetaChip,
} from "../components";
import { formatAdminDateTime } from "../utils";
import { AdminMessageBubble } from "./AdminMessageBubble";
import { AdminMessageComposer } from "./AdminMessageComposer";
import { getConversationStatusTone } from "./adminChat.helpers";

type AdminChatWindowProps = {
  conversation: AdminConversation | null;
  isCompactChat: boolean;
  isNarrowChat: boolean;
  onConversationUpdated: () => void;
};

const statusOptions: AdminConversationStatus[] = ["open", "pending", "closed"];

const appendUniqueMessage = (
  currentMessages: AdminMessage[],
  nextMessage: AdminMessage,
) => {
  const exists = currentMessages.some(
    (message) => message.id === nextMessage.id,
  );

  if (exists) {
    return currentMessages;
  }

  return [...currentMessages, nextMessage];
};

const getVisitorLabel = (conversation: AdminConversation) => {
  return (
    conversation.visitorName ??
    conversation.visitorEmail ??
    `Visitor ${conversation.visitorId.slice(0, 8)}`
  );
};

export const AdminChatWindow: React.FC<AdminChatWindowProps> = ({
  conversation,
  isCompactChat,
  isNarrowChat,
  onConversationUpdated,
}) => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisitorOnline, setIsVisitorOnline] = useState(false);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const realtimeRef = useRef<{
    sendTypingStatus: (isTyping: boolean) => Promise<void>;
    unsubscribe: () => void;
  } | null>(null);

  const conversationId = conversation?.id ?? null;
  const conversationStatus = conversation?.status ?? null;

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(async () => {
      if (!conversationId) {
        if (isMounted) {
          setMessages([]);
          setReply("");
          setError("");
        }

        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const nextMessages = await getAdminConversationMessages(conversationId);

        if (!isMounted) return;

        setMessages(nextMessages);
      } catch {
        if (!isMounted) return;

        setError("Could not load messages.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToAdminConversationMessages({
      conversationId,
      onMessage: (nextMessage) => {
        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, nextMessage),
        );
        onConversationUpdated();
      },
    });

    return unsubscribe;
  }, [conversationId, onConversationUpdated]);

  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;

    void Promise.resolve().then(async () => {
      const adminProfile = await getCurrentAdminProfile();

      if (!isMounted || !adminProfile) return;

      const realtime = createAdminRealtimeChannel({
        conversationId,
        adminId: adminProfile.id,
        onVisitorTypingChange: setIsVisitorTyping,
        onPresenceChange: setIsVisitorOnline,
      });

      realtimeRef.current = realtime;
    });

    return () => {
      isMounted = false;

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      realtimeRef.current?.unsubscribe();
      realtimeRef.current = null;
      setIsVisitorOnline(false);
      setIsVisitorTyping(false);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isVisitorTyping]);

  const handleTypingChange = (isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    void realtimeRef.current?.sendTypingStatus(isTyping);

    if (!isTyping) return;

    typingTimeoutRef.current = window.setTimeout(() => {
      void realtimeRef.current?.sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500);
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 2200);
  };

  const handleStatusChange = async (status: AdminConversationStatus) => {
    if (!conversationId || conversationStatus === status) return;

    if (status === "closed") {
      const confirmed = window.confirm(
        "Are you sure you want to close this live chat conversation?",
      );

      if (!confirmed) return;
    }

    setIsUpdatingStatus(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateConversationStatus({
        conversationId,
        status,
      });

      onConversationUpdated();
      showSuccessMessage(`Conversation marked as ${status}.`);
    } catch {
      setError("Could not update conversation status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!conversationId || !trimmedReply) return;

    setIsSending(true);
    setError("");

    try {
      await realtimeRef.current?.sendTypingStatus(false);

      const nextMessage = await sendAdminMessage({
        conversationId,
        body: trimmedReply,
      });

      setMessages((currentMessages) =>
        appendUniqueMessage(currentMessages, nextMessage),
      );

      setReply("");

      if (conversationStatus !== "open") {
        await updateConversationStatus({ conversationId, status: "open" });
      }

      onConversationUpdated();
    } catch {
      setError("Could not send reply.");
    } finally {
      setIsSending(false);
    }
  };

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

  const visitorLabel = getVisitorLabel(conversation);
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

        {isVisitorTyping && (
          <div style={styles.typingIndicator}>
            <span className="typing-dot-delay-1" style={styles.typingDot} />
            <span className="typing-dot-delay-2" style={styles.typingDot} />
            <span style={styles.typingDot} />
          </div>
        )}

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

  typingIndicator: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: "18px 18px 18px 6px",
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
  },

  typingDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: colors.text.muted,
    display: "block",
    animation: "liveChatTypingDot 1.4s infinite ease-in-out both",
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
