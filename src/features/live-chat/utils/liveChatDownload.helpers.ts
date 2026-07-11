import { liveChatTranscript } from "../data/liveChat.data";
import type { LiveChatMessage } from "../types/liveChat.types";
import { buildLiveChatTranscript } from "./liveChatBubble.helpers";

export const downloadLiveChatTranscript = (messages: LiveChatMessage[]) => {
  const transcript = buildLiveChatTranscript(messages);

  const blob = new Blob([transcript], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = liveChatTranscript.fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};
