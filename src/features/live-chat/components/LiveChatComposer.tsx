import React from "react";
import { SendHorizontal, Smile } from "lucide-react";
import { colors, radius, spacing } from "../../../design-system";

type LiveChatComposerProps = {
  message: string;
  messagePlaceholder: string;
  isSending: boolean;
  isComposerDisabled: boolean;
  onMessageChange: (value: string) => void;
  onMessageBlur: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export const LiveChatComposer: React.FC<LiveChatComposerProps> = ({
  message,
  messagePlaceholder,
  isSending,
  isComposerDisabled,
  onMessageChange,
  onMessageBlur,
  onSubmit,
}) => {
  return (
    <form style={styles.composer} onSubmit={onSubmit}>
      <div style={styles.messageInputRow}>
        <input
          id="visitor-chat-message"
          name="visitor-chat-message"
          aria-label="Message"
          autoComplete="off"
          style={styles.messageInput}
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          onBlur={onMessageBlur}
          placeholder={messagePlaceholder}
          disabled={isComposerDisabled}
        />

        <Smile size={18} color={colors.text.muted} />

        <button
          type="submit"
          style={{
            ...styles.roundSendButton,
            opacity: isSending || isComposerDisabled ? 0.55 : 1,
          }}
          disabled={isComposerDisabled}
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </form>
  );
};

const styles = {
  composer: {
    margin: spacing.lg,
    border: `2px solid ${colors.accent.pink}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    overflow: "hidden",
  },

  messageInputRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
  },

  messageInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    padding: spacing.sm,
    outline: "none",
    fontSize: "14px",
  },

  roundSendButton: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(147, 220, 92, 0.16)",
    color: colors.accent.green,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
};
