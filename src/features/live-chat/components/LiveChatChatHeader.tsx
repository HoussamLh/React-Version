import React from "react";
import { ChevronLeft, MoreHorizontal, X } from "lucide-react";
import { colors, spacing, typography } from "../../../design-system";
import { liveChatAgent } from "../data/liveChat.data";
import type { LiveChatAvailabilityMode } from "../types/liveChat.types";
import { LiveChatAgentAvatar } from "./LiveChatAgentAvatar";
import { LiveChatIconButton } from "./LiveChatIconButton";
import { LiveChatOptionsMenu } from "./LiveChatOptionsMenu";

type LiveChatChatHeaderProps = {
  chatMode: LiveChatAvailabilityMode;
  isOptionsOpen: boolean;
  isExpanded: boolean;
  onBack: () => void;
  onClose: () => void;
  onToggleOptions: () => void;
  onToggleExpanded: () => void;
  onDownloadTranscript: () => void;
};

export const LiveChatChatHeader: React.FC<LiveChatChatHeaderProps> = ({
  chatMode,
  isOptionsOpen,
  isExpanded,
  onBack,
  onClose,
  onToggleOptions,
  onToggleExpanded,
  onDownloadTranscript,
}) => {
  const statusText =
    chatMode === "online" ? "Online now" : "Offline — leave a message";

  return (
    <div style={styles.chatHeader}>
      <LiveChatIconButton ariaLabel="Back to messages" onClick={onBack}>
        <ChevronLeft size={20} />
      </LiveChatIconButton>

      <div style={styles.agentBlock}>
        <LiveChatAgentAvatar />

        <div>
          <h3 style={styles.agentName}>{liveChatAgent.name}</h3>

          <p
            style={{
              ...styles.agentStatus,
              color:
                chatMode === "online" ? colors.accent.green : colors.text.muted,
            }}
          >
            {statusText}
          </p>
        </div>
      </div>

      <div style={styles.chatHeaderActions}>
        <div style={styles.menuWrapper}>
          <LiveChatIconButton
            ariaLabel="Open chat options"
            onClick={onToggleOptions}
          >
            <MoreHorizontal size={20} />
          </LiveChatIconButton>

          {isOptionsOpen && (
            <LiveChatOptionsMenu
              isExpanded={isExpanded}
              onToggleExpanded={onToggleExpanded}
              onDownloadTranscript={onDownloadTranscript}
            />
          )}
        </div>

        <LiveChatIconButton ariaLabel="Close live chat" onClick={onClose}>
          <X size={18} />
        </LiveChatIconButton>
      </div>
    </div>
  );
};

const styles = {
  chatHeader: {
    height: "58px",
    borderBottom: `1px solid ${colors.border.default}`,
    display: "grid",
    gridTemplateColumns: "36px 1fr auto",
    alignItems: "center",
    gap: spacing.sm,
    padding: `0 ${spacing.md}`,
    backgroundColor: colors.background.card,
  },

  agentBlock: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },

  agentName: {
    color: colors.text.main,
    fontSize: "15px",
    lineHeight: "18px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  agentStatus: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    margin: 0,
  },

  chatHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },

  menuWrapper: {
    position: "relative" as const,
  },
};
