import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CustomerAuthCheckingState, CustomerAuthPageShell } from "./components/CustomerAuthPageShell";
import { CustomerSignInForm } from "./components/CustomerSignInForm";
import { useCustomerAuthSession } from "./hooks/useCustomerAuthSession";
import { useCustomerSignIn } from "./hooks/useCustomerSignIn";
import { getSafeCustomerRedirectPath } from "./utils/customerAuth.utils";

type LocationState = { from?: string };

export const CustomerSignInPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const dashboardRedirectFromSearch = location.search
    ? `/customer/dashboard${location.search}`
    : undefined;
  const redirectTo = getSafeCustomerRedirectPath(
    state?.from ?? dashboardRedirectFromSearch,
  );

  const { authState } = useCustomerAuthSession();
  const form = useCustomerSignIn({ redirectTo });

  if (authState === "checking") return <CustomerAuthCheckingState />;
  if (authState === "authenticated") {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <CustomerAuthPageShell
      badge="Customer Login"
      title="Sign in to your account"
      subtitle="Access your DevBySam customer area and continue your project onboarding."
    >
      <CustomerSignInForm
        {...form}
        onEmailChange={form.setEmail}
        onPasswordChange={form.setPassword}
        onSubmit={form.handleSubmit}
      />
    </CustomerAuthPageShell>
  );
};
