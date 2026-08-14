import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, spacing, radius } from "../../../design-system";
import { useMediaQuery } from "../../../shared/hooks";
import { AdminPanel, AdminSuccessMessage } from "../components";
import { copyTextToClipboard, formatAdminDateTime } from "../utils";
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
} from "./contactSubmissions.service";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "./contactSubmissions.types";
import {
  getContactSubmissionMailtoHref,
  getContactSubmissionSearchableText,
} from "./contactSubmissions.helpers";
import {
  ContactSubmissionsList,
  type SubmissionFilter,
} from "./ContactSubmissionsList";

const statusOptions: ContactSubmissionStatus[] = ["new", "contacted", "closed"];

const statusMeta: Record<
  ContactSubmissionStatus,
  {
    label: string;
    description: string;
  }
> = {
  new: {
    label: "New",
    description: "Needs first response",
  },
  contacted: {
    label: "Contacted",
    description: "Follow-up in progress",
  },
  closed: {
    label: "Closed",
    description: "No further action needed",
  },
};

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
          <>
            {/* Contact submission details will be extracted next. */}

            <header
              style={{
                ...styles.detailHeader,
                ...(isCompactContacts ? styles.detailHeaderCompact : {}),
              }}
            >
              <div style={styles.detailHeaderContent}>
                <p style={styles.detailMeta}>
                  Submitted {formatAdminDateTime(selectedSubmission.createdAt)}
                </p>
              </div>

              <div
                style={{
                  ...styles.statusControls,
                  ...(isCompactContacts ? styles.statusControlsCompact : {}),
                }}
              >
                <select
                  value={selectedSubmission.status}
                  disabled={isUpdatingStatus}
                  style={{
                    ...styles.statusSelect,
                    ...(isNarrowContacts ? styles.statusSelectNarrow : {}),
                    ...(isUpdatingStatus ? styles.disabledAction : {}),
                  }}
                  onChange={(event) =>
                    handleStatusChange(
                      selectedSubmission.id,
                      event.target.value as ContactSubmissionStatus,
                    )
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusMeta[status].label}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            <div style={styles.placeholderDetails}>
              <p style={styles.placeholderText}>
                Contact submission details remain here temporarily.
              </p>

              <p style={styles.placeholderText}>
                The details section will be extracted into
                ContactSubmissionDetails.tsx in the next step.
              </p>

              <button
                type="button"
                onClick={() => handleCopy(selectedSubmission.email, "email")}
              >
                {copiedField === "email" ? "Email copied" : "Copy email"}
              </button>

              <a href={getContactSubmissionMailtoHref(selectedSubmission)}>
                {selectedSubmission.email}
              </a>
            </div>
          </>
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

  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  detailHeaderCompact: {
    flexDirection: "column" as const,
  },

  detailHeaderContent: {
    minWidth: 0,
  },

  detailMeta: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: 0,
  },

  statusControls: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: spacing.sm,
    flexShrink: 0,
  },

  statusControlsCompact: {
    width: "100%",
    alignItems: "flex-start",
  },

  statusSelect: {
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    textTransform: "capitalize" as const,
    outline: "none",
  },

  statusSelectNarrow: {
    width: "100%",
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  placeholderDetails: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
  },

  placeholderText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `0 0 ${spacing.sm} 0`,
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
