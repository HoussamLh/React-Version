import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpCustomer } from "../services/customerAuth.service";
import { getCustomerAuthErrorMessage } from "../utils/customerAuth.utils";

type UseCustomerSignUpOptions = {
  redirectTo: string;
};

type UseCustomerSignUpResult = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
  error: string;
  successMessage: string;
  setFullName: (value: string) => void;
  setCompanyName: (value: string) => void;
  setPhone: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const useCustomerSignUp = ({
  redirectTo,
}: UseCustomerSignUpOptions): UseCustomerSignUpResult => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email address is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const resetForm = () => {
    setFullName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUpCustomer({
        fullName,
        companyName,
        phone,
        email,
        password,
      });

      resetForm();

      if (result.needsEmailConfirmation) {
        setSuccessMessage(
          "Account created. Please check your email to confirm your account before signing in.",
        );
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError(
        getCustomerAuthErrorMessage(
          error,
          "Could not create your account. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fullName,
    companyName,
    phone,
    email,
    password,
    confirmPassword,
    isSubmitting,
    error,
    successMessage,
    setFullName,
    setCompanyName,
    setPhone,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
};
