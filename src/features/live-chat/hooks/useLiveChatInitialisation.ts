import { useEffect, type Dispatch, type SetStateAction } from "react";
import { isSupabaseConfigured } from "../../../lib/supabase";
import {
  ensureAnonymousVisitor,
  getConversationMessages,
  getOrCreateOpenConversation,
  getVisitorProfile,
  upsertVisitorProfile,
} from "../services/liveChat.service";
import type {
  LiveChatConversation,
  LiveChatMessage,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";

type UseLiveChatInitialisationParams = {
  enabled: boolean;
  conversationId: string | null;
  setVisitorId: Dispatch<SetStateAction<string | null>>;
  setVisitorProfile: Dispatch<SetStateAction<LiveChatVisitorProfile>>;
  setConversation: Dispatch<SetStateAction<LiveChatConversation | null>>;
  setMessages: Dispatch<SetStateAction<LiveChatMessage[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export const useLiveChatInitialisation = ({
  enabled,
  conversationId,
  setVisitorId,
  setVisitorProfile,
  setConversation,
  setMessages,
  setIsLoading,
  setError,
}: UseLiveChatInitialisationParams) => {
  useEffect(() => {
    if (!enabled || conversationId) return;

    let isMounted = true;

    const initialiseLiveChat = async () => {
      if (!isSupabaseConfigured) {
        setError("Live chat is not configured yet.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextVisitorId = await ensureAnonymousVisitor();

        await upsertVisitorProfile({
          visitorId: nextVisitorId,
        });

        const nextVisitorProfile = await getVisitorProfile(nextVisitorId);
        const nextConversation =
          await getOrCreateOpenConversation(nextVisitorId);
        const nextMessages = await getConversationMessages(nextConversation.id);

        if (!isMounted) return;

        setVisitorId(nextVisitorId);
        setVisitorProfile(nextVisitorProfile);
        setConversation(nextConversation);
        setMessages(nextMessages);
      } catch (error) {
        console.error("Live chat init failed:", error);

        if (!isMounted) return;

        setError("Live chat could not connect. Please try again later.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialiseLiveChat();

    return () => {
      isMounted = false;
    };
  }, [
    conversationId,
    enabled,
    setConversation,
    setError,
    setIsLoading,
    setMessages,
    setVisitorId,
    setVisitorProfile,
  ]);
};
