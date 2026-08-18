export { CustomerSignInPage } from "./CustomerSignInPage";
export { CustomerSignUpPage } from "./CustomerSignUpPage";
export { ProtectedCustomerRoute } from "./ProtectedCustomerRoute";

export type {
  CustomerAccountStatus,
  CustomerOnboardingStatus,
  CustomerProfile,
  CustomerProfileUpdateValues,
  CustomerSignInValues,
  CustomerSignUpResult,
  CustomerSignUpValues,
} from "./types/customerAuth.types";

export {
  getCurrentCustomerProfile,
  signInCustomer,
  signOutCustomer,
  signUpCustomer,
  subscribeToCustomerAuthChanges,
  updateCurrentCustomerProfile,
  updateCustomerPassword,
} from "./services/customerAuth.service";
