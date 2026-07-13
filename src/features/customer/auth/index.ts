export type {
  CustomerAccountStatus,
  CustomerOnboardingStatus,
  CustomerProfile,
  CustomerSignInValues,
  CustomerSignUpResult,
  CustomerSignUpValues,
} from "./customerAuth.types";

export {
  getCurrentCustomerProfile,
  signInCustomer,
  signOutCustomer,
  signUpCustomer,
  subscribeToCustomerAuthChanges,
} from "./customerAuth.service";
