import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import {
  createAdminComparisonRow,
  deleteAdminComparisonRow,
  updateAdminComparisonRow,
} from "../comparisonRows.service";
import type {
  AdminComparisonRow,
  AdminComparisonRowFormValues,
} from "../pricingCms.types";
import { AdminComparisonRowForm } from "./AdminComparisonRowForm";
import { AdminPricingCardActions } from "./AdminPricingCardActions";
import { AdminPricingEmptyState } from "./AdminPricingEmptyState";
import { AdminPricingListCard } from "./AdminPricingListCard";
import { AdminPricingSectionPanel } from "./AdminPricingSectionPanel";

type AdminComparisonRowsPanelProps = {
  rows: AdminComparisonRow[];
  onRefresh: () => Promise<void>;
};

export const AdminComparisonRowsPanel: React.FC<
  AdminComparisonRowsPanelProps
> = ({ rows, onRefresh }) => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AdminComparisonRow | null>(null);
  const [isCreatingRow, setIsCreatingRow] = useState(false);
  const [isUpdatingRow, setIsUpdatingRow] = useState(false);
  const [isDeletingRowId, setIsDeletingRowId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreateForm = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingRow(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (row: AdminComparisonRow) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingRow(row);
  };

  const handleCreateRow = async (values: AdminComparisonRowFormValues) => {
    setIsCreatingRow(true);
    setCreateError(null);

    try {
      await createAdminComparisonRow(values);
      setIsCreateFormOpen(false);
      await onRefresh();
    } catch (error) {
      console.error("Could not create comparison row:", error);
      setCreateError("Could not create comparison row. Please try again.");
    } finally {
      setIsCreatingRow(false);
    }
  };

  const handleUpdateRow = async (values: AdminComparisonRowFormValues) => {
    if (!editingRow) return;

    setIsUpdatingRow(true);
    setUpdateError(null);

    try {
      await updateAdminComparisonRow({
        rowId: editingRow.id,
        values,
      });

      setEditingRow(null);
      await onRefresh();
    } catch (error) {
      console.error("Could not update comparison row:", error);
      setUpdateError("Could not update comparison row. Please try again.");
    } finally {
      setIsUpdatingRow(false);
    }
  };

const handleDeleteRow = async (row: AdminComparisonRow) => {
  const isConfirmed = window.confirm(
    `Delete "${row.feature}"? This cannot be undone.`,
  );

  if (!isConfirmed) return;

  setIsDeletingRowId(row.id);
  setDeleteError(null);

  try {
    await deleteAdminComparisonRow(row.id);

    if (editingRow?.id === row.id) {
      setEditingRow(null);
    }

    await onRefresh();
  } catch (error) {
    console.error("Could not delete comparison row:", error);
    setDeleteError("Could not delete comparison row. Please try again.");
  } finally {
    setIsDeletingRowId(null);
  }
};

  return (
    <AdminPricingSectionPanel
      title="Comparison Rows"
      subtitle="Rows shown inside the Pricing comparison table."
      actionLabel={isCreateFormOpen ? "Close Form" : "New Row"}
      onAction={openCreateForm}
    >
      {isCreateFormOpen && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Create Comparison Row</h3>
            <p style={styles.formText}>
              Add a new row to the public Pricing comparison table.
            </p>
          </div>

          <AdminComparisonRowForm
            submitLabel="Create Row"
            isSubmitting={isCreatingRow}
            error={createError}
            onCancel={() => setIsCreateFormOpen(false)}
            onSubmit={handleCreateRow}
          />
        </div>
      )}

      {editingRow && (
        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Edit Comparison Row</h3>
            <p style={styles.formText}>
              Update this row and its plan comparison values.
            </p>
          </div>

          <AdminComparisonRowForm
            initialRow={editingRow}
            submitLabel="Save Changes"
            isSubmitting={isUpdatingRow}
            error={updateError}
            onCancel={() => setEditingRow(null)}
            onSubmit={handleUpdateRow}
          />
        </div>
      )}

      {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

      {rows.length === 0 ? (
        <AdminPricingEmptyState
          title="No comparison rows yet"
          text="Create your first comparison table row."
          actionLabel="New Row"
          onAction={openCreateForm}
        />
      ) : (
        <div style={styles.grid}>
          {rows.map((row) => (
            <AdminPricingListCard
              key={row.id}
              title={row.feature}
              eyebrow="Comparison Row"
              status={row.status}
              metaItems={[`Order: ${row.sortOrder}`]}
            >
              <div style={styles.comparisonValues}>
                <div style={styles.comparisonValue}>
                  <span style={styles.comparisonLabel}>Standard</span>
                  <strong style={styles.comparisonText}>{row.standard}</strong>
                </div>

                <div style={styles.comparisonValue}>
                  <span style={styles.comparisonLabel}>Advanced</span>
                  <strong style={styles.comparisonText}>{row.advanced}</strong>
                </div>

                <div style={styles.comparisonValue}>
                  <span style={styles.comparisonLabel}>Premium</span>
                  <strong style={styles.comparisonText}>{row.premium}</strong>
                </div>
              </div>

              <AdminPricingCardActions
                onEdit={() => openEditForm(row)}
                onDelete={() => void handleDeleteRow(row)}
                isDeleting={isDeletingRowId === row.id}
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
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: spacing.md,
  },

  comparisonValues: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: spacing.sm,
  },

  comparisonValue: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  comparisonLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "11px",
    lineHeight: "16px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: spacing.xs,
  },

  comparisonText: {
    color: colors.text.main,
    fontSize: "13px",
    lineHeight: "18px",
  },
};