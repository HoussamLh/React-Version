import { useEffect, useState } from "react";
import {
  getCurrentCustomerProfile,
  subscribeToCustomerAuthChanges,
} from "../services/customerAuth.service";
import type { CustomerProfile } from "../types/customerAuth.types";
import type { CustomerAuthCheckState } from "../utils/customerAuth.utils";

type UseCustomerAuthSessionResult = {
  authState: CustomerAuthCheckState;
  profile: CustomerProfile | null;
};

export const useCustomerAuthSession = (): UseCustomerAuthSessionResult => {
  const [authState, setAuthState] = useState<CustomerAuthCheckState>("checking");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkCurrentCustomer = async () => {
      if (!isMounted) return;

      setAuthState("checking");

      try {
        const currentProfile = await getCurrentCustomerProfile();

        if (!isMounted) return;

        setProfile(currentProfile);
        setAuthState(currentProfile ? "authenticated" : "ready");
      } catch {
        if (!isMounted) return;

        setProfile(null);
        setAuthState("ready");
      }
    };

    window.setTimeout(() => {
      void checkCurrentCustomer();
    }, 0);

    const unsubscribe = subscribeToCustomerAuthChanges(() => {
      void checkCurrentCustomer();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { authState, profile };
};
