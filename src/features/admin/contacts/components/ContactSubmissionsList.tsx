import React from "react";
import { colors, spacing, typography, radius } from "../../../../design-system";
import {
  AdminActionButton,
  AdminEmptyState,
  AdminErrorRecovery,
  AdminSearchInput,
  AdminStatusBadge,
  AdminFilterButton,
  AdminResetButton,
  AdminCountBadge,
  AdminLoadingText,
  AdminPanelHeader,
} from "../../components";
import { formatAdminDateTime } from "../../utils";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "../types/contactSubmissions.types";

export type SubmissionFilter = "all" | "active" | ContactSubmissionStatus;

type ContactSubmissionsListProps = {
  submissions: ContactSubmission[];
  filteredSubmissions: ContactSubmission[];
  selectedSubmission: ContactSubmission | null;

  submissionFilter: SubmissionFilter;
  searchQuery: string;

  filterCounts: {
    all: number;
    active: number;
    new: number;
    contacted: number;
    closed: number;
  };

  hasActiveFilters: boolean;
  isLoading: boolean;
  error: string;

  isCompactContacts: boolean;
  isNarrowContacts: boolean;

  onSearchChange: (value: string) => void;
  onFilterChange: (filter: SubmissionFilter) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onSelectSubmission: (submission: ContactSubmission) => void;
};

const filterOptions: {
  label: string;
  value: SubmissionFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
];

const getSubmissionStatusTone = (
  status: ContactSubmission["status"],
): "success" | "warning" | "muted" => {
  if (status === "new") {
    return "warning";
  }

  if (status === "closed") {
    return "muted";
  }

  return "success";
};

export const ContactSubmissionsList: React.FC<ContactSubmissionsListProps> = ({
  submissions,
  filteredSubmissions,
  selectedSubmission,
  submissionFilter,
  searchQuery,
  filterCounts,
  hasActiveFilters,
  isLoading,
  error,
  isCompactContacts,
  isNarrowContacts,
  onSearchChange,
  onFilterChange,
  onResetFilters,
  onRefresh,
  onSelectSubmission,
}) => {
  return (
    <aside
      style={{
        ...styles.listPanel,
        ...(isCompactContacts ? styles.listPanelCompact : {}),
      }}
    >
      <AdminPanelHeader
        title="Contact Submissions"
        subtitle="Review website enquiries from the contact form."
        isNarrow={isNarrowContacts}
        actions={
          <div style={styles.headerActions}>
            <AdminCountBadge
              count={filteredSubmissions.length}
              variant="circle"
            />

            <AdminActionButton
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={onRefresh}
            >
              {isLoading ? "..." : "Refresh"}
            </AdminActionButton>
          </div>
        }
      />

      <div
        style={{
          ...styles.searchArea,
          ...(isNarrowContacts ? styles.searchAreaNarrow : {}),
        }}
      >
        <AdminSearchInput
          value={searchQuery}
          placeholder="Search name, email, phone, service..."
          onChange={onSearchChange}
        />

        {hasActiveFilters && (
          <AdminResetButton
            isNarrow={isNarrowContacts}
            onClick={onResetFilters}
          />
        )}
      </div>

      <div style={styles.filters}>
        {filterOptions.map((filter) => (
          <AdminFilterButton
            key={filter.value}
            label={filter.label}
            count={filterCounts[filter.value]}
            isActive={submissionFilter === filter.value}
            onClick={() => onFilterChange(filter.value)}
          />
        ))}
      </div>

      {hasActiveFilters && (
        <p style={styles.activeFilterText}>
          Showing {filteredSubmissions.length} of {submissions.length}{" "}
          submissions.
        </p>
      )}

      {error && (
        <AdminErrorRecovery
          message={error}
          isLoading={isLoading}
          onRetry={onRefresh}
        />
      )}

      {isLoading && (
        <AdminLoadingText padded>Loading submissions...</AdminLoadingText>
      )}

      {!isLoading && !error && filteredSubmissions.length === 0 && (
        <AdminEmptyState
          title="No submissions found"
          text="Try another search term or reset the filters."
        />
      )}

      <div
        style={{
          ...styles.list,
          ...(isCompactContacts ? styles.listCompact : {}),
        }}
      >
        {filteredSubmissions.map((submission) => {
          const isActive = submission.id === selectedSubmission?.id;

          return (
            <button
              key={submission.id}
              type="button"
              style={{
                ...styles.submissionItem,
                ...(isActive ? styles.submissionItemActive : {}),
              }}
              onClick={() => onSelectSubmission(submission)}
            >
              <div style={styles.itemTop}>
                <span style={styles.name}>{submission.name}</span>

                <span style={styles.date}>
                  {formatAdminDateTime(submission.createdAt)}
                </span>
              </div>

              <p style={styles.preview}>{submission.message}</p>

              <div style={styles.itemFooter}>
                <span style={styles.serviceBadge}>{submission.service}</span>

                <AdminStatusBadge
                  tone={getSubmissionStatusTone(submission.status)}
                >
                  {submission.status}
                </AdminStatusBadge>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const styles = {
  listPanel: {
    width: "380px",
    minWidth: "320px",
    borderRight: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    display: "flex",
    flexDirection: "column" as const,
  },

  listPanelCompact: {
    width: "100%",
    minWidth: 0,
    borderRight: "none",
    borderBottom: `1px solid ${colors.border.default}`,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 0,
  },

  searchArea: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
  },

  searchAreaNarrow: {
    flexDirection: "column" as const,
  },

  filters: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  activeFilterText: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  list: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto" as const,
  },

  listCompact: {
    flex: "none",
    maxHeight: "420px",
  },

  submissionItem: {
    width: "100%",
    border: "none",
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    textAlign: "left" as const,
    padding: spacing.lg,
    cursor: "pointer",
  },

  submissionItemActive: {
    backgroundColor: "rgba(147, 220, 92, 0.08)",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  name: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
    minWidth: 0,
  },

  date: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  preview: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis",
  },

  itemFooter: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  serviceBadge: {
    color: colors.text.main,
    backgroundColor: "rgba(255,255,255,0.05)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: "5px 9px",
    fontSize: "11px",
  },
};
