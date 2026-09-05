import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createAdminProject,
  deleteAdminProject,
  getAdminProjects,
  updateAdminProject,
} from "../services/projectsCms.service";
import type {
  AdminProject,
  AdminProjectFormValues,
  ProjectStatus,
} from "../types/projectsCms.types";

export type ProjectFilter = "all" | ProjectStatus;

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
    imagePublicId: project.imagePublicId,
    videoUrl: project.videoUrl,
    videoPublicId: project.videoPublicId,
    videoPosterUrl: project.videoPosterUrl,
    videoPosterPublicId: project.videoPosterPublicId,

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

export const useAdminProjects = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [createProjectId, setCreateProjectId] = useState<string | null>(null);
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

  const hasActiveFilters =
    statusFilter !== "all" || Boolean(searchQuery.trim());

  const resetFilters = useCallback(() => {
    setStatusFilter("all");
    setSearchQuery("");
  }, []);

  const handleCreateProject = useCallback(
    async (values: AdminProjectFormValues) => {
      setIsCreatingProject(true);
      setCreateError(null);

      try {
        await createAdminProject(values, createProjectId ?? undefined);
        setIsCreateFormOpen(false);
        void loadProjects();
      } catch (error) {
        console.error("Could not create project:", error);
        setCreateError(
          "Could not create project. Check the slug is unique and all required fields are valid.",
        );
        throw error;
      } finally {
        setIsCreatingProject(false);
      }
    },
    [createProjectId, loadProjects],
  );

  const handleUpdateProject = useCallback(
    async (values: AdminProjectFormValues) => {
      if (!editingProject) return;

      setIsUpdatingProject(true);
      setUpdateError(null);

      try {
        await updateAdminProject({
          projectId: editingProject.id,
          values,
        });

        setEditingProject(null);
        void loadProjects();
      } catch (error) {
        console.error("Could not update project:", error);
        setUpdateError(
          "Could not update project. Check the slug is unique and all required fields are valid.",
        );
        throw error;
      } finally {
        setIsUpdatingProject(false);
      }
    },
    [editingProject, loadProjects],
  );

  const handleDeleteProject = useCallback(
    async (project: AdminProject) => {
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
    },
    [editingProject, loadProjects],
  );

  const openCreateForm = useCallback(() => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingProject(null);
    setIsCreateFormOpen((currentValue) => {
      const nextValue = !currentValue;
      setCreateProjectId(nextValue ? crypto.randomUUID() : null);
      return nextValue;
    });
  }, []);

  const openEditForm = useCallback((project: AdminProject) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingProject(project);
  }, []);

  const cancelCreateForm = useCallback(() => {
    setCreateError(null);
    setIsCreateFormOpen(false);
    setCreateProjectId(null);
  }, []);

  const cancelEditForm = useCallback(() => {
    setUpdateError(null);
    setEditingProject(null);
  }, []);

  return {
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
  };
};
