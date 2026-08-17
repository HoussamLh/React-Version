import React, { useCallback, useEffect, useMemo, useState } from "react";

import { colors, radius, spacing } from "../../../design-system";

import {
  deleteAdminProjectRequest,
  getAdminProjectRequests,
  updateAdminProjectRequest,
} from "./services/adminProjectRequests.service";

import { getUnreadCustomerMessageCounts } from "./messages/services/adminProjectUnread.service";

import type {
  AdminProjectRequest,
  AdminProjectRequestStatus,
} from "./types/adminProjectRequests.types";

import {
  AdminProjectRequestEditPanel,
  AdminProjectRequestEmptyState,
  AdminProjectRequestHeader,
  AdminProjectRequestList,
  AdminProjectRequestToolbar,
} from "./components";

import type { AdminProjectRequestFilter } from "./components/AdminProjectRequestToolbar";

export const AdminProjectRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AdminProjectRequest[]>([]);

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const [statusFilter, setStatusFilter] =
    useState<AdminProjectRequestFilter>("all");

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

  const statusOptions: AdminProjectRequestStatus[] = [
    "submitted",
    "reviewed",
    "in_progress",
    "completed",
    "cancelled",
  ];

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
      if (!isMounted) {
        return;
      }

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
    if (!editingRequest) {
      return;
    }

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

    if (!isConfirmed) {
      return;
    }

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

  const hasSearchOrFilter =
    searchQuery.trim().length > 0 || statusFilter !== "all";

  return (
    <section style={styles.page}>
      <AdminProjectRequestHeader onRefresh={() => void loadRequests()} />

      {loadError && <p style={styles.errorBox}>{loadError}</p>}

      <div style={styles.panel}>
        {editingRequest && (
          <AdminProjectRequestEditPanel
            request={editingRequest}
            status={editStatus}
            adminNotes={editAdminNotes}
            statusOptions={statusOptions}
            isUpdating={isUpdatingRequest}
            updateError={updateError}
            onStatusChange={setEditStatus}
            onAdminNotesChange={setEditAdminNotes}
            onSave={() => void handleUpdateRequest()}
            onClose={closeEditForm}
            onMessagesRead={handleMessagesRead}
          />
        )}

        {deleteError && <p style={styles.errorBox}>{deleteError}</p>}

        <AdminProjectRequestToolbar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          statusOptions={statusOptions}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
        />

        {isLoading && (
          <div style={styles.stateBox}>
            <p style={styles.stateText}>Loading project requests...</p>
          </div>
        )}

        {!isLoading && filteredRequests.length === 0 && (
          <AdminProjectRequestEmptyState
            hasSearchOrFilter={hasSearchOrFilter}
          />
        )}

        {!isLoading && filteredRequests.length > 0 && (
          <AdminProjectRequestList
            requests={filteredRequests}
            unreadCounts={unreadCounts}
            deletingRequestId={isDeletingRequestId}
            onReview={openEditForm}
            onDelete={handleDeleteRequest}
          />
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

  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  stateBox: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: spacing.xl,
    textAlign: "center",
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },
};
