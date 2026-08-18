import { supabase } from "../../../lib/supabase";
import type { LiveChatPresenceState, LiveChatTypingPayload } from "../types/liveChat.types";

const requireSupabase = () => {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
};

export const createLiveChatRealtimeChannel = ({
  conversationId,
  visitorId,
  onTypingChange,
  onPresenceChange,
}: {
  conversationId: string;
  visitorId: string;
  onTypingChange: (payload: LiveChatTypingPayload) => void;
  onPresenceChange: (presence: LiveChatPresenceState[]) => void;
}) => {
  const client = requireSupabase();
  const channel = client.channel(`live-chat-room-${conversationId}`, {
    config: { broadcast: { self: false }, presence: { key: visitorId } },
  });

  channel
    .on("broadcast", { event: "typing" }, ({ payload }) => {
      onTypingChange(payload as LiveChatTypingPayload);
    })
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<LiveChatPresenceState>();
      const presence = Object.values(state).flat().filter(Boolean);
      onPresenceChange(presence);
    })
    .subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await channel.track({
        userId: visitorId,
        role: "visitor",
        onlineAt: new Date().toISOString(),
      });
    });

  return {
    sendTypingStatus: async (isTyping: boolean) => {
      await channel.send({
        type: "broadcast",
        event: "typing",
        payload: { conversationId, userId: visitorId, role: "visitor", isTyping } satisfies LiveChatTypingPayload,
      });
    },
    unsubscribe: () => {
      client.removeChannel(channel);
    },
  };
};
