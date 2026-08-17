import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { AdminServiceForm } from "./AdminServiceForm";
import { AdminServiceCard } from "./components/AdminServiceCard";
import { AdminServicesHeader } from "./components/AdminServicesHeader";
import { AdminServicesState } from "./components/AdminServicesState";
import { AdminServicesToolbar } from "./components/AdminServicesToolbar";
import {
  getServiceFormValues,
  useAdminServices,
} from "./hooks/useAdminServices";

export const AdminServicesPage: React.FC = () => {
  const {
    filteredServices,

    statusFilter,
    searchQuery,
    hasActiveFilters,

    isCreateFormOpen,
    editingService,

    isLoading,
    isCreatingService,
    isUpdatingService,
    isDeletingServiceId,

    error,
    createError,
    updateError,
    deleteError,

    setStatusFilter,
    setSearchQuery,

    loadServices,
    resetFilters,

    handleCreateService,
    handleUpdateService,
    handleDeleteService,

    openCreateForm,
    openEditForm,
    closeCreateForm,
    closeEditForm,
  } = useAdminServices();

  return (
    <section style={styles.page}>
      <AdminServicesHeader
        isCreateFormOpen={isCreateFormOpen}
        isLoading={isLoading}
        onCreateToggle={openCreateForm}
        onRefresh={loadServices}
      />

      <div style={styles.panel}>
        {isCreateFormOpen && (
          <div style={styles.createPanel}>
            <div style={styles.createPanelHeader}>
              <div>
                <h2 style={styles.createPanelTitle}>Create service</h2>

                <p style={styles.createPanelText}>
                  Add a new service card to the CMS. Draft services stay hidden
                  from the public services page.
                </p>
              </div>
            </div>

            {createError && <div style={styles.errorBox}>{createError}</div>}

            <AdminServiceForm
              key="create-service"
              submitLabel="Create Service"
              isSubmitting={isCreatingService}
              onCancel={closeCreateForm}
              onSubmit={handleCreateService}
            />
          </div>
        )}

        {editingService && (
          <div style={styles.createPanel}>
            <div style={styles.createPanelHeader}>
              <div>
                <h2 style={styles.createPanelTitle}>Edit service</h2>

                <p style={styles.createPanelText}>
                  Update service content, icon, image, pills, layout, badge,
                  monitoring, and publish status.
                </p>
              </div>
            </div>

            {updateError && <div style={styles.errorBox}>{updateError}</div>}

            <AdminServiceForm
              key={editingService.id}
              initialValues={getServiceFormValues(editingService)}
              submitLabel="Save Changes"
              isSubmitting={isUpdatingService}
              onCancel={closeEditForm}
              onSubmit={handleUpdateService}
            />
          </div>
        )}

        {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

        <AdminServicesToolbar
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          hasActiveFilters={hasActiveFilters}
          filteredServicesCount={filteredServices.length}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onResetFilters={resetFilters}
        />

        <AdminServicesState
          isLoading={isLoading}
          hasError={Boolean(error)}
          error={error}
          hasServices={filteredServices.length > 0}
          hasActiveFilters={hasActiveFilters}
          onRetry={loadServices}
        />

        {filteredServices.length > 0 && (
          <div style={styles.serviceGrid}>
            {filteredServices.map((service) => (
              <AdminServiceCard
                key={service.id}
                service={service}
                isDeleting={isDeletingServiceId === service.id}
                onEdit={openEditForm}
                onDelete={(selectedService) => {
                  void handleDeleteService(selectedService);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xl,
  },

  createPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  createPanelHeader: {
    marginBottom: spacing.lg,
  },

  createPanelTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  createPanelText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },

  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  errorBox: {
    border: `1px solid rgba(255, 193, 7, 0.35)`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 193, 7, 0.08)",
    padding: spacing.lg,
  },

  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
  },
};
