import React from "react";
import { colors, spacing, typography } from "../../../../design-system";
import type { AdminConversation } from "../types/adminChat.types";
import { AdminMetaChip } from "../../components";
import { formatAdminDateTime } from "../../utils";

type AdminChatHeaderMetaProps = {
  conversation: AdminConversation;
};

export const AdminChatHeaderMeta: React.FC<AdminChatHeaderMetaProps> = ({
  conversation,
}) => {
  const hasVisitorEmail = Boolean(conversation.visitorEmail);

  return (
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
        {conversation.chatMode === "offline" ? "Offline enquiry" : "Live chat"}
      </AdminMetaChip>

      <AdminMetaChip>Source: {conversation.source}</AdminMetaChip>

      <AdminMetaChip>
        Last message: {formatAdminDateTime(conversation.lastMessageAt)}
      </AdminMetaChip>

      <AdminMetaChip>
        Visitor ID: {conversation.visitorId.slice(0, 8)}
      </AdminMetaChip>
    </div>
  );
};

const styles = {
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
};
