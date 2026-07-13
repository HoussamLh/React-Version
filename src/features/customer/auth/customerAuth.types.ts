export type CustomerOnboardingStatus =
  | "new"
  | "profile_started"
  | "project_started"
  | "active";

export type CustomerAccountStatus = "active" | "suspended";

export type CustomerProfile = {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  phone: string;
  onboardingStatus: CustomerOnboardingStatus;
  accountStatus: CustomerAccountStatus;
};

export type CustomerSignUpValues = {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone: string;
};

export type CustomerSignInValues = {
  email: string;
  password: string;
};

export type CustomerSignUpResult = {
  profile: CustomerProfile | null;
  needsEmailConfirmation: boolean;
};
