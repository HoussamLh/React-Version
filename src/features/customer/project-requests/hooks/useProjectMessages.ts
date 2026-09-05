import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  getCustomerProjectMessages,
  sendCustomerProjectMessageWithMedia,
} from "../messages/ProjectRequestsMessages.service";
import type { CustomerProjectMessage } from "../messages/ProjectRequestsMessages.types";

export const useProjectMessages = (projectRequestId: string) => {
  const [messages, setMessages] = useState<CustomerProjectMessage[]>([]);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadMessages = useCallback(async () => {
    return getCustomerProjectMessages(projectRequestId);
  }, [projectRequestId]);

  useEffect(() => {
    let isMounted = true;
    const initialise = async () => {
      try {
        const result = await loadMessages();
        if (isMounted) setMessages(result);
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load messages.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    const timer = window.setTimeout(() => void initialise(), 0);
    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const channel = client
      .channel(`customer-project-messages-${projectRequestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_messages",
          filter: `project_request_id=eq.${projectRequestId}`,
        },
        (payload) => {
          const row = payload.new as CustomerProjectMessageRow;
          const next: CustomerProjectMessage = {
            id: row.id,
            projectRequestId: row.project_request_id,
            senderId: row.sender_id,
            senderType: row.sender_type,
            message: row.message,
            createdAt: row.created_at,
            readAt: row.read_at,
            media: [],
          };
          setMessages((current) =>
            current.some((item) => item.id === next.id)
              ? current
              : [...current, next],
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "project_messages",
          filter: `project_request_id=eq.${projectRequestId}`,
        },
        (payload) => {
          const row = payload.new as Pick<
            CustomerProjectMessageRow,
            "id" | "read_at"
          >;
          setMessages((current) =>
            current.map((item) =>
              item.id === row.id ? { ...item, readAt: row.read_at } : item,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_message_media",
          filter: `project_request_id=eq.${projectRequestId}`,
        },
        (payload) => {
          const row = payload.new as ProjectMessageMediaRow;
          const media = mapMediaRow(row);
          setMessages((current) =>
            current.map((item) =>
              item.id !== media.messageId ||
              item.media.some((existing) => existing.id === media.id)
                ? item
                : { ...item, media: [...item.media, media] },
            ),
          );
        },
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [projectRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim() && images.length === 0 && files.length === 0) {
      return;
    }

    setIsSending(true);
    setError("");

    try {
      await sendCustomerProjectMessageWithMedia({
        projectRequestId,
        message,
        images,
        files,
      });

      setMessage("");
      setImages([]);
      setFiles([]);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Could not send message or attachment.",
      );

      await loadMessages()
        .then(setMessages)
        .catch(() => undefined);
    } finally {
      setIsSending(false);
    }
  };

  return {
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
  };
};

type CustomerProjectMessageRow = {
  id: string;
  project_request_id: string;
  sender_id: string;
  sender_type: "customer" | "admin";
  message: string;
  created_at: string;
  read_at: string | null;
};

type ProjectMessageMediaRow = {
  id: string;
  project_request_id: string;
  message_id: string;
  customer_id: string;
  media_type: "image" | "file";
  resource_type: "image" | "raw";
  original_filename: string;
  mime_type: string | null;
  file_size: number | null;
  secure_url: string;
  public_id: string;
  created_at: string;
  updated_at: string;
};

const mapMediaRow = (row: ProjectMessageMediaRow) => ({
  id: row.id,
  projectRequestId: row.project_request_id,
  messageId: row.message_id,
  customerId: row.customer_id,
  mediaType: row.media_type,
  resourceType: row.resource_type,
  originalFilename: row.original_filename,
  mimeType: row.mime_type,
  fileSize: row.file_size,
  secureUrl: row.secure_url,
  publicId: row.public_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
