import React, { 
  useCallback, 
  useEffect, 
  useMemo, 
  useState 
} from "react";
import { 
  colors, 
  radius, 
  spacing, 
  typography 
} from "../../../design-system";
import { useMediaQuery } from "../../../shared/hooks";
import { AdminActionButton , AdminErrorRecovery } from "../components";
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
} from "./contactSubmissions.service";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "./contactSubmissions.types";

type SubmissionFilter = "all" | "active" | ContactSubmissionStatus;

const statusOptions: ContactSubmissionStatus[] = ["new", "contacted", "closed"];

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



const statusMeta: Record<
  ContactSubmissionStatus,
  {
    label: string;
    description: string;
    badgeStyle: React.CSSProperties;
  }
> = {
  new: {
    label: "New",
    description: "Needs first response",
    badgeStyle: {
      color: colors.accent.green,
      borderColor: "rgba(147, 220, 92, 0.45)",
      backgroundColor: "rgba(147, 220, 92, 0.1)",
    },
  },
  contacted: {
    label: "Contacted",
    description: "Follow-up in progress",
    badgeStyle: {
      color: "#93b5ff",
      borderColor: "rgba(147, 181, 255, 0.45)",
      backgroundColor: "rgba(147, 181, 255, 0.1)",
    },
  },
  closed: {
    label: "Closed",
    description: "No further action needed",
    badgeStyle: {
      color: colors.text.muted,
      borderColor: colors.border.default,
      backgroundColor: "rgba(255,255,255,0.04)",
    },
  },
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getStatusBadgeStyle = (status: ContactSubmissionStatus) => ({
  ...styles.statusBadge,
  ...statusMeta[status].badgeStyle,
});

const getMailtoHref = (submission: ContactSubmission) => {
  const subject = `DevBySam enquiry: ${submission.service}`;
  const body = `Hi ${submission.name},\n\nThank you for contacting DevBySam about ${submission.service}.\n\n`;

  return `mailto:${submission.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
};

const getSearchableText = (submission: ContactSubmission) => {
  return [
    submission.name,
    submission.email,
    submission.phone,
    submission.service,
    submission.message,
    submission.status,
    submission.source,
  ]
    .join(" ")
    .toLowerCase();
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

      return getSearchableText(submission).includes(normalizedSearchQuery);
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
      if (!isMounted) return;
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

      if (!confirmed) return;
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
      await navigator.clipboard.writeText(value);
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
    <section
      style={{
        ...styles.shell,
        ...(isCompactContacts ? styles.shellCompact : {}),
      }}
    >
      <aside
        style={{
          ...styles.listPanel,
          ...(isCompactContacts ? styles.listPanelCompact : {}),
        }}
      >
        <div
          style={{
            ...styles.listHeader,
            ...(isNarrowContacts ? styles.listHeaderNarrow : {}),
          }}
        >
          <div>
            <h2 style={styles.title}>Contact Submissions</h2>
            <p style={styles.subtitle}>
              Review website enquiries from the contact form.
            </p>
          </div>

          <div style={styles.headerActions}>
            <span style={styles.count}>{filteredSubmissions.length}</span>

            <AdminActionButton
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={loadSubmissions}
            >
              {isLoading ? "..." : "Refresh"}
            </AdminActionButton>
          </div>
        </div>

        <div
          style={{
            ...styles.searchArea,
            ...(isNarrowContacts ? styles.searchAreaNarrow : {}),
          }}
        >
          <input
            type="search"
            value={searchQuery}
            placeholder="Search name, email, phone, service..."
            style={styles.searchInput}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          {hasActiveFilters && (
            <button
              type="button"
              style={{
                ...styles.resetButton,
                ...(isNarrowContacts ? styles.resetButtonNarrow : {}),
              }}
              onClick={handleResetFilters}
            >
              Reset
            </button>
          )}
        </div>

        <div style={styles.filters}>
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              type="button"
              style={{
                ...styles.filterButton,
                ...(submissionFilter === filter.value
                  ? styles.filterButtonActive
                  : {}),
              }}
              onClick={() => setSubmissionFilter(filter.value)}
            >
              {filter.label}
              <span style={styles.filterCount}>
                {filterCounts[filter.value]}
              </span>
            </button>
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
            onRetry={loadSubmissions}
          />
        )}

        {isLoading && <p style={styles.stateText}>Loading submissions...</p>}

        {!isLoading && !error && filteredSubmissions.length === 0 && (
          <div style={styles.listEmptyState}>
            <h3 style={styles.listEmptyTitle}>No submissions found</h3>
            <p style={styles.listEmptyText}>
              Try another search term or reset the filters.
            </p>
          </div>
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
                onClick={() => setSelectedSubmission(submission)}
              >
                <div style={styles.itemTop}>
                  <span style={styles.name}>{submission.name}</span>
                  <span style={styles.date}>
                    {formatDate(submission.createdAt)}
                  </span>
                </div>

                <p style={styles.preview}>{submission.message}</p>

                <div style={styles.itemFooter}>
                  <span style={styles.serviceBadge}>{submission.service}</span>
                  <span style={getStatusBadgeStyle(submission.status)}>
                    {statusMeta[submission.status].label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

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
            <header
              style={{
                ...styles.detailHeader,
                ...(isCompactContacts ? styles.detailHeaderCompact : {}),
              }}
            >
              <div style={styles.detailHeaderContent}>
                <span style={getStatusBadgeStyle(selectedSubmission.status)}>
                  {statusMeta[selectedSubmission.status].label}
                </span>

                <h3
                  style={{
                    ...styles.detailTitle,
                    ...(isNarrowContacts ? styles.detailTitleNarrow : {}),
                  }}
                >
                  {selectedSubmission.name}
                </h3>

                <p style={styles.detailMeta}>
                  Submitted {formatDate(selectedSubmission.createdAt)}
                </p>

                <p style={styles.statusDescription}>
                  {statusMeta[selectedSubmission.status].description}
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

                <div
                  style={{
                    ...styles.quickStatusActions,
                    ...(isCompactContacts
                      ? styles.quickStatusActionsCompact
                      : {}),
                    ...(isNarrowContacts
                      ? styles.quickStatusActionsNarrow
                      : {}),
                  }}
                >
                  {selectedSubmission.status !== "contacted" && (
                    <AdminActionButton
                      variant="primary"
                      disabled={isUpdatingStatus}
                      fullWidth={isNarrowContacts}
                      onClick={() =>
                        handleStatusChange(selectedSubmission.id, "contacted")
                      }
                    >
                      Mark contacted
                    </AdminActionButton>
                  )}

                  {selectedSubmission.status !== "closed" && (
                    <AdminActionButton
                      variant="secondary"
                      disabled={isUpdatingStatus}
                      fullWidth={isNarrowContacts}
                      onClick={() =>
                        handleStatusChange(selectedSubmission.id, "closed")
                      }
                    >
                      Close
                    </AdminActionButton>
                  )}

                  {selectedSubmission.status !== "new" && (
                    <AdminActionButton
                      variant="secondary"
                      disabled={isUpdatingStatus}
                      fullWidth={isNarrowContacts}
                      onClick={() =>
                        handleStatusChange(selectedSubmission.id, "new")
                      }
                    >
                      Reopen
                    </AdminActionButton>
                  )}
                </div>
              </div>
            </header>

            <div
              style={{
                ...styles.infoGrid,
                ...(isCompactContacts ? styles.infoGridCompact : {}),
                ...(isNarrowContacts ? styles.infoGridNarrow : {}),
              }}
            >
              <div style={styles.infoCard}>
                <div style={styles.infoCardHeader}>
                  <span style={styles.infoLabel}>Email</span>

                  <button
                    type="button"
                    style={{
                      ...styles.copyButton,
                      ...(copiedField === "email"
                        ? styles.copyButtonSuccess
                        : {}),
                    }}
                    onClick={() =>
                      handleCopy(selectedSubmission.email, "email")
                    }
                  >
                    {copiedField === "email" ? "Copied" : "Copy"}
                  </button>
                </div>

                <a
                  href={getMailtoHref(selectedSubmission)}
                  style={styles.infoValue}
                >
                  {selectedSubmission.email}
                </a>

                <a
                  href={getMailtoHref(selectedSubmission)}
                  style={styles.contactActionLink}
                >
                  Send email
                </a>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoCardHeader}>
                  <span style={styles.infoLabel}>Phone</span>

                  <button
                    type="button"
                    style={{
                      ...styles.copyButton,
                      ...(copiedField === "phone"
                        ? styles.copyButtonSuccess
                        : {}),
                    }}
                    onClick={() =>
                      handleCopy(selectedSubmission.phone, "phone")
                    }
                  >
                    {copiedField === "phone" ? "Copied" : "Copy"}
                  </button>
                </div>

                <a
                  href={`tel:${selectedSubmission.phone}`}
                  style={styles.infoValue}
                >
                  {selectedSubmission.phone}
                </a>

                <a
                  href={`tel:${selectedSubmission.phone}`}
                  style={styles.contactActionLink}
                >
                  Call number
                </a>
              </div>

              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Service</span>
                <span style={styles.infoValue}>
                  {selectedSubmission.service}
                </span>
              </div>

              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Source</span>
                <span style={styles.infoValue}>
                  {selectedSubmission.source}
                </span>
              </div>
            </div>

            <article style={styles.messageCard}>
              <div
                style={{
                  ...styles.messageHeader,
                  ...(isNarrowContacts ? styles.messageHeaderNarrow : {}),
                }}
              >
                <span style={styles.infoLabel}>Message</span>
                <span style={styles.messageDate}>
                  {formatDate(selectedSubmission.createdAt)}
                </span>
              </div>

              <p style={styles.messageText}>{selectedSubmission.message}</p>
            </article>
          </>
        )}
        {successMessage && <p style={styles.successText}>{successMessage}</p>}
      </main>
    </section>
  );
};

const styles = {
  shell: {
    height: "calc(100vh - 146px)",
    minHeight: "620px",
    borderRadius: radius.lg,
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    display: "flex",
    backgroundColor: colors.background.dark,
  },

  shellCompact: {
    height: "auto",
    minHeight: "auto",
    flexDirection: "column" as const,
    overflow: "visible",
  },

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

  listHeader: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  listHeaderNarrow: {
    alignItems: "flex-start",
  },

  title: {
    color: colors.text.main,
    fontSize: "20px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  count: {
    minWidth: "28px",
    height: "28px",
    borderRadius: radius.pill,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
    flexShrink: 0,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 0,
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
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

  searchInput: {
    width: "100%",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "11px 12px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box" as const,
  },

  resetButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: "0 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    flexShrink: 0,
  },

  resetButtonNarrow: {
    padding: "11px 12px",
  },

  filters: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.text.muted,
    padding: "7px 12px",
    fontSize: "12px",
    textTransform: "capitalize" as const,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  filterButtonActive: {
    backgroundColor: "rgba(147, 220, 92, 0.12)",
    borderColor: colors.accent.green,
    color: colors.accent.green,
  },

  filterCount: {
    minWidth: "18px",
    height: "18px",
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
  },

  activeFilterText: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
    padding: spacing.lg,
  },

  successText: {
    color: colors.accent.green,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.lg} 0 0 0`,
    padding: spacing.md,
    borderRadius: radius.md,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    backgroundColor: "rgba(147, 220, 92, 0.08)",
  },

  listEmptyState: {
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  listEmptyTitle: {
    color: colors.text.main,
    fontSize: "16px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  listEmptyText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
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
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
  },

  statusBadge: {
    border: "1px solid",
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
    display: "inline-flex",
    alignItems: "center",
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

  detailTitle: {
    color: colors.text.main,
    fontSize: "28px",
    fontWeight: typography.fontWeight.black,
    margin: `${spacing.md} 0 0 0`,
    overflowWrap: "anywhere" as const,
  },

  detailTitleNarrow: {
    fontSize: "24px",
  },

  detailMeta: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: `${spacing.sm} 0 0 0`,
  },

  statusDescription: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.sm} 0 0 0`,
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
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    textTransform: "capitalize" as const,
    outline: "none",
  },

  statusSelectNarrow: {
    width: "100%",
  },

  quickStatusActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
    justifyContent: "flex-end",
  },

  quickStatusActionsCompact: {
    justifyContent: "flex-start",
  },

  quickStatusActionsNarrow: {
    width: "100%",
    flexDirection: "column" as const,
    alignItems: "stretch",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  infoGridCompact: {
    gridTemplateColumns: "1fr",
  },

  infoGridNarrow: {
    gridTemplateColumns: "1fr",
  },

  infoCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    minWidth: 0,
  },

  infoCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  infoLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "12px",
  },

  infoValue: {
    color: colors.text.main,
    fontSize: "14px",
    lineHeight: "22px",
    textDecoration: "none",
    overflowWrap: "anywhere" as const,
    display: "block",
  },

  copyButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
    color: colors.text.muted,
    padding: "5px 9px",
    fontSize: "11px",
    cursor: "pointer",
  },

  copyButtonSuccess: {
    borderColor: colors.accent.green,
    color: colors.accent.green,
    backgroundColor: "rgba(147, 220, 92, 0.1)",
  },

  contactActionLink: {
    display: "inline-flex",
    marginTop: spacing.md,
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },

  messageCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
  },

  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  messageHeaderNarrow: {
    flexDirection: "column" as const,
    gap: spacing.xs,
  },

  messageDate: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  messageText: {
    color: colors.text.main,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    whiteSpace: "pre-line" as const,
    overflowWrap: "anywhere" as const,
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
