import { supabase } from "../../../lib/supabase";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "./contactSubmissions.types";

type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: ContactSubmissionStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const mapContactSubmission = (
  row: ContactSubmissionRow,
): ContactSubmission => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  service: row.service,
  message: row.message,
  status: row.status,
  source: row.source,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("contact_submissions")
    .select(
      "id, name, email, phone, service, message, status, source, created_at, updated_at",
    )
    .order("created_at", { ascending: false })
    .returns<ContactSubmissionRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapContactSubmission);
};

export const updateContactSubmissionStatus = async ({
  submissionId,
  status,
}: {
  submissionId: string;
  status: ContactSubmissionStatus;
}) => {
  const client = requireSupabase();

  const { error } = await client
    .from("contact_submissions")
    .update({ status })
    .eq("id", submissionId);

  if (error) {
    throw error;
  }
};
