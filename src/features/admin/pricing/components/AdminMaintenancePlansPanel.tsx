import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import {
  createAdminMaintenancePlan,
  deleteAdminMaintenancePlan,
  updateAdminMaintenancePlan,
} from "../maintenancePlans.service";
import type {
  AdminMaintenancePlan,
  AdminMaintenancePlanFormValues,
} from "../pricingCms.types";
import { AdminMaintenancePlanForm } from "./AdminMaintenancePlanForm";
import { AdminPricingCardActions } from "./AdminPricingCardActions";
import { AdminPricingEmptyState } from "./AdminPricingEmptyState";
import { AdminPricingFeatureList } from "./AdminPricingFeatureList";
import { AdminPricingListCard } from "./AdminPricingListCard";
import { AdminPricingSectionPanel } from "./AdminPricingSectionPanel";

type AdminMaintenancePlansPanelProps = {
  plans: AdminMaintenancePlan[];
  onRefresh: () => Promise<void>;
};

export const AdminMaintenancePlansPanel: React.FC<
  AdminMaintenancePlansPanelProps
> = ({ plans, onRefresh }) => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminMaintenancePlan | null>(
    null,
  );
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isDeletingPlanId, setIsDeletingPlanId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreateForm = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingPlan(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (plan: AdminMaintenancePlan) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingPlan(plan);
  };

  const handleCreatePlan = async (values: AdminMaintenancePlanFormValues) => {
    setIsCreatingPlan(true);
    setCreateError(null);

    try {
      await createAdminMaintenancePlan(values);
      setIsCreateFormOpen(false);
      await onRefresh();
    } catch (error) {
      console.error("Could not create maintenance plan:", error);
      setCreateError("Could not create maintenance plan. Please try again.");
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleUpdatePlan = async (values: AdminMaintenancePlanFormValues) => {
    if (!editingPlan) return;

    setIsUpdatingPlan(true);
    setUpdateError(null);

    try {
      await updateAdminMaintenancePlan({
        planId: editingPlan.id,
        values,
      });

      setEditingPlan(null);
      await onRefresh();
    } catch (error) {
      console.error("Could not update maintenance plan:", error);
      setUpdateError("Could not update maintenance plan. Please try again.");
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const handleDeletePlan = async (plan: AdminMaintenancePlan) => {
    const isConfirmed = window.confirm(
      `Delete "${plan.name}"? This cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeletingPlanId(plan.id);
    setDeleteError(null);

    try {
      await deleteAdminMaintenancePlan(plan.id);

      if (editingPlan?.id === plan.id) {
        setEditingPlan(null);
      }

      await onRefresh();
    } catch (error) {
      console.error("Could not delete maintenance plan:", error);
      setDeleteError("Could not delete maintenance plan. Please try again.");
    } finally {
      setIsDeletingPlanId(null);
    }
  };

  return (
    <AdminPricingSectionPanel
      title="Maintenance Plans"
      subtitle="Monthly maintenance subscriptions used by the Pricing page and later the Home Subscription section."
      actionLabel={isCreateFormOpen ? "Close Form" : "New Maintenance Plan"}
      onAction={openCreateForm}
    >
      {isCreateFormOpen && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Create Maintenance Plan</h3>
            <p style={styles.formText}>
              Add a monthly support package for websites and applications.
            </p>
          </div>

          <AdminMaintenancePlanForm
            submitLabel="Create Plan"
            isSubmitting={isCreatingPlan}
            error={createError}
            onCancel={() => setIsCreateFormOpen(false)}
            onSubmit={handleCreatePlan}
          />
        </div>
      )}

      {editingPlan && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Edit Maintenance Plan</h3>
            <p style={styles.formText}>
              Update this maintenance subscription and its public display
              details.
            </p>
          </div>

          <AdminMaintenancePlanForm
            initialPlan={editingPlan}
            submitLabel="Save Changes"
            isSubmitting={isUpdatingPlan}
            error={updateError}
            onCancel={() => setEditingPlan(null)}
            onSubmit={handleUpdatePlan}
          />
        </div>
      )}

      {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

      {plans.length === 0 ? (
        <AdminPricingEmptyState
          title="No maintenance plans yet"
          text="Create your first maintenance subscription plan."
          actionLabel="New Maintenance Plan"
          onAction={openCreateForm}
        />
      ) : (
        <div style={styles.grid}>
          {plans.map((plan) => (
            <AdminPricingListCard
              key={plan.id}
              title={plan.name}
              eyebrow="Maintenance"
              price={plan.price}
              suffix={plan.suffix}
              description={plan.description}
              status={plan.status}
              recommended={plan.recommended}
              metaItems={[
                `CTA: ${plan.ctaLabel}`,
                `Link: ${plan.ctaTo}`,
                `Order: ${plan.sortOrder}`,
              ]}
            >
              <AdminPricingFeatureList features={plan.features} />

              <AdminPricingCardActions
                onEdit={() => openEditForm(plan)}
                onDelete={() => void handleDeletePlan(plan)}
                isDeleting={isDeletingPlanId === plan.id}
              />
            </AdminPricingListCard>
          ))}
        </div>
      )}
    </AdminPricingSectionPanel>
  );
};

const styles = {
  formPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  formHeader: {
    marginBottom: spacing.lg,
  },

  formTitle: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  formText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.xs} 0 0 0`,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
    marginBottom: spacing.lg,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: spacing.md,
  },
};
