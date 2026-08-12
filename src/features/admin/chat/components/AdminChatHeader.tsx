import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminConversation,
  AdminConversationStatus,
} from "../types/adminChat.types";
import {
  AdminActionButton,
  AdminStatusBadge,
  AdminMetaChip,
} from "../../components";
import { formatAdminDateTime } from "../../utils";
import {
  getConversationStatusTone,
  getAdminConversationVisitorLabel,
} from "../helpers/adminChat.helpers";

type AdminChatHeaderProps = {
  conversation: AdminConversation;
  isCompactChat: boolean;
  isNarrowChat: boolean;
  isUpdatingStatus: boolean;
  isVisitorOnline: boolean;
  isVisitorTyping: boolean;
  onStatusChange: (status: AdminConversationStatus) => void | Promise<void>;
};

const statusOptions: AdminConversationStatus[] = ["open", "pending", "closed"];

export const AdminChatHeader: React.FC<AdminChatHeaderProps> = ({
  conversation,
  isCompactChat,
  isNarrowChat,
  isUpdatingStatus,
  isVisitorOnline,
  isVisitorTyping,
  onStatusChange,
}) => {
  const visitorLabel = getAdminConversationVisitorLabel(conversation);
  const hasVisitorEmail = Boolean(conversation.visitorEmail);

  return (
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
            onStatusChange(event.target.value as AdminConversationStatus)
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
              onClick={() => onStatusChange("open")}
            >
              Open
            </AdminActionButton>
          )}

          {conversation.status !== "pending" && (
            <AdminActionButton
              variant="secondary"
              disabled={isUpdatingStatus}
              fullWidth={isNarrowChat}
              onClick={() => onStatusChange("pending")}
            >
              Pending
            </AdminActionButton>
          )}

          {conversation.status !== "closed" && (
            <AdminActionButton
              variant="secondary"
              disabled={isUpdatingStatus}
              fullWidth={isNarrowChat}
              onClick={() => onStatusChange("closed")}
            >
              Close
            </AdminActionButton>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
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
};
