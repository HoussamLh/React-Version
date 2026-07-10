import { supabase } from "../../../lib/supabase";

export type AdminProfile = {
  id: string;
  email: string;
  displayName: string | null;
  role: "owner" | "admin" | "support";
};

type AdminProfileRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: "owner" | "admin" | "support";
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const mapAdminProfile = (row: AdminProfileRow): AdminProfile => ({
  id: row.id,
  email: row.email,
  displayName: row.display_name,
  role: row.role,
});

export const getCurrentAdminProfile =
  async (): Promise<AdminProfile | null> => {
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
      .from("admin_profiles")
      .select("id, email, display_name, role")
      .eq("id", session.user.id)
      .maybeSingle<AdminProfileRow>();

    if (error) {
      throw error;
    }

    return data ? mapAdminProfile(data) : null;
  };

export const subscribeToAdminAuthChanges = (callback: () => void) => {
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

export const signInAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AdminProfile> => {
  const client = requireSupabase();

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const adminProfile = await getCurrentAdminProfile();

  if (!adminProfile) {
    await client.auth.signOut();
    throw new Error("This account does not have admin access.");
  }

  return adminProfile;
};

export const signOutAdmin = async () => {
  const client = requireSupabase();

  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
};
