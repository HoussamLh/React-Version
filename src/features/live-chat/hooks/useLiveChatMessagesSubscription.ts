import { useEffect, type Dispatch, type SetStateAction } from "react";

import { subscribeToConversationMessages } from "../services/liveChat.service";
import type { LiveChatMessage } from "../types/liveChat.types";
import { appendUniqueLiveChatMessage } from "../utils";

type UseLiveChatMessagesSubscriptionParams = {
  enabled: boolean;
  conversationId: string | null;
  setMessages: Dispatch<SetStateAction<LiveChatMessage[]>>;
};

export const useLiveChatMessagesSubscription = ({
  enabled,
  conversationId,
  setMessages,
}: UseLiveChatMessagesSubscriptionParams) => {
  useEffect(() => {
    if (!enabled || !conversationId) return;

    const unsubscribe = subscribeToConversationMessages({
      conversationId,
      onMessage: (nextMessage) => {
        setMessages((currentMessages) =>
          appendUniqueLiveChatMessage(currentMessages, nextMessage),
        );
      },
    });

    return unsubscribe;
  }, [enabled, conversationId, setMessages]);
};
