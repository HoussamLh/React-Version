import { useCallback, useEffect, useState } from "react";
import { getAdminComparisonRows } from "../services/comparisonRows.service";
import { getAdminEmergencyRestorations } from "../services/emergencyRestoration.service";
import { getAdminMaintenancePlans } from "../services/maintenancePlans.service";
import { getAdminPricingPlans } from "../services/pricingPlans.service";
import type {
  AdminComparisonRow,
  AdminEmergencyRestoration,
  AdminMaintenancePlan,
  AdminPricingPlan,
} from "../types/pricingCms.types";

export const useAdminPricingContent = () => {
  const [pricingPlans, setPricingPlans] = useState<AdminPricingPlan[]>([]);
  const [maintenancePlans, setMaintenancePlans] = useState<AdminMaintenancePlan[]>([]);
  const [emergencyRestorations, setEmergencyRestorations] = useState<AdminEmergencyRestoration[]>([]);
  const [comparisonRows, setComparisonRows] = useState<AdminComparisonRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPricingContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pricingPlanResults, maintenancePlanResults, emergencyRestorationResults, comparisonRowResults] =
        await Promise.all([
          getAdminPricingPlans(),
          getAdminMaintenancePlans(),
          getAdminEmergencyRestorations(),
          getAdminComparisonRows(),
        ]);

      setPricingPlans(pricingPlanResults);
      setMaintenancePlans(maintenancePlanResults);
      setEmergencyRestorations(emergencyRestorationResults);
      setComparisonRows(comparisonRowResults);
    } catch (error) {
      console.error("Could not load pricing CMS content:", error);
      setError("Could not load pricing CMS content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return;
      void loadPricingContent();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadPricingContent]);

  return {
    pricingPlans,
    maintenancePlans,
    emergencyRestorations,
    comparisonRows,
    isLoading,
    error,
    loadPricingContent,
  };
};
