import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentAdminProfile } from "../../auth/adminAuth.service";
import { createAdminRealtimeChannel } from "../services/adminChat.realtime.service";

type UseAdminChatRealtimeOptions = {
  conversationId: string | null;
};

export const useAdminChatRealtime = ({
  conversationId,
}: UseAdminChatRealtimeOptions) => {
  const [isVisitorOnline, setIsVisitorOnline] = useState(false);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);

  const realtimeRef = useRef<{
    sendTypingStatus: (isTyping: boolean) => Promise<void>;
    unsubscribe: () => void;
  } | null>(null);

  /*
   * Create realtime presence + typing channel.
   */
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    let isMounted = true;

    void Promise.resolve().then(async () => {
      const adminProfile = await getCurrentAdminProfile();

      if (!isMounted || !adminProfile) {
        return;
      }

      const realtime = createAdminRealtimeChannel({
        conversationId,
        adminId: adminProfile.id,
        onVisitorTypingChange: setIsVisitorTyping,
        onPresenceChange: setIsVisitorOnline,
      });

      realtimeRef.current = realtime;
    });

    return () => {
      isMounted = false;

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      realtimeRef.current?.unsubscribe();
      realtimeRef.current = null;

      setIsVisitorOnline(false);
      setIsVisitorTyping(false);
    };
  }, [conversationId]);

  /*
   * Visitor typing state.
   */
  const handleTypingChange = useCallback((isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    void realtimeRef.current?.sendTypingStatus(isTyping);

    if (!isTyping) {
      return;
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      void realtimeRef.current?.sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500);
  }, []);

  const sendTypingStatus = useCallback(async (isTyping: boolean) => {
    await realtimeRef.current?.sendTypingStatus(isTyping);
  }, []);

  return {
    isVisitorOnline,
    isVisitorTyping,
    handleTypingChange,
    sendTypingStatus,
  };
};
