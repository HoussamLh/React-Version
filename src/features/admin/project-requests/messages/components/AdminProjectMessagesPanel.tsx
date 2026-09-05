import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../../design-system";
import { AdminProjectMessagesComposer } from "./AdminProjectMessagesComposer";
import { AdminProjectMessagesItem } from "./AdminProjectMessagesItem";
import { useAdminProjectMessages } from "../hooks/useAdminProjectMessages";

type AdminProjectMessagesPanelProps = {
  projectRequestId: string;
  onMessagesRead?: () => void;
};

export const AdminProjectMessagesPanel: React.FC<
  AdminProjectMessagesPanelProps
> = ({ projectRequestId, onMessagesRead }) => {
  const {
    messages,
    message,
    setMessage,
    images,
    files,
    setImages,
    setFiles,
    isLoading,
    isSending,
    error,
    setError,
    messagesEndRef,
    handleSend,
  } = useAdminProjectMessages(projectRequestId, onMessagesRead);

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Project Messages</h2>

      <div style={styles.messages}>
        {isLoading && <p style={styles.muted}>Loading messages...</p>}
        {!isLoading && messages.length === 0 && (
          <p style={styles.muted}>No messages yet.</p>
        )}

        {messages.map((item) => (
          <AdminProjectMessagesItem key={item.id} message={item} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <AdminProjectMessagesComposer
        value={message}
        images={images}
        files={files}
        isSending={isSending}
        onChange={setMessage}
        onImagesChange={setImages}
        onFilesChange={setFiles}
        onError={setError}
        onSubmit={handleSend}
      />
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
  },
  title: {
    color: colors.text.main,
    fontSize: "22px",
    fontWeight: typography.fontWeight.black,
    marginBottom: spacing.lg,
  },
  messages: { 
    display: "flex", 
    flexDirection: "column", 
    gap: spacing.md 
  },
  muted: { color: colors.text.muted },
  error: { color: "#ff7777", fontSize: "13px" },
};
