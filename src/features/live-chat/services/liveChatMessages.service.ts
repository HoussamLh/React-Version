import { supabase } from "../../../lib/supabase";
import type { LiveChatMessage, LiveChatMessageSender } from "../types/liveChat.types";

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_type: LiveChatMessageSender;
  body: string;
  created_at: string;
};

const requireSupabase = () => {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
};

const mapMessage = (row: MessageRow): LiveChatMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderType: row.sender_type,
  body: row.body,
  createdAt: row.created_at,
});

const messageSelect = "id, conversation_id, sender_type, body, created_at";

export const getConversationMessages = async (conversationId: string): Promise<LiveChatMessage[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("messages")
    .select(messageSelect)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .returns<MessageRow[]>();

  if (error) throw error;
  return data.map(mapMessage);
};

const sendMessage = async ({ conversationId, body, senderType }: {
  conversationId: string;
  body: string;
  senderType: LiveChatMessageSender;
}): Promise<LiveChatMessage> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("messages")
    .insert({ conversation_id: conversationId, sender_type: senderType, body })
    .select(messageSelect)
    .single<MessageRow>();

  if (error) throw error;
  return mapMessage(data);
};

export const sendVisitorMessage = ({ conversationId, body }: { conversationId: string; body: string }) =>
  sendMessage({ conversationId, body, senderType: "visitor" });

export const sendSystemMessage = ({ conversationId, body }: { conversationId: string; body: string }) =>
  sendMessage({ conversationId, body, senderType: "system" });

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
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => {
      onMessage(mapMessage(payload.new as MessageRow));
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
