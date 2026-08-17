import { useEffect, useMemo, useState } from "react";
import type {
  ProjectRequestFormValues,
  ProjectRequestPackageCategory,
  ProjectRequestType,
} from "../types/projectRequests.types";

export const defaultProjectRequestFormValues: ProjectRequestFormValues = {
  title: "",
  projectType: "website",
  selectedPackage: "",
  packageCategory: "custom",
  budgetRange: "",
  timeline: "",
  description: "",
  goals: "",
};

export const useCustomerProjectRequestForm = (
  initialValues?: Partial<ProjectRequestFormValues>,
) => {
  const mergedInitialValues = useMemo<ProjectRequestFormValues>(
    () => ({ ...defaultProjectRequestFormValues, ...initialValues }),
    [initialValues],
  );

  const [values, setValues] = useState(mergedInitialValues);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setValues(mergedInitialValues), 0);
    return () => window.clearTimeout(timer);
  }, [mergedInitialValues]);

  const setField = <K extends keyof ProjectRequestFormValues>(
    field: K,
    value: ProjectRequestFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!values.title.trim()) return "Project title is required.";
    if (!values.description.trim()) return "Project description is required.";
    return "";
  };

  const submit = async (
    onSubmit: (values: ProjectRequestFormValues) => Promise<void>,
  ) => {
    const nextError = validate();
    if (nextError) {
      setValidationError(nextError);
      return;
    }

    setValidationError("");
    await onSubmit(values);
  };

  return {
    values,
    validationError,
    setTitle: (value: string) => setField("title", value),
    setProjectType: (value: ProjectRequestType) => setField("projectType", value),
    setPackageCategory: (value: ProjectRequestPackageCategory) =>
      setField("packageCategory", value),
    setSelectedPackage: (value: string) => setField("selectedPackage", value),
    setBudgetRange: (value: string) => setField("budgetRange", value),
    setTimeline: (value: string) => setField("timeline", value),
    setDescription: (value: string) => setField("description", value),
    setGoals: (value: string) => setField("goals", value),
    submit,
  };
};
