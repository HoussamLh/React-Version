const getUkHour = () => {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    hour12: false,
  }).format(new Date());

  return Number(hour === "24" ? "0" : hour);
};

export const liveChatBrand = "DevBySam";

export const liveChatAgent = {
  name: "Sam",
  status: "Active 45m ago",
  previewTime: "1m",
  greeting: "Hello, how can I help you?",
  feedbackText: "Ask us anything, or share your feedback.",
};

export const liveChatProfileCapture = {
  typingDelayMs: 900,
  skipEmailValue: "skip",

  serviceOptions: [
    "Web Development",
    "Mobile App",
    "Backend System",
    "Maintenance & Support",
  ],

  welcomePrompt: () => {
    const hour = getUkHour();

    if (hour < 12) {
      return "Good morning! Welcome to DevBySam Live Chat.";
    }

    if (hour < 17) {
      return "Good afternoon! Welcome to DevBySam Live Chat.";
    }

    return "Good evening! Welcome to DevBySam Live Chat.";
  },

  privacyPrompt:
    "Before we begin, you should know that any information you type will be stored and used in accordance with the DevBySam Privacy Statement: https://www.devbysam.co.uk/en/privacy-cookie-policy. Please do not type any sensitive personal information like your national insurance number, credit card number, or passwords into the chat.",

  namePrompt: "Before we start, what’s your name?",

  emailPrompt: (name: string, isEmailRequired: boolean) => {
    if (isEmailRequired) {
      return `Thank you, ${name}. What email should I use for follow-up?\nOur team is currently offline, so we need your email to reply to you.`;
    }

    return `Thank you, ${name}. What email should I use for follow-up?\nYou can type “skip” if you prefer.`;
  },

  offlineNoticePrompt: (name: string) =>
    `Thank you, ${name}. We are currently offline, but you can still leave us a message and our team will get back to you as soon as possible.`,

  servicePrompt: (name: string, isOffline: boolean) => {
    if (isOffline) {
      return "What service are you contacting us about?";
    }

    return `Thank you, ${name}. How may I help you today?`;
  },

  topicPrompt: (name: string) =>
    `Thank you, ${name}. Briefly describe what you are contacting us about.`,

  connectingPrompt: "Please wait, we are connecting you to one of our team.",

  offlineReceivedPrompt: (name: string) =>
    `Thank you, ${name}. We’ve received your message and will reply to you by email as soon as possible.`,

  anythingElsePrompt: "Is there anything else you would like to add?",

  extraDetailsPrompt: "Please type any extra details below.",

  extraReceivedPrompt: (name: string) =>
    `Thank you, ${name}. We’ve added that to your enquiry.`,

  closingPrompt: (name: string) => {
    const hour = getUkHour();

    if (hour >= 18 || hour < 6) {
      return `Thank you, ${name}. Have a good night.`;
    }

    return `Thank you, ${name}. Have a lovely day.`;
  },
};

export const liveChatTranscript = {
  fileName: "devbysam-chat-transcript.txt",
  title: "DevBySam Chat Transcript",
};
