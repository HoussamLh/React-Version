import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { colors, spacing, typography } from "../../../design-system";
import { getCurrentAdminProfile } from "./adminAuth.service";

type ProtectedAdminRouteProps = {
  children: React.ReactNode;
};

type AuthState = "loading" | "authorized" | "unauthorized";

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        const profile = await getCurrentAdminProfile();

        if (!isMounted) return;

        setAuthState(profile ? "authorized" : "unauthorized");
      } catch {
        if (!isMounted) return;

        setAuthState("unauthorized");
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === "loading") {
    return (
      <div style={styles.loadingPage}>
        <p style={styles.loadingText}>Checking admin access...</p>
      </div>
    );
  }

  if (authState === "unauthorized") {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
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
