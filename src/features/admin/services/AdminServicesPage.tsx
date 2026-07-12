import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Code, Server, ShieldCheck, Smartphone } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { AdminServiceForm } from "./AdminServiceForm";
import {
  createAdminService,
  deleteAdminService,
  getAdminServices,
  updateAdminService,
} from "./servicesCms.service";
import type {
  AdminService,
  AdminServiceFormValues,
  ServiceStatus,
} from "./servicesCms.types";

type ServiceFilter = "all" | ServiceStatus;

const serviceIconMap: Record<AdminService["icon"], React.ReactNode> = {
  code: <Code size={22} />,
  smartphone: <Smartphone size={22} />,
  server: <Server size={22} />,
  "shield-check": <ShieldCheck size={22} />,
};

const getServiceStatusStyle = (status: ServiceStatus) => {
  if (status === "published") {
    return styles.publishedBadge;
  }

  return styles.draftBadge;
};

const getServiceFormValues = (
  service: AdminService,
): AdminServiceFormValues => {
  return {
    title: service.title,
    slug: service.slug,
    text: service.text,

    icon: service.icon,
    imageUrl: service.imageUrl,

    pills: service.pills,

    span: service.span,
    badge: service.badge,
    monitoring: service.monitoring,

    hoverAccent: service.hoverAccent,

    status: service.status,
    sortOrder: service.sortOrder,
  };
};

export const AdminServicesPage: React.FC = () => {

  const [services, setServices] = useState<AdminService[]>([]);
  const [statusFilter, setStatusFilter] = useState<ServiceFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null,);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [isUpdatingService, setIsUpdatingService] = useState(false);
  const [isDeletingServiceId, setIsDeletingServiceId] = useState<string | null>(null,);
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

  const hasActiveFilters = statusFilter !== "all" || searchQuery.trim();

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  const handleCreateService = async (values: AdminServiceFormValues) => {
    setIsCreatingService(true);
    setCreateError(null);

    try {
      await createAdminService(values);
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
  };

  const handleUpdateService = async (values: AdminServiceFormValues) => {
    if (!editingService) return;

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
  };

  const handleDeleteService = async (service: AdminService) => {
    const isConfirmed = window.confirm(
      `Delete "${service.title}"? This cannot be undone.`,
    );

    if (!isConfirmed) return;

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
  };

  const openCreateForm = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingService(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (service: AdminService) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingService(service);
  };

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Admin CMS</p>
          <h1 style={styles.title}>Services</h1>
          <p style={styles.subtitle}>
            Manage service cards, icons, images, pills, layout spans, badges,
            monitoring status, and publish visibility.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            type="button"
            style={styles.createButton}
            onClick={openCreateForm}
          >
            {isCreateFormOpen ? "Close Form" : "New Service"}
          </button>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={loadServices}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

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
              onCancel={() => {
                setCreateError(null);
                setIsCreateFormOpen(false);
              }}
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
              onCancel={() => {
                setUpdateError(null);
                setEditingService(null);
              }}
              onSubmit={handleUpdateService}
            />
          </div>
        )}

        {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search services..."
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
          <span style={styles.countBadge}>{filteredServices.length}</span>
          <span style={styles.countText}>
            {filteredServices.length === 1 ? "service" : "services"} shown
          </span>
        </div>

        {isLoading && services.length === 0 && (
          <p style={styles.stateText}>Loading services...</p>
        )}

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>

            <button
              type="button"
              style={styles.retryButton}
              onClick={loadServices}
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && filteredServices.length === 0 && (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>No services found</h2>
            <p style={styles.emptyText}>
              {hasActiveFilters
                ? "Try changing your search or filters."
                : "Services created in the CMS will appear here."}
            </p>
          </div>
        )}

        {filteredServices.length > 0 && (
          <div style={styles.serviceGrid}>
            {filteredServices.map((service) => (
              <article key={service.id} style={styles.serviceCard}>
                {service.imageUrl ? (
                  <div style={styles.mediaWrap}>
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      style={styles.mediaImage}
                    />
                  </div>
                ) : (
                  <div style={styles.noMediaBox}>No image</div>
                )}

                <div style={styles.serviceContent}>
                  <div style={styles.serviceTopRow}>
                    <div style={styles.serviceTitleWrap}>
                      <span style={styles.iconBox}>
                        {serviceIconMap[service.icon]}
                      </span>

                      <div>
                        <h2 style={styles.serviceTitle}>{service.title}</h2>
                        <p style={styles.serviceSlug}>/{service.slug}</p>
                      </div>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getServiceStatusStyle(service.status),
                      }}
                    >
                      {service.status}
                    </span>
                  </div>

                  <p style={styles.serviceText}>{service.text}</p>

                  <div style={styles.metaGrid}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Icon</span>
                      <span style={styles.metaValue}>{service.icon}</span>
                    </div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Layout</span>
                      <span style={styles.metaValue}>{service.span}</span>
                    </div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Accent</span>
                      <span style={styles.metaValue}>
                        {service.hoverAccent}
                      </span>
                    </div>

                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Order</span>
                      <span style={styles.metaValue}>{service.sortOrder}</span>
                    </div>
                  </div>

                  <div style={styles.pillRow}>
                    {service.pills.map((pill) => (
                      <span key={pill} style={styles.pill}>
                        {pill}
                      </span>
                    ))}
                  </div>

                  <div style={styles.flagRow}>
                    {service.badge && (
                      <span style={styles.flagBadge}>{service.badge}</span>
                    )}

                    {service.monitoring && (
                      <span style={styles.monitoringBadge}>
                        24/7 Monitoring
                      </span>
                    )}
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => openEditForm(service)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      style={{
                        ...styles.deleteButton,
                        ...(isDeletingServiceId === service.id
                          ? styles.disabledButton
                          : {}),
                      }}
                      disabled={isDeletingServiceId === service.id}
                      onClick={() => void handleDeleteService(service)}
                    >
                      {isDeletingServiceId === service.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
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
    maxWidth: "720px",
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

  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
  },

  serviceCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    overflow: "hidden",
  },

  mediaWrap: {
    height: "180px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  mediaImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  noMediaBox: {
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    fontSize: "13px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  serviceContent: {
    padding: spacing.lg,
  },

  serviceTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  serviceTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
  },

  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.1)",
    color: colors.accent.green,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  serviceTitle: {
    color: colors.text.main,
    fontSize: "17px",
    lineHeight: "22px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  serviceSlug: {
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

  serviceText: {
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

  flagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  flagBadge: {
    border: `1px solid rgba(196, 155, 255, 0.35)`,
    borderRadius: "999px",
    backgroundColor: "rgba(196, 155, 255, 0.08)",
    color: colors.accent.purple,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  monitoringBadge: {
    border: `1px solid rgba(147, 181, 255, 0.35)`,
    borderRadius: "999px",
    backgroundColor: "rgba(147, 181, 255, 0.08)",
    color: colors.accent.blue,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  editButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  deleteButton: {
    border: `1px solid rgba(255, 90, 90, 0.45)`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
