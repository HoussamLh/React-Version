import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { getCustomerProjectMessages, sendCustomerProjectMessage } from "../messages/ProjectRequestsMessages.service";
import type { CustomerProjectMessage } from "../messages/ProjectRequestsMessages.types";

export const useProjectMessages = (projectRequestId: string) => {
  const [messages, setMessages] = useState<CustomerProjectMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadMessages = useCallback(async () => getCustomerProjectMessages(projectRequestId), [projectRequestId]);

  useEffect(() => {
    let isMounted = true;
    const initialise = async () => {
      try {
        setMessages(await loadMessages());
      } catch (error) {
        if (isMounted) setError(error instanceof Error ? error.message : "Could not load messages.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void initialise();
    return () => { isMounted = false; };
  }, [loadMessages]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const channel = client
      .channel(`project-messages-${projectRequestId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "project_messages", filter: `project_request_id=eq.${projectRequestId}` }, (payload) => {
        const row = payload.new as CustomerProjectMessageRow;
        const next: CustomerProjectMessage = { id: row.id, projectRequestId: row.project_request_id, senderId: row.sender_id, senderType: row.sender_type, message: row.message, createdAt: row.created_at, readAt: row.read_at };
        setMessages((current) => current.some((item) => item.id === next.id) ? current : [...current, next]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "project_messages", filter: `project_request_id=eq.${projectRequestId}` }, (payload) => {
        const row = payload.new as Pick<CustomerProjectMessageRow, "id" | "read_at">;
        setMessages((current) => current.map((item) => item.id === row.id ? { ...item, readAt: row.read_at } : item));
      })
      .subscribe();
    return () => { void client.removeChannel(channel); };
  }, [projectRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    setError("");
    try {
      await sendCustomerProjectMessage(projectRequestId, message);
      setMessage("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not send message.");
    } finally {
      setIsSending(false);
    }
  };

  return { messages, message, setMessage, isLoading, isSending, error, messagesEndRef, handleSend };
};

type CustomerProjectMessageRow = {
  id: string; project_request_id: string; sender_id: string;
  sender_type: "customer" | "admin"; message: string; created_at: string; read_at: string | null;
};
