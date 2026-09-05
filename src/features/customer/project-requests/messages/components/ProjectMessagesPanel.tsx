import React from "react";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../../design-system";
import { ProjectMessageComposer } from "./ProjectMessageComposer";
import { ProjectMessageItem } from "./ProjectMessageItem";
import { useProjectMessages } from "../../hooks/useProjectMessages";

type ProjectMessagesPanelProps = { projectRequestId: string };

export const ProjectMessagesPanel: React.FC<ProjectMessagesPanelProps> = ({ 
  projectRequestId }) => {
  const {
    messages,
    message,
    setMessage,
    isLoading,
    isSending,
    error,
    setError,
    messagesEndRef,
    handleSend,
    images,
    files,
    setImages,
    setFiles,
  } = useProjectMessages(projectRequestId);

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Project Messages</h2>
      <div style={styles.messages}>
        {isLoading && <p style={styles.muted}>Loading messages...</p>}
        {!isLoading && messages.length === 0 && (
          <p style={styles.muted}>No messages yet.</p>
        )}
        {messages.map((item) => (
          <ProjectMessageItem key={item.id} message={item} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <ProjectMessageComposer
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
    marginTop: spacing.xl,
  },
  title: {
    color: colors.text.main,
    fontSize: "22px",
    fontWeight: typography.fontWeight.black,
    marginBottom: spacing.lg,
  },
  messages: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: spacing.md,
  },
  muted: {
    color: colors.text.muted,
  },
  error: {
    color: "#ff7777",
    fontSize: "13px",
  },
};
