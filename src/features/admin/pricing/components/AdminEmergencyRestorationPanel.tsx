import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import {
  createAdminEmergencyRestoration,
  deleteAdminEmergencyRestoration,
  updateAdminEmergencyRestoration,
} from "../emergencyRestoration.service";
import type {
  AdminEmergencyRestoration,
  AdminEmergencyRestorationFormValues,
} from "../pricingCms.types";
import { AdminEmergencyRestorationForm } from "./AdminEmergencyRestorationForm";
import { AdminPricingCardActions } from "./AdminPricingCardActions";
import { AdminPricingEmptyState } from "./AdminPricingEmptyState";
import { AdminPricingListCard } from "./AdminPricingListCard";
import { AdminPricingSectionPanel } from "./AdminPricingSectionPanel";

type AdminEmergencyRestorationPanelProps = {
  restorations: AdminEmergencyRestoration[];
  onRefresh: () => Promise<void>;
};

export const AdminEmergencyRestorationPanel: React.FC<
  AdminEmergencyRestorationPanelProps
> = ({ restorations, onRefresh }) => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingRestoration, setEditingRestoration] =
    useState<AdminEmergencyRestoration | null>(null);
  const [isCreatingRestoration, setIsCreatingRestoration] = useState(false);
  const [isUpdatingRestoration, setIsUpdatingRestoration] = useState(false);
  const [isDeletingRestorationId, setIsDeletingRestorationId] = useState<
    string | null
  >(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreateForm = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingRestoration(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (restoration: AdminEmergencyRestoration) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingRestoration(restoration);
  };

  const handleCreateRestoration = async (
    values: AdminEmergencyRestorationFormValues,
  ) => {
    setIsCreatingRestoration(true);
    setCreateError(null);

    try {
      await createAdminEmergencyRestoration(values);
      setIsCreateFormOpen(false);
      await onRefresh();
    } catch (error) {
      console.error("Could not create emergency restoration:", error);
      setCreateError(
        "Could not create emergency restoration. Please try again.",
      );
    } finally {
      setIsCreatingRestoration(false);
    }
  };

  const handleUpdateRestoration = async (
    values: AdminEmergencyRestorationFormValues,
  ) => {
    if (!editingRestoration) return;

    setIsUpdatingRestoration(true);
    setUpdateError(null);

    try {
      await updateAdminEmergencyRestoration({
        restorationId: editingRestoration.id,
        values,
      });

      setEditingRestoration(null);
      await onRefresh();
    } catch (error) {
      console.error("Could not update emergency restoration:", error);
      setUpdateError(
        "Could not update emergency restoration. Please try again.",
      );
    } finally {
      setIsUpdatingRestoration(false);
    }
  };

  const handleDeleteRestoration = async (
    restoration: AdminEmergencyRestoration,
  ) => {
    const isConfirmed = window.confirm(
      `Delete "${restoration.title}"? This cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeletingRestorationId(restoration.id);
    setDeleteError(null);

    try {
      await deleteAdminEmergencyRestoration(restoration.id);

      if (editingRestoration?.id === restoration.id) {
        setEditingRestoration(null);
      }

      await onRefresh();
    } catch (error) {
      console.error("Could not delete emergency restoration:", error);
      setDeleteError(
        "Could not delete emergency restoration. Please try again.",
      );
    } finally {
      setIsDeletingRestorationId(null);
    }
  };

  return (
    <AdminPricingSectionPanel
      title="Emergency Restoration"
      subtitle="Urgent one-time restoration offer shown above maintenance subscriptions."
      actionLabel={isCreateFormOpen ? "Close Form" : "New Restoration"}
      onAction={openCreateForm}
    >
      {isCreateFormOpen && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Create Emergency Restoration</h3>
            <p style={styles.formText}>
              Add the urgent fix card shown in the Pricing maintenance section.
            </p>
          </div>

          <AdminEmergencyRestorationForm
            submitLabel="Create Restoration"
            isSubmitting={isCreatingRestoration}
            error={createError}
            onCancel={() => setIsCreateFormOpen(false)}
            onSubmit={handleCreateRestoration}
          />
        </div>
      )}

      {editingRestoration && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Edit Emergency Restoration</h3>
            <p style={styles.formText}>
              Update the urgent fix card content and visibility.
            </p>
          </div>

          <AdminEmergencyRestorationForm
            initialRestoration={editingRestoration}
            submitLabel="Save Changes"
            isSubmitting={isUpdatingRestoration}
            error={updateError}
            onCancel={() => setEditingRestoration(null)}
            onSubmit={handleUpdateRestoration}
          />
        </div>
      )}

      {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

      {restorations.length === 0 ? (
        <AdminPricingEmptyState
          title="No emergency restoration item yet"
          text="Create the urgent restoration card for the Pricing page."
          actionLabel="New Restoration"
          onAction={openCreateForm}
        />
      ) : (
        <div style={styles.grid}>
          {restorations.map((restoration) => (
            <AdminPricingListCard
              key={restoration.id}
              title={restoration.title}
              eyebrow="Urgent Fix"
              price={restoration.price}
              suffix={restoration.suffix}
              description={restoration.text}
              status={restoration.status}
            >
              <AdminPricingCardActions
                onEdit={() => openEditForm(restoration)}
                onDelete={() => void handleDeleteRestoration(restoration)}
                isDeleting={isDeletingRestorationId === restoration.id}
              />
            </AdminPricingListCard>
          ))}
        </div>
      )}
    </AdminPricingSectionPanel>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: spacing.md,
  },
};
