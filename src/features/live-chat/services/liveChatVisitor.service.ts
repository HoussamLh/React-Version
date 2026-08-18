import { supabase } from "../../../lib/supabase";
import type {
  LiveChatAvailabilityMode,
  LiveChatProfileStep,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";

type VisitorProfileRow = {
  display_name: string | null;
  email: string | null;
  contact_service: string | null;
  contact_topic: string | null;
  contact_extra_details: string | null;
  chat_mode: LiveChatAvailabilityMode | null;
  onboarding_step: LiveChatProfileStep | null;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const mapVisitorProfile = (
  row: VisitorProfileRow | null,
): LiveChatVisitorProfile => ({
  displayName: row?.display_name ?? null,
  email: row?.email ?? null,
  contactService: row?.contact_service ?? null,
  contactTopic: row?.contact_topic ?? null,
  contactExtraDetails: row?.contact_extra_details ?? null,
  chatMode: row?.chat_mode ?? null,
  onboardingStep: row?.onboarding_step ?? "welcome",
});

export const ensureAnonymousVisitor = async () => {
  const client = requireSupabase();
  const { data: { session }, error: sessionError } = await client.auth.getSession();

  if (sessionError) throw sessionError;
  if (session?.user?.id) return session.user.id;

  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user?.id) throw new Error("Failed to create anonymous visitor.");

  return data.user.id;
};

export const upsertVisitorProfile = async ({ visitorId }: { visitorId: string }) => {
  const client = requireSupabase();
  const { error } = await client.from("visitor_profiles").upsert({
    id: visitorId,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    last_seen_at: new Date().toISOString(),
  });

  if (error) throw error;
};

export const getVisitorProfile = async (visitorId: string): Promise<LiveChatVisitorProfile> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("visitor_profiles")
    .select("display_name, email, contact_service, contact_topic, contact_extra_details, chat_mode, onboarding_step")
    .eq("id", visitorId)
    .maybeSingle<VisitorProfileRow>();

  if (error) throw error;
  return mapVisitorProfile(data);
};

export const updateVisitorProfile = async ({
  visitorId, displayName, email, contactService, contactTopic, contactExtraDetails, chatMode, onboardingStep,
}: {
  visitorId: string;
  displayName?: string | null;
  email?: string | null;
  contactService?: string | null;
  contactTopic?: string | null;
  contactExtraDetails?: string | null;
  chatMode?: LiveChatAvailabilityMode | null;
  onboardingStep?: LiveChatProfileStep;
}) => {
  const client = requireSupabase();
  const updatePayload: {
    display_name?: string | null;
    email?: string | null;
    contact_service?: string | null;
    contact_topic?: string | null;
    contact_extra_details?: string | null;
    chat_mode?: LiveChatAvailabilityMode | null;
    onboarding_step?: LiveChatProfileStep;
    last_seen_at: string;
  } = { last_seen_at: new Date().toISOString() };

  if (displayName !== undefined) updatePayload.display_name = displayName;
  if (email !== undefined) updatePayload.email = email;
  if (contactService !== undefined) updatePayload.contact_service = contactService;
  if (contactTopic !== undefined) updatePayload.contact_topic = contactTopic;
  if (contactExtraDetails !== undefined) updatePayload.contact_extra_details = contactExtraDetails;
  if (chatMode !== undefined) updatePayload.chat_mode = chatMode;
  if (onboardingStep !== undefined) updatePayload.onboarding_step = onboardingStep;

  const { error } = await client.from("visitor_profiles").update(updatePayload).eq("id", visitorId);
  if (error) throw error;
};
