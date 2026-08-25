import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

import { useAdminProjects } from "../hooks/useAdminProjects";

import { AdminProjectFormPanel } from "./AdminProjectFormPanel";
import { AdminProjectGrid } from "./AdminProjectGrid";
import { AdminProjectsStates } from "./AdminProjectsStates";
import { AdminProjectsToolbar } from "./AdminProjectsToolbar";

export const AdminProjectsPage: React.FC = () => {
  const {
    projects,
    filteredProjects,

    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    resetFilters,

    isCreateFormOpen,
    createProjectId,
    editingProject,

    isLoading,
    isCreatingProject,
    isUpdatingProject,
    isDeletingProjectId,

    error,
    createError,
    updateError,
    deleteError,

    loadProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,

    openCreateForm,
    openEditForm,
    cancelCreateForm,
    cancelEditForm,

    getProjectFormValues,
  } = useAdminProjects();

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Admin CMS</p>

          <h1 style={styles.title}>Projects</h1>

          <p style={styles.subtitle}>
            Manage project cards with image or video media, titles, subtitles,
            pills, layout spans, and publish status.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            type="button"
            style={styles.createButton}
            onClick={openCreateForm}
          >
            {isCreateFormOpen ? "Close Form" : "New Project"}
          </button>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={() => void loadProjects()}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {isCreateFormOpen && (
        <AdminProjectFormPanel
          mode="create"
          error={createError}
          isSubmitting={isCreatingProject}
          projectId={createProjectId ?? ""}
          onCancel={cancelCreateForm}
          onSubmit={handleCreateProject}
        />
      )}

      {editingProject && (
        <AdminProjectFormPanel
          mode="edit"
          initialValues={getProjectFormValues(editingProject)}
          error={updateError}
          isSubmitting={isUpdatingProject}
          projectId={editingProject.id}
          onCancel={cancelEditForm}
          onSubmit={handleUpdateProject}
        />
      )}

      {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

      <div style={styles.panel}>
        <AdminProjectsToolbar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          hasActiveFilters={hasActiveFilters}
          projectCount={filteredProjects.length}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onResetFilters={resetFilters}
        />

        <AdminProjectsStates
          isLoading={isLoading}
          hasProjects={projects.length > 0}
          hasError={Boolean(error)}
          hasFilteredProjects={filteredProjects.length > 0}
          hasActiveFilters={hasActiveFilters}
          error={error}
          onRetry={() => void loadProjects()}
        />

        {filteredProjects.length > 0 && (
          <AdminProjectGrid
            projects={filteredProjects}
            isDeletingProjectId={isDeletingProjectId}
            onEdit={openEditForm}
            onDelete={(project) => void handleDeleteProject(project)}
          />
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

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.xl,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 0,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    lineHeight: "40px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    maxWidth: "680px",
    margin: `${spacing.sm} 0 0 0`,
  },

  createButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontWeight: typography.fontWeight.bold,
  },

  refreshButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontWeight: typography.fontWeight.bold,
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
    color: colors.accent.yellow,
    fontSize: "14px",
  },
};
