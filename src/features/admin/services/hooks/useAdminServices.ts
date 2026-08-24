import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createAdminService,
  deleteAdminService,
  getAdminServices,
  updateAdminService,
} from "../services/servicesCms.service";
import type {
  AdminService,
  AdminServiceFormValues,
  ServiceStatus,
} from "../types/servicesCms.types";

export type ServiceFilter = "all" | ServiceStatus;

export const getServiceFormValues = (
  service: AdminService,
): AdminServiceFormValues => {
  return {
    title: service.title,
    slug: service.slug,
    text: service.text,

    icon: service.icon,
    imageUrl: service.imageUrl,
    imagePublicId: service.imagePublicId,

    pills: service.pills,

    span: service.span,
    badge: service.badge,
    monitoring: service.monitoring,

    hoverAccent: service.hoverAccent,

    status: service.status,
    sortOrder: service.sortOrder,
  };
};

export const useAdminServices = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [statusFilter, setStatusFilter] = useState<ServiceFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [createServiceId, setCreateServiceId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<AdminService | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [isUpdatingService, setIsUpdatingService] = useState(false);
  const [isDeletingServiceId, setIsDeletingServiceId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextServices = await getAdminServices();
      setServices(nextServices);
    } catch (error) {
      console.error("Could not load services:", error);
      setError("Could not load services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadServices();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadServices]);

  const filteredServices = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return services.filter((service) => {
      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      const searchableText = [
        service.title,
        service.slug,
        service.text,
        service.icon,
        service.span,
        service.badge ?? "",
        service.status,
        service.hoverAccent,
        service.pills.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearchQuery ||
        searchableText.includes(normalizedSearchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [services, searchQuery, statusFilter]);

  const hasActiveFilters =
    statusFilter !== "all" || searchQuery.trim().length > 0;

  const resetFilters = useCallback(() => {
    setStatusFilter("all");
    setSearchQuery("");
  }, []);

  const handleCreateService = useCallback(
    async (values: AdminServiceFormValues) => {
      setIsCreatingService(true);
      setCreateError(null);

      try {
        await createAdminService(values, createServiceId ?? undefined);
        setIsCreateFormOpen(false);
        await loadServices();
      } catch (error) {
        console.error("Could not create service:", error);
        setCreateError(
          "Could not create service. Check the slug is unique and all required fields are valid.",
        );
      } finally {
        setIsCreatingService(false);
      }
    },
    [createServiceId, loadServices],
  );

  const handleUpdateService = useCallback(
    async (values: AdminServiceFormValues) => {
      if (!editingService) {
        return;
      }

      setIsUpdatingService(true);
      setUpdateError(null);

      try {
        await updateAdminService({
          serviceId: editingService.id,
          values,
        });

        setEditingService(null);
        await loadServices();
      } catch (error) {
        console.error("Could not update service:", error);
        setUpdateError(
          "Could not update service. Check the slug is unique and all required fields are valid.",
        );
      } finally {
        setIsUpdatingService(false);
      }
    },
    [editingService, loadServices],
  );

  const handleDeleteService = useCallback(
    async (service: AdminService) => {
      const isConfirmed = window.confirm(
        `Delete "${service.title}"? This cannot be undone.`,
      );

      if (!isConfirmed) {
        return;
      }

      setIsDeletingServiceId(service.id);
      setDeleteError(null);

      try {
        await deleteAdminService(service.id);

        if (editingService?.id === service.id) {
          setEditingService(null);
        }

        await loadServices();
      } catch (error) {
        console.error("Could not delete service:", error);
        setDeleteError("Could not delete service. Please try again.");
      } finally {
        setIsDeletingServiceId(null);
      }
    },
    [editingService, loadServices],
  );

  const openCreateForm = useCallback(() => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingService(null);

    setIsCreateFormOpen((currentValue) => {
      const nextValue = !currentValue;

      setCreateServiceId(nextValue ? crypto.randomUUID() : null);

      return nextValue;
    });
  }, []);

  const openEditForm = useCallback((service: AdminService) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingService(service);
  }, []);

  const closeCreateForm = useCallback(() => {
    setCreateError(null);
    setIsCreateFormOpen(false);
    setCreateServiceId(null);
  }, []);

  const closeEditForm = useCallback(() => {
    setUpdateError(null);
    setEditingService(null);
  }, []);

  return {
    services,
    filteredServices,

    statusFilter,
    searchQuery,
    hasActiveFilters,

    isCreateFormOpen,
    createServiceId,
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
  };
};
