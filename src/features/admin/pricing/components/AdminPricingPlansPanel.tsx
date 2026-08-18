import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { useAdminPricingCrudPanel } from "../hooks/useAdminPricingCrudPanel";
import {
  createAdminPricingPlan,
  deleteAdminPricingPlan,
  updateAdminPricingPlan,
} from "../services/pricingPlans.service";
import type {
  AdminPricingPlan,
  AdminPricingPlanFormValues,
} from "../types/pricingCms.types";
import { AdminPricingCardActions } from "./AdminPricingCardActions";
import { AdminPricingEmptyState } from "./AdminPricingEmptyState";
import { AdminPricingFeatureList } from "./AdminPricingFeatureList";
import { AdminPricingListCard } from "./AdminPricingListCard";
import { AdminPricingPlanForm } from "./AdminPricingPlanForm";
import { AdminPricingSectionPanel } from "./AdminPricingSectionPanel";

type AdminPricingPlansPanelProps = {
  plans: AdminPricingPlan[];
  onRefresh: () => Promise<void>;
};

export const AdminPricingPlansPanel: React.FC<AdminPricingPlansPanelProps> = ({
  plans,
  onRefresh,
}) => {
  const {
    isCreateFormOpen,
    editingItem: editingPlan,
    isCreating: isCreatingPlan,
    isUpdating: isUpdatingPlan,
    isDeletingId: isDeletingPlanId,
    createError,
    updateError,
    deleteError,
    openCreateForm,
    openEditForm,
    setIsCreateFormOpen,
    setEditingItem: setEditingPlan,
    handleCreate: handleCreatePlan,
    handleUpdate: handleUpdatePlan,
    handleDelete: handleDeletePlan,
  } = useAdminPricingCrudPanel<AdminPricingPlan, AdminPricingPlanFormValues>({
    onRefresh,
    create: createAdminPricingPlan,
    update: ({ itemId, values }) => updateAdminPricingPlan({ planId: itemId, values }),
    remove: deleteAdminPricingPlan,
    deleteLabel: (plan) => plan.name,
    createErrorMessage: "Could not create pricing plan. Please try again.",
    updateErrorMessage: "Could not update pricing plan. Please try again.",
    deleteErrorMessage: "Could not delete pricing plan. Please try again.",
    createLogMessage: "Could not create pricing plan:",
    updateLogMessage: "Could not update pricing plan:",
    deleteLogMessage: "Could not delete pricing plan:",
  });

  return (
    <AdminPricingSectionPanel
      title="Build Pricing Plans"
      subtitle="Main website and application build packages shown on the Pricing page."
      actionLabel={isCreateFormOpen ? "Close Form" : "New Plan"}
      onAction={openCreateForm}
    >
      {isCreateFormOpen && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Create Pricing Plan</h3>
            <p style={styles.formText}>
              Add a new build package for the public Pricing page.
            </p>
          </div>

          <AdminPricingPlanForm
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
            <h3 style={styles.formTitle}>Edit Pricing Plan</h3>
            <p style={styles.formText}>
              Update this build package and its public display details.
            </p>
          </div>

          <AdminPricingPlanForm
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
          title="No pricing plans yet"
          text="Create your first build pricing plan."
          actionLabel="New Plan"
          onAction={openCreateForm}
        />
      ) : (
        <div style={styles.grid}>
          {plans.map((plan) => (
            <AdminPricingListCard
              key={plan.id}
              title={plan.name}
              eyebrow={plan.label}
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
