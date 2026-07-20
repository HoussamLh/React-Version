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
} from "./customerAuth.types";

export {
  getCurrentCustomerProfile,
  signInCustomer,
  signOutCustomer,
  signUpCustomer,
  subscribeToCustomerAuthChanges,
  updateCurrentCustomerProfile,
} from "./customerAuth.service";
