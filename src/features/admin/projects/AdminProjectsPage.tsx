import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { AdminProjectForm } from "./AdminProjectForm";
import { createAdminProject, getAdminProjects } from "./projectsCms.service";
import type { AdminProject, ProjectStatus } from "./projectsCms.types";

type ProjectFilter = "all" | ProjectStatus;

const getProjectMediaPreview = (project: AdminProject) => {
  if (project.mediaType === "video") {
    return project.videoPosterUrl ?? project.imageUrl;
  }

  return project.imageUrl ?? project.videoPosterUrl;
};

const getProjectStatusStyle = (status: ProjectStatus) => {
  if (status === "published") {
    return styles.publishedBadge;
  }

  return styles.draftBadge;
};

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

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

  const handleCreateProject = async (
    values: Parameters<typeof createAdminProject>[0],
  ) => {
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
            onClick={() => {
              setCreateError(null);
              setIsCreateFormOpen((currentValue) => !currentValue);
            }}
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

      <div style={styles.panel}>
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search projects..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterRow}>
            <button
              type="button"
              style={{
                ...styles.filterButton,
                ...(statusFilter === "all" ? styles.activeFilter : {}),
              }}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              style={{
                ...styles.filterButton,
                ...(statusFilter === "published" ? styles.activeFilter : {}),
              }}
              onClick={() => setStatusFilter("published")}
            >
              Published
            </button>

            <button
              type="button"
              style={{
                ...styles.filterButton,
                ...(statusFilter === "draft" ? styles.activeFilter : {}),
              }}
              onClick={() => setStatusFilter("draft")}
            >
              Draft
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                style={styles.resetButton}
                onClick={resetFilters}
              >
                Reset
              </button>
            )}
          </div>
        </div>

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
          <div style={styles.projectGrid}>
            {filteredProjects.map((project) => {
              const mediaPreview = getProjectMediaPreview(project);

              return (
                <article key={project.id} style={styles.projectCard}>
                  <div style={styles.mediaWrap}>
                    {mediaPreview ? (
                      <img
                        src={mediaPreview}
                        alt={project.title}
                        style={styles.mediaImage}
                      />
                    ) : (
                      <div style={styles.mediaPlaceholder}>
                        No media preview
                      </div>
                    )}

                    {project.mediaType === "video" && (
                      <span style={styles.videoBadge}>Video</span>
                    )}
                  </div>

                  <div style={styles.projectContent}>
                    <div style={styles.projectTopRow}>
                      <div>
                        <h2 style={styles.projectTitle}>{project.title}</h2>
                        <p style={styles.projectSlug}>/{project.slug}</p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getProjectStatusStyle(project.status),
                        }}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p style={styles.projectText}>{project.text}</p>

                    <div style={styles.metaGrid}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Category</span>
                        <span style={styles.metaValue}>{project.category}</span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Layout</span>
                        <span style={styles.metaValue}>
                          {project.span} / {project.imageHeight}
                        </span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Accent</span>
                        <span style={styles.metaValue}>
                          {project.hoverAccent}
                        </span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Order</span>
                        <span style={styles.metaValue}>
                          {project.sortOrder}
                        </span>
                      </div>
                    </div>

                    <div style={styles.pillRow}>
                      {project.tags.map((tag) => (
                        <span key={tag} style={styles.pill}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
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

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    flexWrap: "wrap" as const,
    marginBottom: spacing.lg,
  },

  searchWrap: {
    flex: "1 1 280px",
  },

  searchInput: {
    width: "100%",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.muted,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  activeFilter: {
    color: colors.text.main,
    borderColor: colors.accent.green,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
  },

  resetButton: {
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.muted,
    cursor: "pointer",
    fontSize: "13px",
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

  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
  },

  projectCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    overflow: "hidden",
  },

  mediaWrap: {
    height: "180px",
    position: "relative" as const,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  mediaImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  mediaPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    fontSize: "13px",
  },

  videoBadge: {
    position: "absolute" as const,
    right: spacing.md,
    top: spacing.md,
    borderRadius: "999px",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
    color: colors.text.main,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  projectContent: {
    padding: spacing.lg,
  },

  projectTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  projectTitle: {
    color: colors.text.main,
    fontSize: "17px",
    lineHeight: "22px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  projectSlug: {
    color: colors.text.muted,
    fontSize: "12px",
    margin: "4px 0 0 0",
  },

  statusBadge: {
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase" as const,
  },

  publishedBadge: {
    color: colors.accent.green,
    backgroundColor: "rgba(116, 245, 66, 0.1)",
    border: `1px solid rgba(116, 245, 66, 0.35)`,
  },

  draftBadge: {
    color: colors.text.muted,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${colors.border.default}`,
  },

  projectText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.md} 0`,
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing.sm,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: spacing.sm,
  },

  metaLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "11px",
    marginBottom: "4px",
  },

  metaValue: {
    color: colors.text.main,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  pillRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  pill: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: "999px",
    color: colors.text.muted,
    padding: "5px 9px",
    fontSize: "11px",
  },
};
