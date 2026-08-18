export type CustomerAuthCheckState = "checking" | "ready" | "authenticated";

export const getCustomerAuthErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const getSafeCustomerRedirectPath = (path?: string) => {
  if (!path) return "/customer/dashboard";

  if (!path.startsWith("/customer")) {
    return "/customer/dashboard";
  }

  return path;
};
