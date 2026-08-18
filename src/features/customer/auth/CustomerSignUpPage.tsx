import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CustomerAuthCheckingState, CustomerAuthPageShell } from "./components/CustomerAuthPageShell";
import { CustomerSignUpForm } from "./components/CustomerSignUpForm";
import { useCustomerAuthSession } from "./hooks/useCustomerAuthSession";
import { useCustomerSignUp } from "./hooks/useCustomerSignUp";

export const CustomerSignUpPage: React.FC = () => {
  const location = useLocation();
  const dashboardRedirectPath = `/customer/dashboard${location.search}`;
  const signInPath = `/sign-in${location.search}`;

  const { authState } = useCustomerAuthSession();
  const form = useCustomerSignUp({ redirectTo: dashboardRedirectPath });

  if (authState === "checking") return <CustomerAuthCheckingState />;
  if (authState === "authenticated") {
    return <Navigate to={dashboardRedirectPath} replace />;
  }

  return (
    <CustomerAuthPageShell
      badge="Get Started"
      title="Create your customer account"
      subtitle="Start your project request and manage your DevBySam onboarding from one place."
    >
      <CustomerSignUpForm
        {...form}
        signInPath={signInPath}
        onFullNameChange={form.setFullName}
        onCompanyNameChange={form.setCompanyName}
        onPhoneChange={form.setPhone}
        onEmailChange={form.setEmail}
        onPasswordChange={form.setPassword}
        onConfirmPasswordChange={form.setConfirmPassword}
        onSubmit={form.handleSubmit}
      />
    </CustomerAuthPageShell>
  );
};
