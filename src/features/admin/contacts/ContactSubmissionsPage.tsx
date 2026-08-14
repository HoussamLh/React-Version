import React from "react";
import { colors, spacing } from "../../../design-system";
import { useMediaQuery } from "../../../shared/hooks";
import { AdminPanel, AdminSuccessMessage } from "../components";
import { ContactSubmissionsList } from "./components/ContactSubmissionsList";
import { ContactSubmissionDetails } from "./components/ContactSubmissionDetails";
import { useContactSubmissions } from "./hooks/useContactSubmissions";

export const ContactSubmissionsPage: React.FC = () => {
  const isCompactContacts = useMediaQuery("(max-width: 1250px)");
  const isNarrowContacts = useMediaQuery("(max-width: 640px)");

  const {
    submissions,
    selectedSubmission,
    submissionFilter,
    searchQuery,
    filterCounts,
    filteredSubmissions,
    hasActiveFilters,
    isLoading,
    isUpdatingStatus,
    error,
    successMessage,
    copiedField,
    setSelectedSubmission,
    setSubmissionFilter,
    setSearchQuery,
    loadSubmissions,
    handleStatusChange,
    handleCopy,
    handleResetFilters,
  } = useContactSubmissions();

  return (
    <AdminPanel
      style={{
        ...styles.shell,
        ...(isCompactContacts ? styles.shellCompact : {}),
      }}
    >
      <ContactSubmissionsList
        submissions={submissions}
        filteredSubmissions={filteredSubmissions}
        selectedSubmission={selectedSubmission}
        submissionFilter={submissionFilter}
        searchQuery={searchQuery}
        filterCounts={filterCounts}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading}
        error={error}
        isCompactContacts={isCompactContacts}
        isNarrowContacts={isNarrowContacts}
        onSearchChange={setSearchQuery}
        onFilterChange={setSubmissionFilter}
        onResetFilters={handleResetFilters}
        onRefresh={loadSubmissions}
        onSelectSubmission={setSelectedSubmission}
      />

      <main
        style={{
          ...styles.detailPanel,
          ...(isCompactContacts ? styles.detailPanelCompact : {}),
          ...(isNarrowContacts ? styles.detailPanelNarrow : {}),
        }}
      >
        {!selectedSubmission && (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>Select a submission</h3>

            <p style={styles.emptyText}>
              Choose an enquiry from the list to view its details.
            </p>
          </div>
        )}

        {selectedSubmission && (
          <ContactSubmissionDetails
            submission={selectedSubmission}
            isCompactContacts={isCompactContacts}
            isNarrowContacts={isNarrowContacts}
            isUpdatingStatus={isUpdatingStatus}
            copiedField={copiedField}
            onStatusChange={handleStatusChange}
            onCopy={handleCopy}
          />
        )}

        {successMessage && (
          <AdminSuccessMessage>{successMessage}</AdminSuccessMessage>
        )}
      </main>
    </AdminPanel>
  );
};

const styles = {
  shell: {
    height: "calc(100vh - 146px)",
    minHeight: "620px",
    display: "flex",
    backgroundColor: colors.background.dark,
  },

  shellCompact: {
    height: "auto",
    minHeight: "auto",
    flexDirection: "column" as const,
    overflow: "visible",
  },

  detailPanel: {
    flex: 1,
    minWidth: 0,
    padding: spacing.xl,
    overflowY: "auto" as const,
    backgroundColor: colors.background.dark,
  },

  detailPanelCompact: {
    overflowY: "visible" as const,
  },

  detailPanelNarrow: {
    padding: spacing.lg,
  },

  emptyState: {
    height: "100%",
    minHeight: "320px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "24px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },
};
