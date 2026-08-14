import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, spacing } from "../../../design-system";
import { copyTextToClipboard } from "../utils";
import { useMediaQuery } from "../../../shared/hooks";
import { AdminPanel, AdminSuccessMessage } from "../components";
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
} from "./services/contactSubmissions.service";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "./types/contactSubmissions.types";
import { getContactSubmissionSearchableText } from "./helpers/contactSubmissions.helpers";
import {
  ContactSubmissionsList,
  type SubmissionFilter,
} from "./components/ContactSubmissionsList";
import { ContactSubmissionDetails } from "./components/ContactSubmissionDetails";
import {
  statusMeta,
  statusOptions,
} from "./configuration/contactSubmissions.status";

export const ContactSubmissionsPage: React.FC = () => {
  const isCompactContacts = useMediaQuery("(max-width: 1250px)");
  const isNarrowContacts = useMediaQuery("(max-width: 640px)");

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [submissionFilter, setSubmissionFilter] =
    useState<SubmissionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(
    null,
  );

  const filterCounts = useMemo(() => {
    const statusCounts = statusOptions.reduce(
      (counts, status) => ({
        ...counts,
        [status]: submissions.filter(
          (submission) => submission.status === status,
        ).length,
      }),
      {} as Record<ContactSubmissionStatus, number>,
    );

    return {
      all: submissions.length,
      active: submissions.filter((submission) => submission.status !== "closed")
        .length,
      ...statusCounts,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesFilter =
        submissionFilter === "all" ||
        (submissionFilter === "active" && submission.status !== "closed") ||
        submission.status === submissionFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      return getContactSubmissionSearchableText(submission).includes(
        normalizedSearchQuery,
      );
    });
  }, [searchQuery, submissionFilter, submissions]);

  const hasActiveFilters =
    submissionFilter !== "all" || searchQuery.trim().length > 0;

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const nextSubmissions = await getContactSubmissions();

      setSubmissions(nextSubmissions);

      setSelectedSubmission((currentSubmission) => {
        if (!currentSubmission) {
          return nextSubmissions[0] ?? null;
        }

        return (
          nextSubmissions.find(
            (submission) => submission.id === currentSubmission.id,
          ) ??
          nextSubmissions[0] ??
          null
        );
      });
    } catch {
      setError("Could not load contact submissions.");
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

      void loadSubmissions();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, [loadSubmissions]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 2200);
  };

  const handleStatusChange = async (
    submissionId: string,
    status: ContactSubmissionStatus,
  ) => {
    if (status === "closed") {
      const confirmed = window.confirm(
        "Are you sure you want to close this contact submission?",
      );

      if (!confirmed) {
        return;
      }
    }

    setIsUpdatingStatus(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateContactSubmissionStatus({
        submissionId,
        status,
      });

      await loadSubmissions();

      showSuccessMessage(
        `Submission marked as ${statusMeta[status].label.toLowerCase()}.`,
      );
    } catch {
      setError("Could not update submission status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCopy = async (value: string, field: "email" | "phone") => {
    setError("");

    try {
      await copyTextToClipboard(value);
      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 1600);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  const handleResetFilters = () => {
    setSubmissionFilter("all");
    setSearchQuery("");
  };

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
