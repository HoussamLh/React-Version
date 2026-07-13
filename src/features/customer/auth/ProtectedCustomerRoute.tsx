import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { colors, spacing, typography } from "../../../design-system";
import {
  getCurrentCustomerProfile,
  subscribeToCustomerAuthChanges,
} from "./customerAuth.service";

type ProtectedCustomerRouteProps = {
  children: React.ReactNode;
};

type CustomerAuthState = "loading" | "authorized" | "unauthorized";

export const ProtectedCustomerRoute: React.FC<ProtectedCustomerRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<CustomerAuthState>("loading");

  useEffect(() => {
    let isMounted = true;

    const checkCustomer = async () => {
      if (!isMounted) return;

      setAuthState("loading");

      try {
        const profile = await getCurrentCustomerProfile();

        if (!isMounted) return;

        setAuthState(
          profile && profile.accountStatus === "active"
            ? "authorized"
            : "unauthorized",
        );
      } catch {
        if (!isMounted) return;

        setAuthState("unauthorized");
      }
    };

    window.setTimeout(() => {
      void checkCustomer();
    }, 0);

    const unsubscribe = subscribeToCustomerAuthChanges(() => {
      void checkCustomer();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (authState === "loading") {
    return (
      <div style={styles.loadingPage}>
        <p style={styles.loadingText}>Checking customer access...</p>
      </div>
    );
  }

  if (authState === "unauthorized") {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return <>{children}</>;
};

const styles = {
  loadingPage: {
    minHeight: "100vh",
    backgroundColor: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  loadingText: {
    color: colors.text.muted,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
  },
};
