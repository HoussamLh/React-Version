import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentCustomerProfile,
  signOutCustomer,
} from "../../auth/services/customerAuth.service";
import type { CustomerProfile } from "../../auth/types/customerAuth.types";

type UseCustomerDashboardResult = {
  profile: CustomerProfile | null;
  isLoading: boolean;
  isSigningOut: boolean;
  error: string;
  setProfile: React.Dispatch<React.SetStateAction<CustomerProfile | null>>;
  handleSignOut: () => Promise<void>;
};

export const useCustomerDashboard = (): UseCustomerDashboardResult => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const currentProfile = await getCurrentCustomerProfile();

        if (!isMounted) return;

        setProfile(currentProfile);
      } catch {
        if (!isMounted) return;

        setError("Could not load your customer profile.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError("");

    try {
      await signOutCustomer();
      navigate("/sign-in", { replace: true });
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    profile,
    isLoading,
    isSigningOut,
    error,
    setProfile,
    handleSignOut,
  };
};
