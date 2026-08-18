import { requireSupabase } from "../../../../lib/supabase";
import {
  getCurrentCustomerProfile,
  upsertCustomerProfile,
} from "./customerAuth.profile.service";
import type {
  CustomerSignInValues,
  CustomerSignUpResult,
  CustomerSignUpValues,
} from "../types/customerAuth.types";

export { getCurrentCustomerProfile, updateCurrentCustomerProfile } from "./customerAuth.profile.service";

export const subscribeToCustomerAuthChanges = (callback: () => void) => {
  const client = requireSupabase();

  const { data } = client.auth.onAuthStateChange(() => {
    window.setTimeout(() => callback(), 0);
  });

  return () => data.subscription.unsubscribe();
};

export const signUpCustomer = async ({
  email,
  password,
  fullName,
  companyName,
  phone,
}: CustomerSignUpValues): Promise<CustomerSignUpResult> => {
  const client = requireSupabase();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();
  const normalizedCompanyName = companyName.trim();
  const normalizedPhone = phone.trim();

  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: normalizedFullName,
        company_name: normalizedCompanyName,
        phone: normalizedPhone,
      },
    },
  });

  if (error) throw error;

  if (!data.session || !data.user?.id) {
    return { profile: null, needsEmailConfirmation: true };
  }

  const profile = await upsertCustomerProfile({
    id: data.user.id,
    email: normalizedEmail,
    fullName: normalizedFullName,
    companyName: normalizedCompanyName,
    phone: normalizedPhone,
  });

  return { profile, needsEmailConfirmation: false };
};

export const signInCustomer = async ({
  email,
  password,
}: CustomerSignInValues) => {
  const client = requireSupabase();
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) throw error;
  if (!data.user?.id) throw new Error("Unable to access customer account.");

  const existingProfile = await getCurrentCustomerProfile();

  if (existingProfile) {
    if (existingProfile.accountStatus === "suspended") {
      await client.auth.signOut();
      throw new Error("This customer account is suspended.");
    }

    return existingProfile;
  }

  const metadata = data.user.user_metadata;

  return upsertCustomerProfile({
    id: data.user.id,
    email: data.user.email ?? normalizedEmail,
    fullName: typeof metadata.full_name === "string" ? metadata.full_name : "",
    companyName:
      typeof metadata.company_name === "string" ? metadata.company_name : "",
    phone: typeof metadata.phone === "string" ? metadata.phone : "",
  });
};

export const signOutCustomer = async () => {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
};

export const updateCustomerPassword = async (password: string) => {
  const client = requireSupabase();
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
};
