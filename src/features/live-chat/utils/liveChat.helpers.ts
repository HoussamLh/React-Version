import type {
  LiveChatAvailabilityMode,
  LiveChatMessage,
} from "../types/liveChat.types";

export const wait = (duration: number) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
};

export const appendUniqueLiveChatMessage = (
  currentMessages: LiveChatMessage[],
  nextMessage: LiveChatMessage,
) => {
  const exists = currentMessages.some(
    (message) => message.id === nextMessage.id,
  );

  if (exists) {
    return currentMessages;
  }

  return [...currentMessages, nextMessage];
};

export const hasLiveChatMessageContaining = (
  messages: LiveChatMessage[],
  value: string,
) => {
  return messages.some((message) => message.body.includes(value));
};

export const isValidLiveChatEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const getUkBusinessAvailability = (): LiveChatAvailabilityMode => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hourValue = parts.find((part) => part.type === "hour")?.value ?? "0";
  const hour = Number(hourValue === "24" ? "0" : hourValue);

  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const isWorkingHour = hour >= 9 && hour < 18;

  return !isWeekend && isWorkingHour ? "online" : "offline";
};
