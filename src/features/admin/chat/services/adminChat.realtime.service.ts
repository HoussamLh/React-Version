import { supabase } from "../../../../lib/supabase";
import type {
  AdminMessage,
  AdminMessageSender,
} from "../types/adminChat.types";

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
