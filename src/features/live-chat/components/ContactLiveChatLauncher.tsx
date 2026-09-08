import { lazy, Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { LiveChatFloatingButton } from "./LiveChatFloatingButton";

const LiveChatBubble = lazy(() =>
  import("./LiveChatBubble").then(({ LiveChatBubble: LiveChatBubbleComponent }) => ({
    default: LiveChatBubbleComponent,
  })),
);

export const ContactLiveChatLauncher = () => {
  const [shouldLoadChat, setShouldLoadChat] = useState(false);

  if (shouldLoadChat) {
    return (
      <Suspense fallback={<LiveChatTrigger disabled />}>
        <LiveChatBubble initiallyOpen />
      </Suspense>
    );
  }

  return <LiveChatTrigger onClick={() => setShouldLoadChat(true)} />;
};

type LiveChatTriggerProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const LiveChatTrigger = ({ disabled = false, onClick }: LiveChatTriggerProps) => {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div style={styles.wrapper}>
      <LiveChatFloatingButton
        disabled={disabled}
        isOpen={false}
        onClick={onClick ?? (() => {})}
      />
      {disabled && <span className="sr-only">Opening live chat...</span>}
    </div>,
    document.body,
  );
};

const styles = {
  wrapper: {
    position: "fixed" as const,
    right: "32px",
    bottom: "32px",
    zIndex: 2147483647,
    pointerEvents: "none" as const,
  },
};
