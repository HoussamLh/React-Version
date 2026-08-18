import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInCustomer } from "../services/customerAuth.service";
import {
  getCustomerAuthErrorMessage,
  getSafeCustomerRedirectPath,
} from "../utils/customerAuth.utils";

type UseCustomerSignInOptions = {
  redirectTo: string;
};

type UseCustomerSignInResult = {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const useCustomerSignIn = ({
  redirectTo,
}: UseCustomerSignInOptions): UseCustomerSignInResult => {
  const navigate = useNavigate();
  const safeRedirectTo = getSafeCustomerRedirectPath(redirectTo);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email.trim()) return "Email address is required.";
    if (!password) return "Password is required.";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await signInCustomer({ email, password });
      navigate(safeRedirectTo, { replace: true });
    } catch (error) {
      setError(
        getCustomerAuthErrorMessage(
          error,
          "Could not sign in. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    isSubmitting,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  };
};
