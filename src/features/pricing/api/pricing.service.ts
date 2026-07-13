import { supabase } from "../../../lib/supabase";
import type {
  ComparisonRow,
  EmergencyRestoration,
  MaintenancePlan,
  PricingPlan,
} from "../data/pricing.data";

type PricingPlanRow = {
  name: string;
  label: string;
  price: string;
  suffix: string | null;
  description: string;
  features: string[];
  cta_label: string;
  cta_to: string;
  recommended: boolean;
};

type MaintenancePlanRow = {
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  cta_label: string;
  cta_to: string;
  recommended: boolean;
};

type EmergencyRestorationRow = {
  title: string;
  price: string;
  suffix: string;
  text: string;
};

type ComparisonRowRecord = {
  feature: string;
  standard: string;
  advanced: string;
  premium: string;
};

const mapPricingPlanRow = (row: PricingPlanRow): PricingPlan => {
  return {
    name: row.name,
    label: row.label,
    price: row.price,
    suffix: row.suffix ?? undefined,
    description: row.description,
    features: row.features ?? [],
    ctaLabel: row.cta_label,
    ctaTo: row.cta_to,
    recommended: row.recommended,
  };
};

const mapMaintenancePlanRow = (row: MaintenancePlanRow): MaintenancePlan => {
  return {
    name: row.name,
    price: row.price,
    suffix: row.suffix,
    description: row.description,
    features: row.features ?? [],
    ctaLabel: row.cta_label,
    ctaTo: row.cta_to,
    recommended: row.recommended,
  };
};

const mapEmergencyRestorationRow = (
  row: EmergencyRestorationRow,
): EmergencyRestoration => {
  return {
    title: row.title,
    price: row.price,
    suffix: row.suffix,
    text: row.text,
  };
};

const mapComparisonRow = (row: ComparisonRowRecord): ComparisonRow => {
  return {
    feature: row.feature,
    standard: row.standard,
    advanced: row.advanced,
    premium: row.premium,
  };
};

export const getPublishedPricingPlans = async (): Promise<PricingPlan[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("pricing_plans")
    .select(
      "name, label, price, suffix, description, features, cta_label, cta_to, recommended",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PricingPlanRow[]).map(mapPricingPlanRow);
};

export const getPublishedMaintenancePlans = async (): Promise<
  MaintenancePlan[]
> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("maintenance_plans")
    .select(
      "name, price, suffix, description, features, cta_label, cta_to, recommended",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as MaintenancePlanRow[]).map(mapMaintenancePlanRow);
};

export const getPublishedEmergencyRestoration =
  async (): Promise<EmergencyRestoration | null> => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("emergency_restoration")
      .select("title, price, suffix, text")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapEmergencyRestorationRow(data as EmergencyRestorationRow);
  };

export const getPublishedComparisonRows = async (): Promise<
  ComparisonRow[]
> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("comparison_rows")
    .select("feature, standard, advanced, premium")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ComparisonRowRecord[]).map(mapComparisonRow);
};
