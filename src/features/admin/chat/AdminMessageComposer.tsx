import React from "react";
import { SendHorizontal } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
type AdminMessageComposerProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};
export const AdminMessageComposer: React.FC<AdminMessageComposerProps> = ({
  value,
  isSending,
  onChange,
  onTypingChange,
  onSubmit,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onChange(nextValue);
    onTypingChange(Boolean(nextValue.trim()));
  };
  return (
    <form style={styles.composer} onSubmit={onSubmit}>
      {" "}
      <input
        id="admin-chat-reply"
        name="admin-chat-reply"
        aria-label="Reply to visitor"
        autoComplete="off"
        style={styles.input}
        value={value}
        placeholder="Reply to visitor..."
        disabled={isSending}
        onChange={handleChange}
        onBlur={() => onTypingChange(false)}
      />{" "}
      <button
        type="submit"
        style={{ ...styles.button, opacity: isSending ? 0.55 : 1 }}
        disabled={isSending}
      >
        {" "}
        <SendHorizontal size={18} />{" "}
        <span>{isSending ? "Sending..." : "Send"}</span>{" "}
      </button>{" "}
    </form>
  );
};
const styles = {
  composer: {
    borderTop: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
  },
  input: {
    flex: 1,
    minWidth: 0,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
  },
  button: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "13px 18px",
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },
};
