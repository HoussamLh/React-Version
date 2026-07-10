import React from "react";
import { TypingIndicator } from "../../../shared/components";

type LiveChatTypingIndicatorProps = {
  label?: string;
};

export const LiveChatTypingIndicator: React.FC<
  LiveChatTypingIndicatorProps
> = ({ label = "Typing" }) => {
  return <TypingIndicator label={label} marginTop />;
};
