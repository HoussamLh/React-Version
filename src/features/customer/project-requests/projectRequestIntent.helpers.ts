import type { CustomerProjectRequestFormValues } from "./projectRequests.types";

export const getProjectRequestValuesFromSearch = (
  search: string,
): Partial<CustomerProjectRequestFormValues> | undefined => {
  const searchParams = new URLSearchParams(search);

  const selectedPlan = searchParams.get("plan")?.trim();
  const selectedMaintenance = searchParams.get("maintenance")?.trim();

  if (selectedPlan) {
    return {
      title: `${selectedPlan} project request`,
      projectType: "website",
      selectedPackage: selectedPlan,
      packageCategory: "build_plan",
    };
  }

  if (selectedMaintenance) {
    return {
      title: `${selectedMaintenance} request`,
      projectType: "maintenance",
      selectedPackage: selectedMaintenance,
      packageCategory: "maintenance_plan",
    };
  }

  return undefined;
};
