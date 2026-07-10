import { supabase } from "../../../lib/supabase";
import type {
  AdminConversationChatMode,
  AdminConversation,
  AdminConversationStatus,
  AdminMessage,
  AdminMessageSender,
} from "./adminChat.types";

type ConversationRow = {
  id: string;
  visitor_id: string;
  chat_mode: AdminConversationChatMode | null;
  status: AdminConversationStatus;
  source: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  admin_last_read_at: string | null;
  visitor_profiles:
    | {
        display_name: string | null;
        email: string | null;
        chat_mode: AdminConversationChatMode | null;
      }
    | {
        display_name: string | null;
        email: string | null;
        chat_mode: AdminConversationChatMode | null;
      }
    | {
        display_name: string | null;
        email: string | null;
        chat_mode: AdminConversationChatMode | null;
      }[]
    | null;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_type: AdminMessageSender;
  body: string;
  created_at: string;
};

type AdminTypingPayload = {
  conversationId: string;
  userId: string;
  role: "admin" | "visitor";
  isTyping: boolean;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
};

const getVisitorProfile = (row: ConversationRow) => {
  if (Array.isArray(row.visitor_profiles)) {
    return row.visitor_profiles[0] ?? null;
  }
  return row.visitor_profiles;
};

const mapConversation = (
  row: ConversationRow,
  lastMessageBody: string | null = null,
  unreadCount = 0,
): AdminConversation => {
  const visitorProfile = getVisitorProfile(row);
  return {
    id: row.id,
    visitorId: row.visitor_id,
    visitorEmail: visitorProfile?.email ?? null,
    visitorName: visitorProfile?.display_name ?? null,
    chatMode: visitorProfile?.chat_mode ?? null,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastMessageAt: row.last_message_at,
    lastMessageBody,
    adminLastReadAt: row.admin_last_read_at,
    unreadCount,
  };
};

const mapMessage = (row: MessageRow): AdminMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderType: row.sender_type,
  body: row.body,
  createdAt: row.created_at,
});

export const getAdminConversations = async (): Promise<AdminConversation[]> => {
  const client = requireSupabase();
  const { data: conversations, error } = await client
    .from("conversations")
    .select(
      ` id, visitor_id, status, source, created_at, updated_at, last_message_at, admin_last_read_at, visitor_profiles ( display_name, email, chat_mode ) `,
    )
    .order("last_message_at", { ascending: false })
    .returns<ConversationRow[]>();
  if (error) {
    throw error;
  }
  const conversationIds = conversations.map((conversation) => conversation.id);
  if (conversationIds.length === 0) {
    return [];
  }
  const { data: messages, error: messagesError } = await client
    .from("messages")
    .select("id, conversation_id, sender_type, body, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false })
    .returns<MessageRow[]>();
  if (messagesError) {
    throw messagesError;
  }
  const latestMessageByConversation = new Map<string, string>();
  const unreadCountByConversation = new Map<string, number>();
  messages.forEach((message) => {
    if (!latestMessageByConversation.has(message.conversation_id)) {
      latestMessageByConversation.set(message.conversation_id, message.body);
    }
    const conversation = conversations.find(
      (item) => item.id === message.conversation_id,
    );
    if (!conversation) return;
    const isVisitorMessage = message.sender_type === "visitor";
    const readAt = conversation.admin_last_read_at;
    const isUnread =
      isVisitorMessage &&
      (!readAt || new Date(message.created_at) > new Date(readAt));
    if (!isUnread) return;
    unreadCountByConversation.set(
      message.conversation_id,
      (unreadCountByConversation.get(message.conversation_id) ?? 0) + 1,
    );
  });
  return conversations.map((conversation) =>
    mapConversation(
      conversation,
      latestMessageByConversation.get(conversation.id) ?? null,
      unreadCountByConversation.get(conversation.id) ?? 0,
    ),
  );
};

export const getAdminConversationMessages = async (
  conversationId: string,
): Promise<AdminMessage[]> => {
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

export const sendAdminMessage = async ({
  conversationId,
  body,
}: {
  conversationId: string;
  body: string;
}): Promise<AdminMessage> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("messages")
    .insert({ conversation_id: conversationId, sender_type: "admin", body })
    .select("id, conversation_id, sender_type, body, created_at")
    .single<MessageRow>();
  if (error) {
    throw error;
  }
  return mapMessage(data);
};

export const updateConversationStatus = async ({
  conversationId,
  status,
}: {
  conversationId: string;
  status: AdminConversationStatus;
}) => {
  const client = requireSupabase();

  const { error } = await client.rpc("update_admin_conversation_status", {
    target_conversation_id: conversationId,
    next_status: status,
  });

  if (error) {
    throw error;
  }

  window.dispatchEvent(new Event("admin-badges-changed"));
};

export const markConversationReadForAdmin = async (conversationId: string) => {
  const client = requireSupabase();
  const { error } = await client.rpc("mark_conversation_read_for_admin", {
    conversation_id: conversationId,
  });
  if (error) {
    throw error;
  }
  window.dispatchEvent(new Event("admin-badges-changed"));
};

export const subscribeToAdminConversationMessages = ({
  conversationId,
  onMessage,
}: {
  conversationId: string;
  onMessage: (message: AdminMessage) => void;
}) => {
  const client = requireSupabase();
  const channel = client
    .channel(`admin-chat-messages-${conversationId}`)
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

export const subscribeToAllAdminMessages = ({
  onMessage,
}: {
  onMessage: () => void;
}) => {
  const client = requireSupabase();
  const channel = client
    .channel("admin-all-chat-messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      () => {
        onMessage();
      },
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
};

export const createAdminRealtimeChannel = ({
  conversationId,
  adminId,
  onVisitorTypingChange,
  onPresenceChange,
}: {
  conversationId: string;
  adminId: string;
  onVisitorTypingChange: (isTyping: boolean) => void;
  onPresenceChange: (isVisitorOnline: boolean) => void;
}) => {
  const client = requireSupabase();
  const channel = client.channel(`live-chat-room-${conversationId}`, {
    config: { broadcast: { self: false }, presence: { key: adminId } },
  });
  channel
    .on("broadcast", { event: "typing" }, ({ payload }) => {
      const typingPayload = payload as AdminTypingPayload;
      if (typingPayload.conversationId !== conversationId) return;
      if (typingPayload.role !== "visitor") return;
      onVisitorTypingChange(Boolean(typingPayload.isTyping));
    })
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<{
        userId: string;
        role: "visitor" | "admin";
        onlineAt: string;
      }>();
      const presence = Object.values(state).flat();
      const isVisitorOnline = presence.some((item) => item.role === "visitor");
      onPresenceChange(isVisitorOnline);
    })
    .subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await channel.track({
        userId: adminId,
        role: "admin",
        onlineAt: new Date().toISOString(),
      });
    });
  return {
    sendTypingStatus: async (isTyping: boolean) => {
      await channel.send({
        type: "broadcast",
        event: "typing",
        payload: {
          conversationId,
          userId: adminId,
          role: "admin",
          isTyping,
        } satisfies AdminTypingPayload,
      });
    },
    unsubscribe: () => {
      client.removeChannel(channel);
    },
  };
};
