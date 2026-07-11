import { useCallback, type Dispatch, type SetStateAction } from "react";

import { sendVisitorMessage } from "../services/liveChat.service";
import type { LiveChatMessage } from "../types/liveChat.types";
import { appendUniqueLiveChatMessage } from "../utils";

type UseLiveChatMessageSenderParams = {
  conversationId: string | null;
  clearTypingStatus: () => Promise<void> | void;
  setMessages: Dispatch<SetStateAction<LiveChatMessage[]>>;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export const useLiveChatMessageSender = ({
  conversationId,
  clearTypingStatus,
  setMessages,
  setIsSending,
  setError,
}: UseLiveChatMessageSenderParams) => {
  return useCallback(
    async (body: string): Promise<boolean> => {
      const trimmedBody = body.trim();

      if (!trimmedBody) {
        return false;
      }

      if (!conversationId) {
        setError("Live chat is still connecting. Please try again.");
        return false;
      }

      setIsSending(true);
      setError(null);

      try {
        await clearTypingStatus();

        const nextMessage = await sendVisitorMessage({
          conversationId,
          body: trimmedBody,
        });

        setMessages((currentMessages) =>
          appendUniqueLiveChatMessage(currentMessages, nextMessage),
        );

        return true;
      } catch (error) {
        console.error("Live chat send failed:", error);
        setError("Message could not be sent. Please try again.");

        return false;
      } finally {
        setIsSending(false);
      }
    },
    [clearTypingStatus, conversationId, setError, setIsSending, setMessages],
  );
};
