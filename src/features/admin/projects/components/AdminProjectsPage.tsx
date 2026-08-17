import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { AdminProjectForm } from "./AdminProjectForm";
import { AdminProjectGrid } from "./AdminProjectGrid";
import { AdminProjectFilters, type ProjectFilter } from "./AdminProjectFilters";
import {
  createAdminProject,
  deleteAdminProject,
  getAdminProjects,
  updateAdminProject,
} from "../services/projectsCms.service";
import type {
  AdminProject,
  AdminProjectFormValues,
} from "../types/projectsCms.types";

const getProjectFormValues = (
  project: AdminProject,
): AdminProjectFormValues => {
  return {
    title: project.title,
    slug: project.slug,
    text: project.text,

    category: project.category,
    tags: project.tags,

    mediaType: project.mediaType,
    imageUrl: project.imageUrl,
    videoUrl: project.videoUrl,
    videoPosterUrl: project.videoPosterUrl,

    span: project.span,
    imageHeight: project.imageHeight,
    hoverAccent: project.hoverAccent,

    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,

    featured: project.featured,
    status: project.status,
    sortOrder: project.sortOrder,
  };
};

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);
  const [isDeletingProjectId, setIsDeletingProjectId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextProjects = await getAdminProjects();
      setProjects(nextProjects);
    } catch (error) {
      console.error("Could not load projects:", error);
      setError("Could not load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      const searchableText = [
        project.title,
        project.slug,
        project.text,
        project.category,
        project.mediaType,
        project.status,
        project.hoverAccent,
        project.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearchQuery ||
        searchableText.includes(normalizedSearchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [projects, searchQuery, statusFilter]);

  const hasActiveFilters = statusFilter !== "all" || searchQuery.trim();

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  const handleCreateProject = async (values: AdminProjectFormValues) => {
    setIsCreatingProject(true);
    setCreateError(null);

    try {
      await createAdminProject(values);
      setIsCreateFormOpen(false);
      await loadProjects();
    } catch (error) {
      console.error("Could not create project:", error);
      setCreateError(
        "Could not create project. Check the slug is unique and all required fields are valid.",
      );
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleUpdateProject = async (values: AdminProjectFormValues) => {
    if (!editingProject) return;

    setIsUpdatingProject(true);
    setUpdateError(null);

    try {
      await updateAdminProject({
        projectId: editingProject.id,
        values,
      });

      setEditingProject(null);
      await loadProjects();
    } catch (error) {
      console.error("Could not update project:", error);
      setUpdateError(
        "Could not update project. Check the slug is unique and all required fields are valid.",
      );
    } finally {
      setIsUpdatingProject(false);
    }
  };

  const handleDeleteProject = async (project: AdminProject) => {
    const isConfirmed = window.confirm(
      `Delete "${project.title}"? This cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeletingProjectId(project.id);
    setDeleteError(null);

    try {
      await deleteAdminProject(project.id);

      if (editingProject?.id === project.id) {
        setEditingProject(null);
      }

      await loadProjects();
    } catch (error) {
      console.error("Could not delete project:", error);
      setDeleteError("Could not delete project. Please try again.");
    } finally {
      setIsDeletingProjectId(null);
    }
  };

  const openCreateForm = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingProject(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (project: AdminProject) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingProject(project);
  };

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
            onClick={loadProjects}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {isCreateFormOpen && (
        <div style={styles.createPanel}>
          <div style={styles.createPanelHeader}>
            <div>
              <h2 style={styles.createPanelTitle}>Create project</h2>
              <p style={styles.createPanelText}>
                Add a new project card to the CMS. Draft projects stay hidden
                from the public projects page.
              </p>
            </div>
          </div>

          {createError && <div style={styles.errorBox}>{createError}</div>}

          <AdminProjectForm
            key="create-project"
            submitLabel="Create Project"
            isSubmitting={isCreatingProject}
            onCancel={() => {
              setCreateError(null);
              setIsCreateFormOpen(false);
            }}
            onSubmit={handleCreateProject}
          />
        </div>
      )}

      {editingProject && (
        <div style={styles.createPanel}>
          <div style={styles.createPanelHeader}>
            <div>
              <h2 style={styles.createPanelTitle}>Edit project</h2>
              <p style={styles.createPanelText}>
                Update project content, media, layout, tags, and publish status.
              </p>
            </div>
          </div>

          {updateError && <div style={styles.errorBox}>{updateError}</div>}

          <AdminProjectForm
            key={editingProject.id}
            initialValues={getProjectFormValues(editingProject)}
            submitLabel="Save Changes"
            isSubmitting={isUpdatingProject}
            onCancel={() => {
              setUpdateError(null);
              setEditingProject(null);
            }}
            onSubmit={handleUpdateProject}
          />
        </div>
      )}

      {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

      <div style={styles.panel}>
        <AdminProjectFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          hasActiveFilters={Boolean(hasActiveFilters)}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onReset={resetFilters}
        />

        <div style={styles.countRow}>
          <span style={styles.countBadge}>{filteredProjects.length}</span>
          <span style={styles.countText}>
            {filteredProjects.length === 1 ? "project" : "projects"} shown
          </span>
        </div>

        {isLoading && projects.length === 0 && (
          <p style={styles.stateText}>Loading projects...</p>
        )}

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>

            <button
              type="button"
              style={styles.retryButton}
              onClick={loadProjects}
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>No projects found</h2>
            <p style={styles.emptyText}>
              {hasActiveFilters
                ? "Try changing your search or filters."
                : "Projects created in the CMS will appear here."}
            </p>
          </div>
        )}

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

  countRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  countBadge: {
    minWidth: "28px",
    height: "24px",
    borderRadius: "999px",
    backgroundColor: "rgba(116, 245, 66, 0.12)",
    color: colors.accent.green,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  countText: {
    color: colors.text.muted,
    fontSize: "13px",
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
  },

  errorBox: {
    border: `1px solid rgba(255, 193, 7, 0.35)`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 193, 7, 0.08)",
    padding: spacing.lg,
  },

  errorText: {
    color: colors.accent.yellow,
    fontSize: "14px",
    margin: `0 0 ${spacing.md} 0`,
  },

  retryButton: {
    border: `1px solid rgba(255, 193, 7, 0.45)`,
    borderRadius: radius.md,
    backgroundColor: "transparent",
    color: colors.accent.yellow,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
  },

  emptyState: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "18px",
    margin: 0,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
