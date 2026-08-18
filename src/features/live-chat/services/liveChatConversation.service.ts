import { supabase } from "../../../lib/supabase";
import type { LiveChatConversation } from "../types/liveChat.types";

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
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
};

const mapConversation = (row: ConversationRow): LiveChatConversation => ({
  id: row.id,
  visitorId: row.visitor_id,
  status: row.status,
  source: row.source,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastMessageAt: row.last_message_at,
});

const conversationSelect = "id, visitor_id, status, source, created_at, updated_at, last_message_at";

export const getOrCreateOpenConversation = async (visitorId: string): Promise<LiveChatConversation> => {
  const client = requireSupabase();
  const { data: existingConversation, error: existingError } = await client
    .from("conversations")
    .select(conversationSelect)
    .eq("visitor_id", visitorId)
    .in("status", ["open", "pending"])
    .order("last_message_at", { ascending: false })
    .limit(1)
    .maybeSingle<ConversationRow>();

  if (existingError) throw existingError;
  if (existingConversation) return mapConversation(existingConversation);

  const { data: newConversation, error: createError } = await client
    .from("conversations")
    .insert({ visitor_id: visitorId, status: "open", source: "website" })
    .select(conversationSelect)
    .single<ConversationRow>();

  if (createError) throw createError;
  return mapConversation(newConversation);
};
