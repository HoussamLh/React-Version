import React from "react";
import {
  ContactFormSection,
  CTASection,
  HeroSection,
} from "../features/pages/contact";
import { ContactLiveChatLauncher } from "../features/live-chat/components/ContactLiveChatLauncher";

export const Contact: React.FC = () => {
  return (
    <div className="ds-page">
      <HeroSection />
      <ContactFormSection />
      <CTASection />
      <ContactLiveChatLauncher />
    </div>
  );
};
