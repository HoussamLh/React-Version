import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../../../design-system";
import { supabase } from "../../../../../lib/supabase";

import {
  getCustomerProjectMessages,
  sendCustomerProjectMessage,
} from "../customerProjectMessages.service";

import type { CustomerProjectMessage } from "../customerProjectMessages.types";

type ProjectMessagesPanelProps = {
  projectRequestId: string;
};

export const ProjectMessagesPanel: React.FC<ProjectMessagesPanelProps> = ({
  projectRequestId,
}) => {
  const [messages, setMessages] = useState<CustomerProjectMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadMessages = useCallback(async () => {
    return await getCustomerProjectMessages(projectRequestId);
  }, [projectRequestId]);

  // Load existing messages
  useEffect(() => {
    let isMounted = true;

    const initialiseMessages = async () => {
      try {
        const result = await loadMessages();

        if (!isMounted) {
          return;
        }

        setMessages(result);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setError(
          error instanceof Error ? error.message : "Could not load messages.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialiseMessages();

    return () => {
      isMounted = false;
    };
  }, [loadMessages]);

  // Supabase realtime listener
  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    const channel = client
      .channel(`project-messages-${projectRequestId}`)

      // New message
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_messages",
          filter: `project_request_id=eq.${projectRequestId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            project_request_id: string;
            sender_id: string;
            sender_type: "customer" | "admin";
            message: string;
            created_at: string;
            read_at: string | null;
          };

          const newMessage: CustomerProjectMessage = {
            id: row.id,
            projectRequestId: row.project_request_id,
            senderId: row.sender_id,
            senderType: row.sender_type,
            message: row.message,
            createdAt: row.created_at,
            readAt: row.read_at,
          };

          setMessages((current) => {
            const exists = current.some((item) => item.id === newMessage.id);

            if (exists) {
              return current;
            }

            return [...current, newMessage];
          });
        },
      )

      // Message read status update
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "project_messages",
          filter: `project_request_id=eq.${projectRequestId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            read_at: string | null;
          };

          setMessages((current) =>
            current.map((item) =>
              item.id === row.id
                ? {
                    ...item,
                    readAt: row.read_at,
                  }
                : item,
            ),
          );
        },
      )

      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [projectRequestId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setIsSending(true);
    setError("");

    try {
      await sendCustomerProjectMessage(projectRequestId, message);

      setMessage("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not send message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Project Messages</h2>

      <div style={styles.messages}>
        {isLoading && <p style={styles.muted}>Loading messages...</p>}

        {!isLoading && messages.length === 0 && (
          <p style={styles.muted}>No messages yet.</p>
        )}

        {messages.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.message,
              ...(item.senderType === "customer"
                ? styles.customerMessage
                : styles.teamMessage),
            }}
          >
            <strong style={styles.sender}>
              {item.senderType === "customer" ? "You" : "DevBySam Team"}
            </strong>

            <p style={styles.text}>{item.message}</p>

            <span style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <form style={styles.form} onSubmit={handleSend}>
        <textarea
          style={styles.input}
          value={message}
          placeholder="Write a message..."
          onChange={(event) => setMessage(event.target.value)}
        />

        <button type="submit" style={styles.button} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
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
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },

  message: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },

  customerMessage: {
    backgroundColor: "rgba(116,245,66,0.08)",
    border: `1px solid ${colors.accent.green}`,
  },

  teamMessage: {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${colors.border.default}`,
  },

  sender: {
    color: colors.text.main,
    fontSize: "13px",
  },

  text: {
    color: colors.text.muted,
    lineHeight: "22px",
  },

  date: {
    color: colors.text.muted,
    fontSize: "11px",
  },

  muted: {
    color: colors.text.muted,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  input: {
    minHeight: "100px",
    resize: "vertical",
    padding: spacing.md,
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
  },

  button: {
    alignSelf: "flex-end",
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "12px 20px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },

  error: {
    color: "#ff7777",
    fontSize: "13px",
  },
};
