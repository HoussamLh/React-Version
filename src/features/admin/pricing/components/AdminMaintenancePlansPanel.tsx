import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { useAdminPricingCrudPanel } from "../hooks/useAdminPricingCrudPanel";
import {
  createAdminMaintenancePlan,
  deleteAdminMaintenancePlan,
  updateAdminMaintenancePlan,
} from "../services/maintenancePlans.service";
import type {
  AdminMaintenancePlan,
  AdminMaintenancePlanFormValues,
} from "../types/pricingCms.types";
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
  } = useAdminPricingCrudPanel<AdminMaintenancePlan, AdminMaintenancePlanFormValues>({
    onRefresh,
    create: createAdminMaintenancePlan,
    update: ({ itemId, values }) => updateAdminMaintenancePlan({ planId: itemId, values }),
    remove: deleteAdminMaintenancePlan,
    deleteLabel: (plan) => plan.name,
    createErrorMessage: "Could not create maintenance plan. Please try again.",
    updateErrorMessage: "Could not update maintenance plan. Please try again.",
    deleteErrorMessage: "Could not delete maintenance plan. Please try again.",
    createLogMessage: "Could not create maintenance plan:",
    updateLogMessage: "Could not update maintenance plan:",
    deleteLogMessage: "Could not delete maintenance plan:",
  });

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
