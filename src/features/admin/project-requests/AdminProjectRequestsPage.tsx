import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import {
  deleteAdminProjectRequest,
  getAdminProjectRequests,
  updateAdminProjectRequest,
} from "./adminProjectRequests.service";

import { getUnreadCustomerMessageCounts } from "../projects/messages/adminProjectUnread.service";

import type {
  AdminProjectRequest,
  AdminProjectRequestStatus,
} from "./adminProjectRequests.types";

import { AdminProjectMessagesPanel } from "../projects";

type RequestFilter = "all" | AdminProjectRequestStatus;

const statusOptions: AdminProjectRequestStatus[] = [
  "submitted",
  "reviewed",
  "in_progress",
  "completed",
  "cancelled",
];

const formatLabel = (value: string) => {
  return value.replaceAll("_", " ");
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const AdminProjectRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AdminProjectRequest[]>([]);

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const [statusFilter, setStatusFilter] = useState<RequestFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRequest, setEditingRequest] =
    useState<AdminProjectRequest | null>(null);

  const [editStatus, setEditStatus] =
    useState<AdminProjectRequestStatus>("submitted");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingRequest, setIsUpdatingRequest] = useState(false);
  const [isDeletingRequestId, setIsDeletingRequestId] = useState<string | null>(
    null,
  );

  const [loadError, setLoadError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const results = await getAdminProjectRequests();
      setRequests(results);

      const unread = await getUnreadCustomerMessageCounts();
      setUnreadCounts(unread);
    } catch (error) {
      console.error("Could not load project requests:", error);
      setLoadError("Could not load project requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    window.setTimeout(() => {
      if (!isMounted) return;
      void loadRequests();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      const matchesSearch =
        !normalizedSearchQuery ||
        request.title.toLowerCase().includes(normalizedSearchQuery) ||
        request.customerName.toLowerCase().includes(normalizedSearchQuery) ||
        request.customerEmail.toLowerCase().includes(normalizedSearchQuery) ||
        request.description.toLowerCase().includes(normalizedSearchQuery) ||
        request.selectedPackage.toLowerCase().includes(normalizedSearchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [requests, searchQuery, statusFilter]);

  const openEditForm = (request: AdminProjectRequest) => {
    setEditingRequest(request);
    setEditStatus(request.status);
    setEditAdminNotes(request.adminNotes);
    setUpdateError("");
    setDeleteError("");
  };

  const closeEditForm = () => {
    setEditingRequest(null);
    setEditAdminNotes("");
    setEditStatus("submitted");
    setUpdateError("");
  };

  const handleUpdateRequest = async () => {
    if (!editingRequest) return;

    setIsUpdatingRequest(true);
    setUpdateError("");

    try {
      await updateAdminProjectRequest({
        requestId: editingRequest.id,
        values: {
          status: editStatus,
          adminNotes: editAdminNotes.trim(),
        },
      });

      closeEditForm();
      await loadRequests();
    } catch (error) {
      console.error("Could not update project request:", error);
      setUpdateError("Could not update project request. Please try again.");
    } finally {
      setIsUpdatingRequest(false);
    }
  };

  const handleDeleteRequest = async (request: AdminProjectRequest) => {
    const isConfirmed = window.confirm(
      `Delete "${request.title}"? This cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeletingRequestId(request.id);
    setDeleteError("");

    try {
      await deleteAdminProjectRequest(request.id);

      if (editingRequest?.id === request.id) {
        closeEditForm();
      }

      await loadRequests();
    } catch (error) {
      console.error("Could not delete project request:", error);
      setDeleteError("Could not delete project request. Please try again.");
    } finally {
      setIsDeletingRequestId(null);
    }
  };

  const handleMessagesRead = useCallback(() => {
    if (!editingRequest) {
      return;
    }

    setUnreadCounts((current) => ({
      ...current,
      [editingRequest.id]: 0,
    }));
  }, [editingRequest]);

  return (
    <section style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Customer Requests</p>

          <h1 style={styles.title}>Project Requests</h1>

          <p style={styles.subtitle}>
            Review customer project requests, update their status, and keep
            internal admin notes.
          </p>
        </div>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => void loadRequests()}
        >
          Refresh
        </button>
      </header>

      {loadError && <p style={styles.errorBox}>{loadError}</p>}

      <div style={styles.panel}>
        {editingRequest && (
          <div style={styles.editPanel}>
            <div style={styles.editHeader}>
              <div>
                <p style={styles.eyebrow}>Update Request</p>
                <h2 style={styles.editTitle}>{editingRequest.title}</h2>
                <p style={styles.editSubtitle}>
                  {editingRequest.customerName || editingRequest.customerEmail}
                </p>
              </div>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={closeEditForm}
              >
                Close
              </button>
            </div>

            {updateError && <p style={styles.errorBox}>{updateError}</p>}

            <div style={styles.editGrid}>
              <label style={styles.field}>
                <span style={styles.label}>Status</span>
                <select
                  style={styles.input}
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(
                      event.target.value as AdminProjectRequestStatus,
                    )
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.field}>
                <span style={styles.label}>Admin notes</span>
                <textarea
                  style={styles.textarea}
                  value={editAdminNotes}
                  placeholder="Internal notes for this request..."
                  onChange={(event) => setEditAdminNotes(event.target.value)}
                />
              </label>
            </div>

            <button
              type="button"
              style={{
                ...styles.primaryButton,
                ...(isUpdatingRequest ? styles.disabledButton : {}),
              }}
              disabled={isUpdatingRequest}
              onClick={() => void handleUpdateRequest()}
            >
              {isUpdatingRequest ? "Saving..." : "Save Request"}
            </button>

            <AdminProjectMessagesPanel
              projectRequestId={editingRequest.id}
              onMessagesRead={handleMessagesRead}
            />
          </div>
        )}

        {deleteError && <p style={styles.errorBox}>{deleteError}</p>}

        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            value={searchQuery}
            placeholder="Search requests..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div style={styles.filters}>
            {(["all", ...statusOptions] as RequestFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                style={{
                  ...styles.filterButton,
                  ...(statusFilter === filter ? styles.filterButtonActive : {}),
                }}
                onClick={() => setStatusFilter(filter)}
              >
                {formatLabel(filter)}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div style={styles.stateBox}>
            <p style={styles.stateText}>Loading project requests...</p>
          </div>
        )}

        {!isLoading && filteredRequests.length === 0 && (
          <div style={styles.stateBox}>
            <h2 style={styles.stateTitle}>No project requests found</h2>
            <p style={styles.stateText}>
              New customer requests will appear here after they are submitted.
            </p>
          </div>
        )}

        {!isLoading && filteredRequests.length > 0 && (
          <div style={styles.requestList}>
            {filteredRequests.map((request) => (
              <article key={request.id} style={styles.requestCard}>
                <div style={styles.requestTop}>
                  <div>
                    <p style={styles.requestType}>
                      {formatLabel(request.projectType)}
                    </p>

                    <div style={styles.titleRow}>
                      <h2 style={styles.requestTitle}>{request.title}</h2>

                      {unreadCounts[request.id] > 0 && (
                        <span style={styles.messageBadge}>
                          {unreadCounts[request.id]} new message
                        </span>
                      )}
                    </div>

                    <p style={styles.customerLine}>
                      {request.customerName || "Unknown customer"} ·{" "}
                      {request.customerEmail || "No email"}
                    </p>
                  </div>

                  <span style={styles.statusBadge}>
                    {formatLabel(request.status)}
                  </span>
                </div>

                <p style={styles.requestText}>{request.description}</p>

                {request.goals && (
                  <p style={styles.requestText}>
                    <strong style={styles.strongText}>Goals:</strong>{" "}
                    {request.goals}
                  </p>
                )}

                <div style={styles.metaGrid}>
                  <span style={styles.metaItem}>
                    Package: {request.selectedPackage || "Not selected"}
                  </span>

                  <span style={styles.metaItem}>
                    Category: {formatLabel(request.packageCategory)}
                  </span>

                  <span style={styles.metaItem}>
                    Budget: {request.budgetRange || "Not provided"}
                  </span>

                  <span style={styles.metaItem}>
                    Timeline: {request.timeline || "Not provided"}
                  </span>

                  <span style={styles.metaItem}>
                    Submitted: {formatDate(request.createdAt)}
                  </span>
                </div>

                <div style={styles.customerDetails}>
                  <span>
                    Company: {request.customerCompany || "Not provided"}
                  </span>
                  <span>Phone: {request.customerPhone || "Not provided"}</span>
                </div>

                {request.adminNotes && (
                  <div style={styles.notesBox}>
                    <strong style={styles.strongText}>Admin notes:</strong>{" "}
                    {request.adminNotes}
                  </div>
                )}

                <div style={styles.cardActions}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => openEditForm(request)}
                  >
                    Review
                  </button>

                  <button
                    type="button"
                    style={{
                      ...styles.deleteButton,
                      ...(isDeletingRequestId === request.id
                        ? styles.disabledButton
                        : {}),
                    }}
                    disabled={isDeletingRequestId === request.id}
                    onClick={() => void handleDeleteRequest(request)}
                  >
                    {isDeletingRequestId === request.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xl,
  },

  header: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    flexWrap: "wrap",
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
    maxWidth: "720px",
  },

  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  editPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.lg,
    marginBottom: spacing.lg,
    display: "flex",
    flexDirection: "column",
    gap: spacing.lg,
  },

  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.lg,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  editTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  editSubtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  editGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 260px) 1fr",
    gap: spacing.lg,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  },

  label: {
    color: colors.text.main,
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    textTransform: "capitalize",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "240px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    outline: "none",
  },

  filters: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.muted,
    padding: `${spacing.xs} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  filterButtonActive: {
    backgroundColor: colors.accent.green,
    borderColor: colors.accent.green,
    color: colors.background.dark,
  },

  stateBox: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: spacing.xl,
    textAlign: "center",
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },

  requestList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.lg,
  },

  requestCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.xl,
  },

  requestTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.lg,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },

  requestType: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.xs} 0`,
  },

  requestTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  customerLine: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  statusBadge: {
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  requestText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `0 0 ${spacing.md} 0`,
  },

  strongText: {
    color: colors.text.main,
  },

  metaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: "8px 12px",
  },

  customerDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.md,
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    marginBottom: spacing.md,
  },

  notesBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.muted,
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    marginBottom: spacing.md,
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },

  deleteButton: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
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

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `0 0 ${spacing.lg} 0`,
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },

  messageBadge: {
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,90,90,0.12)",
    border: "1px solid rgba(255,90,90,0.45)",
    color: "#ff7777",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },
};
