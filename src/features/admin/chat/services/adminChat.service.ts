import { supabase } from "../../../../lib/supabase";
import type {
  AdminConversationChatMode,
  AdminConversation,
  AdminConversationStatus,
  AdminMessage,
  AdminMessageSender,
} from "../adminChat.types";

type VisitorProfileRow = {
  display_name: string | null;
  email: string | null;
  chat_mode: AdminConversationChatMode | null;
};

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
  visitor_profiles: VisitorProfileRow | VisitorProfileRow[] | null;
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

type RealtimePresenceState = {
  userId: string;
  role: "visitor" | "admin";
  onlineAt: string;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const getVisitorProfile = (row: ConversationRow): VisitorProfileRow | null => {
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

const mapMessage = (row: MessageRow): AdminMessage => {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderType: row.sender_type,
    body: row.body,
    createdAt: row.created_at,
  };
};

/* -------------------------------------------------------------------------- */
/* Conversations                                                              */
/* -------------------------------------------------------------------------- */

export const getAdminConversations = async (): Promise<AdminConversation[]> => {
  const client = requireSupabase();

  const { data: conversations, error } = await client
    .from("conversations")
    .select(
      `
        id,
        visitor_id,
        status,
        source,
        created_at,
        updated_at,
        last_message_at,
        admin_last_read_at,
        visitor_profiles (
          display_name,
          email,
          chat_mode
        )
      `,
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
    .select(
      `
        id,
        conversation_id,
        sender_type,
        body,
        created_at
      `,
    )
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false })
    .returns<MessageRow[]>();

  if (messagesError) {
    throw messagesError;
  }

  const conversationsById = new Map(
    conversations.map((conversation) => [conversation.id, conversation]),
  );

  const latestMessageByConversation = new Map<string, string>();
  const unreadCountByConversation = new Map<string, number>();

  for (const message of messages) {
    if (!latestMessageByConversation.has(message.conversation_id)) {
      latestMessageByConversation.set(message.conversation_id, message.body);
    }

    const conversation = conversationsById.get(message.conversation_id);

    if (!conversation) {
      continue;
    }

    const isVisitorMessage = message.sender_type === "visitor";

    if (!isVisitorMessage) {
      continue;
    }

    const readAt = conversation.admin_last_read_at;

    const isUnread =
      !readAt ||
      new Date(message.created_at).getTime() > new Date(readAt).getTime();

    if (!isUnread) {
      continue;
    }

    const currentUnreadCount =
      unreadCountByConversation.get(message.conversation_id) ?? 0;

    unreadCountByConversation.set(
      message.conversation_id,
      currentUnreadCount + 1,
    );
  }

  return conversations.map((conversation) =>
    mapConversation(
      conversation,
      latestMessageByConversation.get(conversation.id) ?? null,
      unreadCountByConversation.get(conversation.id) ?? 0,
    ),
  );
};

/* -------------------------------------------------------------------------- */
/* Messages                                                                    */
/* -------------------------------------------------------------------------- */

export const getAdminConversationMessages = async (
  conversationId: string,
): Promise<AdminMessage[]> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("messages")
    .select(
      `
        id,
        conversation_id,
        sender_type,
        body,
        created_at
      `,
    )
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
    .insert({
      conversation_id: conversationId,
      sender_type: "admin",
      body,
    })
    .select(
      `
        id,
        conversation_id,
        sender_type,
        body,
        created_at
      `,
    )
    .single<MessageRow>();

  if (error) {
    throw error;
  }

  return mapMessage(data);
};

/* -------------------------------------------------------------------------- */
/* Conversation actions                                                        */
/* -------------------------------------------------------------------------- */

export const updateConversationStatus = async ({
  conversationId,
  status,
}: {
  conversationId: string;
  status: AdminConversationStatus;
}): Promise<void> => {
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

export const markConversationReadForAdmin = async (
  conversationId: string,
): Promise<void> => {
  const client = requireSupabase();

  const { error } = await client.rpc("mark_conversation_read_for_admin", {
    conversation_id: conversationId,
  });

  if (error) {
    throw error;
  }

  window.dispatchEvent(new Event("admin-badges-changed"));
};

/* -------------------------------------------------------------------------- */
/* Realtime: conversation messages                                             */
/* -------------------------------------------------------------------------- */

export const subscribeToAdminConversationMessages = ({
  conversationId,
  onMessage,
}: {
  conversationId: string;
  onMessage: (message: AdminMessage) => void;
}): (() => void) => {
  const client = requireSupabase();

  const channelName = `admin-chat-messages-${conversationId}-${Date.now()}`;

  const channel = client.channel(channelName);

  channel.on(
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
  );

  channel.subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

/* -------------------------------------------------------------------------- */
/* Realtime: all admin messages                                                */
/* -------------------------------------------------------------------------- */

export const subscribeToAllAdminMessages = ({
  onMessage,
}: {
  onMessage: () => void;
}): (() => void) => {
  const client = requireSupabase();

  /*
   * Use a unique channel name for every subscription instance.
   *
   * This prevents React development-mode remounts / StrictMode cleanup
   * cycles from accidentally reusing a previously subscribed channel.
   */
  const channelName = `admin-all-chat-messages-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const channel = client.channel(channelName);

  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
    },
    () => {
      onMessage();
    },
  );

  channel.subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

/* -------------------------------------------------------------------------- */
/* Realtime: presence + typing                                                 */
/* -------------------------------------------------------------------------- */

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
    config: {
      broadcast: {
        self: false,
      },
      presence: {
        key: adminId,
      },
    },
  });

  channel.on("broadcast", { event: "typing" }, ({ payload }) => {
    const typingPayload = payload as AdminTypingPayload;

    if (typingPayload.conversationId !== conversationId) {
      return;
    }

    if (typingPayload.role !== "visitor") {
      return;
    }

    onVisitorTypingChange(Boolean(typingPayload.isTyping));
  });

  channel.on("presence", { event: "sync" }, () => {
    const state = channel.presenceState<RealtimePresenceState>();

    const presence = Object.values(state).flat();

    const isVisitorOnline = presence.some((item) => item.role === "visitor");

    onPresenceChange(isVisitorOnline);
  });

  channel.subscribe(async (status) => {
    if (status !== "SUBSCRIBED") {
      return;
    }

    await channel.track({
      userId: adminId,
      role: "admin",
      onlineAt: new Date().toISOString(),
    });
  });

  return {
    sendTypingStatus: async (isTyping: boolean): Promise<void> => {
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

    unsubscribe: (): void => {
      client.removeChannel(channel);
    },
  };
};
