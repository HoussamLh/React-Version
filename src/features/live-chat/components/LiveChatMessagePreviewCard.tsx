import React from "react";
import { colors, spacing, typography } from "../../../design-system";
import { liveChatAgent } from "../data/liveChat.data";
import { LiveChatAgentAvatar } from "./LiveChatAgentAvatar";

type LiveChatMessagePreviewCardProps = {
  previewText: string;
  previewTime: string;
  isAdminOnline: boolean;
  onClick: () => void;
};

export const LiveChatMessagePreviewCard: React.FC<
  LiveChatMessagePreviewCardProps
> = ({ previewText, previewTime, isAdminOnline, onClick }) => {
  return (
    <button type="button" style={styles.messagePreview} onClick={onClick}>
      <LiveChatAgentAvatar />

      <div style={styles.previewContent}>
        <div style={styles.previewTopRow}>
          <div style={styles.agentInfo}>
            <span style={styles.previewName}>{liveChatAgent.name}</span>

            <span
              style={{
                ...styles.onlineStatus,
                color: isAdminOnline ? colors.accent.green : colors.text.muted,
              }}
            >
              {isAdminOnline ? "Online" : "Offline"}
            </span>
          </div>

          <span style={styles.previewTime}>{previewTime}</span>
        </div>

        <p style={styles.previewText}>{previewText}</p>
      </div>
    </button>
  );
};

const styles = {
  messagePreview: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    padding: `${spacing.md} 0`,
    borderBottom: `1px solid ${colors.border.default}`,
    cursor: "pointer",
    textAlign: "left" as const,
  },

  previewContent: {
    flex: 1,
    minWidth: 0,
  },

  previewTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  agentInfo: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },

  previewName: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
  },

  onlineStatus: {
    fontSize: "11px",
  },

  previewTime: {
    color: colors.text.muted,
    fontSize: "12px",
  },

  previewText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: "4px 0 0 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
};
