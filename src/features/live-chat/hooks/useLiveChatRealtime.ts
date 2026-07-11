import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createLiveChatRealtimeChannel } from "../services/liveChat.service";
import type { LiveChatPresenceState } from "../types/liveChat.types";

const ADMIN_TYPING_TIMEOUT_MS = 2200;

type LiveChatRealtimeRef = {
  sendTypingStatus: (isTyping: boolean) => Promise<void>;
  unsubscribe: () => void;
};

type UseLiveChatRealtimeParams = {
  enabled: boolean;
  conversationId: string | null;
  visitorId: string | null;
  setPresence: Dispatch<SetStateAction<LiveChatPresenceState[]>>;
  setIsAdminTyping: Dispatch<SetStateAction<boolean>>;
};

export const useLiveChatRealtime = ({
  enabled,
  conversationId,
  visitorId,
  setPresence,
  setIsAdminTyping,
}: UseLiveChatRealtimeParams) => {
  const realtimeRef = useRef<LiveChatRealtimeRef | null>(null);
  const adminTypingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !conversationId || !visitorId) return;

    const realtime = createLiveChatRealtimeChannel({
      conversationId,
      visitorId,
      onTypingChange: (payload) => {
        if (payload.conversationId !== conversationId) return;
        if (payload.role !== "admin") return;

        if (adminTypingTimeoutRef.current) {
          window.clearTimeout(adminTypingTimeoutRef.current);
          adminTypingTimeoutRef.current = null;
        }

        setIsAdminTyping(Boolean(payload.isTyping));

        if (!payload.isTyping) return;

        adminTypingTimeoutRef.current = window.setTimeout(() => {
          setIsAdminTyping(false);
          adminTypingTimeoutRef.current = null;
        }, ADMIN_TYPING_TIMEOUT_MS);
      },
      onPresenceChange: setPresence,
    });

    realtimeRef.current = realtime;

    return () => {
      if (adminTypingTimeoutRef.current) {
        window.clearTimeout(adminTypingTimeoutRef.current);
        adminTypingTimeoutRef.current = null;
      }

      realtime.unsubscribe();
      realtimeRef.current = null;
      setPresence([]);
      setIsAdminTyping(false);
    };
  }, [conversationId, enabled, setIsAdminTyping, setPresence, visitorId]);

  const sendRealtimeTypingStatus = useCallback(async (isTyping: boolean) => {
    await realtimeRef.current?.sendTypingStatus(isTyping);
  }, []);

  return {
    sendRealtimeTypingStatus,
  };
};
