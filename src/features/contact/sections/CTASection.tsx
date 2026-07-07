import React from "react";
import { AccentText, CallToAction, TeamAvatars } from "../../../design-system";
import { teamAvatars } from "../../live-chat/data/teamAvatars.data";

export const CTASection: React.FC = () => {
  return (
    <CallToAction
      topContent={<TeamAvatars avatars={teamAvatars} />}
      backgroundAccent="yellow"
      title={
        <>
          Prefer a real-time <AccentText>conversation?</AccentText>
        </>
      }
      subtitle="Use live chat for quick technical questions, 
      project triage, or to discuss the right package before 
      starting your project."
      primaryAction={{
        label: "Launch Live Session",
        to: "/contact",
      }}
    />
  );
};
