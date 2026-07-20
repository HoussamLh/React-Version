import { requireSupabase } from "../../../lib/supabase";
import type {
  CustomerProfile,
  CustomerProfileUpdateValues,
  CustomerSignInValues,
  CustomerSignUpResult,
  CustomerSignUpValues,
} from "./customerAuth.types";

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

const mapCustomerProfile = (row: CustomerProfileRow): CustomerProfile => {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    companyName: row.company_name,
    phone: row.phone,
    onboardingStatus: row.onboarding_status,
    accountStatus: row.account_status,
  };
};

const upsertCustomerProfile = async ({
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
      {
        onConflict: "id",
      },
    )
    .select(
      "id, email, full_name, company_name, phone, onboarding_status, account_status",
    )
    .single<CustomerProfileRow>();

  if (error) {
    throw error;
  }

  return mapCustomerProfile(data);
};

export const getCurrentCustomerProfile =
  async (): Promise<CustomerProfile | null> => {
    const client = requireSupabase();

    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.user?.id) {
      return null;
    }

    const { data, error } = await client
      .from("customer_profiles")
      .select(
        "id, email, full_name, company_name, phone, onboarding_status, account_status",
      )
      .eq("id", session.user.id)
      .maybeSingle<CustomerProfileRow>();

    if (error) {
      throw error;
    }

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

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.user?.id) {
      throw new Error("Customer session is required.");
    }

    const { data, error } = await client
      .from("customer_profiles")
      .update({
        full_name: values.fullName.trim(),
        company_name: values.companyName.trim(),
        phone: values.phone.trim(),
        onboarding_status: "profile_started",
      })
      .eq("id", session.user.id)
      .select(
        "id, email, full_name, company_name, phone, onboarding_status, account_status",
      )
      .single<CustomerProfileRow>();

    if (error) {
      throw error;
    }

    return mapCustomerProfile(data);
  };

export const subscribeToCustomerAuthChanges = (callback: () => void) => {
  const client = requireSupabase();

  const { data } = client.auth.onAuthStateChange(() => {
    window.setTimeout(() => {
      callback();
    }, 0);
  });

  return () => {
    data.subscription.unsubscribe();
  };
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

  if (error) {
    throw error;
  }

  if (!data.session || !data.user?.id) {
    return {
      profile: null,
      needsEmailConfirmation: true,
    };
  }

  const profile = await upsertCustomerProfile({
    id: data.user.id,
    email: normalizedEmail,
    fullName: normalizedFullName,
    companyName: normalizedCompanyName,
    phone: normalizedPhone,
  });

  return {
    profile,
    needsEmailConfirmation: false,
  };
};

export const signInCustomer = async ({
  email,
  password,
}: CustomerSignInValues): Promise<CustomerProfile> => {
  const client = requireSupabase();

  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user?.id) {
    throw new Error("Unable to access customer account.");
  }

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

  if (error) {
    throw error;
  }
};

export const updateCustomerPassword = async (password: string) => {
  const client = requireSupabase();

  const { error } = await client.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
};
