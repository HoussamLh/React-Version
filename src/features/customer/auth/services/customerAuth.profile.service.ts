import { requireSupabase } from "../../../../lib/supabase";
import type {
  CustomerProfile,
  CustomerProfileUpdateValues,
} from "../types/customerAuth.types";

type CustomerProfileRow = {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  phone: string;
  onboarding_status: CustomerProfile["onboardingStatus"];
  account_status: CustomerProfile["accountStatus"];
};

type UpsertCustomerProfileValues = {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  phone: string;
};

const profileSelect =
  "id, email, full_name, company_name, phone, onboarding_status, account_status";

export const mapCustomerProfile = (row: CustomerProfileRow): CustomerProfile => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  companyName: row.company_name,
  phone: row.phone,
  onboardingStatus: row.onboarding_status,
  accountStatus: row.account_status,
});

export const upsertCustomerProfile = async ({
  id,
  email,
  fullName,
  companyName,
  phone,
}: UpsertCustomerProfileValues): Promise<CustomerProfile> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("customer_profiles")
    .upsert(
      {
        id,
        email,
        full_name: fullName,
        company_name: companyName,
        phone,
        onboarding_status: "new",
        account_status: "active",
      },
      { onConflict: "id" },
    )
    .select(profileSelect)
    .single<CustomerProfileRow>();

  if (error) throw error;

  return mapCustomerProfile(data);
};

export const getCurrentCustomerProfile = async (): Promise<CustomerProfile | null> => {
  const client = requireSupabase();

  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.user?.id) return null;

  const { data, error } = await client
    .from("customer_profiles")
    .select(profileSelect)
    .eq("id", session.user.id)
    .maybeSingle<CustomerProfileRow>();

  if (error) throw error;

  return data ? mapCustomerProfile(data) : null;
};

export const updateCurrentCustomerProfile = async (
  values: CustomerProfileUpdateValues,
): Promise<CustomerProfile> => {
  const client = requireSupabase();

  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.user?.id) throw new Error("Customer session is required.");

  const { data, error } = await client
    .from("customer_profiles")
    .update({
      full_name: values.fullName.trim(),
      company_name: values.companyName.trim(),
      phone: values.phone.trim(),
      onboarding_status: "profile_started",
    })
    .eq("id", session.user.id)
    .select(profileSelect)
    .single<CustomerProfileRow>();

  if (error) throw error;

  return mapCustomerProfile(data);
};
