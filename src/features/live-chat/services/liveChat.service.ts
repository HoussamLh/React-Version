import { supabase } from "../../../lib/supabase";
import type {
  LiveChatConversation,
  LiveChatMessage,
  LiveChatMessageSender,
} from "../types/liveChat.types";

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_type: LiveChatMessageSender;
  body: string;
  created_at: string;
};

type ConversationRow = {
  id: string;
  visitor_id: string;
  status: "open" | "pending" | "closed";
  source: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const mapMessage = (row: MessageRow): LiveChatMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderType: row.sender_type,
  body: row.body,
  createdAt: row.created_at,
});

const mapConversation = (row: ConversationRow): LiveChatConversation => ({
  id: row.id,
  visitorId: row.visitor_id,
  status: row.status,
  source: row.source,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastMessageAt: row.last_message_at,
});

export const ensureAnonymousVisitor = async () => {
  const client = requireSupabase();

  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (session?.user?.id) {
    return session.user.id;
  }

  const { data, error } = await client.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  if (!data.user?.id) {
    throw new Error("Failed to create anonymous visitor.");
  }

  return data.user.id;
};

export const upsertVisitorProfile = async (visitorId: string) => {
  const client = requireSupabase();

  const { error } = await client.from("visitor_profiles").upsert({
    id: visitorId,
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    last_seen_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
};

export const getOrCreateOpenConversation = async (
  visitorId: string,
): Promise<LiveChatConversation> => {
  const client = requireSupabase();

  const { data: existingConversation, error: existingError } = await client
    .from("conversations")
    .select(
      "id, visitor_id, status, source, created_at, updated_at, last_message_at",
    )
    .eq("visitor_id", visitorId)
    .in("status", ["open", "pending"])
    .order("last_message_at", { ascending: false })
    .limit(1)
    .maybeSingle<ConversationRow>();

  if (existingError) {
    throw existingError;
  }

  if (existingConversation) {
    return mapConversation(existingConversation);
  }

  const { data: newConversation, error: createError } = await client
    .from("conversations")
    .insert({
      visitor_id: visitorId,
      status: "open",
      source: "website",
    })
    .select(
      "id, visitor_id, status, source, created_at, updated_at, last_message_at",
    )
    .single<ConversationRow>();

  if (createError) {
    throw createError;
  }

  return mapConversation(newConversation);
};

export const getConversationMessages = async (
  conversationId: string,
): Promise<LiveChatMessage[]> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("messages")
    .select("id, conversation_id, sender_type, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .returns<MessageRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapMessage);
};

export const sendVisitorMessage = async ({
  conversationId,
  body,
}: {
  conversationId: string;
  body: string;
}): Promise<LiveChatMessage> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_type: "visitor",
      body,
    })
    .select("id, conversation_id, sender_type, body, created_at")
    .single<MessageRow>();

  if (error) {
    throw error;
  }

  return mapMessage(data);
};

export const subscribeToConversationMessages = ({
  conversationId,
  onMessage,
}: {
  conversationId: string;
  onMessage: (message: LiveChatMessage) => void;
}) => {
  const client = requireSupabase();

  const channel = client
    .channel(`live-chat-messages-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(mapMessage(payload.new as MessageRow));
      },
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
