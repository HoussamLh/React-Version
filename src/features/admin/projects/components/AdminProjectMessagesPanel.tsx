import React, { useCallback, useEffect, useState, useRef } from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

import { supabase } from "../../../../lib/supabase";

import {
  getAdminProjectMessages,
  sendAdminProjectMessage,
} from "../adminProjectMessages.service";

import type { AdminProjectMessage } from "../adminProjectMessages.service";

type AdminProjectMessagesPanelProps = {
  projectRequestId: string;
};

export const AdminProjectMessagesPanel: React.FC<
  AdminProjectMessagesPanelProps
> = ({ projectRequestId }) => {
  const [messages, setMessages] = useState<AdminProjectMessage[]>([]);

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadMessages = useCallback(async () => {
    return await getAdminProjectMessages(projectRequestId);
  }, [projectRequestId]);

  useEffect(() => {
    let isMounted = true;

    const initialise = async () => {
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

    window.setTimeout(() => {
      void initialise();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    const channel = client
      .channel(`admin-project-messages-${projectRequestId}`)
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

          const newMessage: AdminProjectMessage = {
            id: row.id,
            projectRequestId: row.project_request_id,
            senderId: row.sender_id,
            senderType: row.sender_type,
            message: row.message,
            createdAt: row.created_at,
            readAt: row.read_at,
          };

          setMessages((current) => {
            const alreadyExists = current.some(
              (item) => item.id === newMessage.id,
            );

            if (alreadyExists) {
              return current;
            }

            return [...current, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [projectRequestId]);

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
      await sendAdminProjectMessage(projectRequestId, message);

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

        {messages.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.message,

              ...(item.senderType === "admin"
                ? styles.adminMessage
                : styles.customerMessage),
            }}
          >
            <strong style={styles.sender}>
              {item.senderType === "admin" ? "DevBySam Team" : "Customer"}
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
          placeholder="Reply to customer..."
          onChange={(event) => setMessage(event.target.value)}
        />

        <button type="submit" style={styles.button} disabled={isSending}>
          {isSending ? "Sending..." : "Send Reply"}
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
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${colors.border.default}`,
  },

  adminMessage: {
    backgroundColor: "rgba(116,245,66,0.08)",
    border: `1px solid ${colors.accent.green}`,
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
    padding: spacing.md,
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
  },

  button: {
    alignSelf: "flex-end",
    backgroundColor: colors.accent.green,
    border: "none",
    borderRadius: radius.md,
    padding: "12px 20px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },

  error: {
    color: "#ff7777",
    fontSize: "13px",
  },
};
