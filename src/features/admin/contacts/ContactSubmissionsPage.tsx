import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import {
  getContactSubmissions,
  updateContactSubmissionStatus,
} from "./contactSubmissions.service";
import type {
  ContactSubmission,
  ContactSubmissionStatus,
} from "./contactSubmissions.types";

const statusOptions: ContactSubmissionStatus[] = ["new", "contacted", "closed"];

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

export const ContactSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    ContactSubmissionStatus | "all"
  >("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(
    null,
  );

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === "all") {
      return submissions;
    }

    return submissions.filter(
      (submission) => submission.status === statusFilter,
    );
  }, [statusFilter, submissions]);

  const statusCounts = useMemo(() => {
    return statusOptions.reduce(
      (counts, status) => ({
        ...counts,
        [status]: submissions.filter(
          (submission) => submission.status === status,
        ).length,
      }),
      {} as Record<ContactSubmissionStatus, number>,
    );
  }, [submissions]);

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

  const handleStatusChange = async (
    submissionId: string,
    status: ContactSubmissionStatus,
  ) => {
    setIsUpdatingStatus(true);
    setError("");

    try {
      await updateContactSubmissionStatus({
        submissionId,
        status,
      });

      await loadSubmissions();
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

  return (
    <section style={styles.shell}>
      <aside style={styles.listPanel}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.title}>Contact Submissions</h2>
            <p style={styles.subtitle}>
              Review website enquiries from the contact form.
            </p>
          </div>

          <span style={styles.count}>{filteredSubmissions.length}</span>
        </div>

        <div style={styles.filters}>
          <button
            type="button"
            style={{
              ...styles.filterButton,
              ...(statusFilter === "all" ? styles.filterButtonActive : {}),
            }}
            onClick={() => setStatusFilter("all")}
          >
            All
            <span style={styles.filterCount}>{submissions.length}</span>
          </button>

          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              style={{
                ...styles.filterButton,
                ...(statusFilter === status ? styles.filterButtonActive : {}),
              }}
              onClick={() => setStatusFilter(status)}
            >
              {statusMeta[status].label}
              <span style={styles.filterCount}>{statusCounts[status]}</span>
            </button>
          ))}
        </div>

        {isLoading && <p style={styles.stateText}>Loading submissions...</p>}

        {!isLoading && filteredSubmissions.length === 0 && (
          <div style={styles.listEmptyState}>
            <h3 style={styles.listEmptyTitle}>No submissions found</h3>
            <p style={styles.listEmptyText}>
              Try another status filter or wait for new contact enquiries.
            </p>
          </div>
        )}

        <div style={styles.list}>
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

      <main style={styles.detailPanel}>
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
            <header style={styles.detailHeader}>
              <div style={styles.detailHeaderContent}>
                <span style={getStatusBadgeStyle(selectedSubmission.status)}>
                  {statusMeta[selectedSubmission.status].label}
                </span>

                <h3 style={styles.detailTitle}>{selectedSubmission.name}</h3>

                <p style={styles.detailMeta}>
                  Submitted {formatDate(selectedSubmission.createdAt)}
                </p>

                <p style={styles.statusDescription}>
                  {statusMeta[selectedSubmission.status].description}
                </p>
              </div>

              <div style={styles.statusControls}>
                <select
                  value={selectedSubmission.status}
                  disabled={isUpdatingStatus}
                  style={styles.statusSelect}
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

                <div style={styles.quickStatusActions}>
                  {selectedSubmission.status !== "contacted" && (
                    <button
                      type="button"
                      style={styles.quickStatusButton}
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleStatusChange(selectedSubmission.id, "contacted")
                      }
                    >
                      Mark contacted
                    </button>
                  )}

                  {selectedSubmission.status !== "closed" && (
                    <button
                      type="button"
                      style={styles.quickStatusButtonSecondary}
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleStatusChange(selectedSubmission.id, "closed")
                      }
                    >
                      Close
                    </button>
                  )}

                  {selectedSubmission.status !== "new" && (
                    <button
                      type="button"
                      style={styles.quickStatusButtonSecondary}
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleStatusChange(selectedSubmission.id, "new")
                      }
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </header>

            <div style={styles.infoGrid}>
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
              <div style={styles.messageHeader}>
                <span style={styles.infoLabel}>Message</span>
                <span style={styles.messageDate}>
                  {formatDate(selectedSubmission.createdAt)}
                </span>
              </div>

              <p style={styles.messageText}>{selectedSubmission.message}</p>
            </article>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}
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

  listPanel: {
    width: "380px",
    minWidth: "320px",
    borderRight: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    display: "flex",
    flexDirection: "column" as const,
  },

  listHeader: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
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

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
    padding: spacing.lg,
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
    overflowY: "auto" as const,
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

  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  detailHeaderContent: {
    minWidth: 0,
  },

  detailTitle: {
    color: colors.text.main,
    fontSize: "28px",
    fontWeight: typography.fontWeight.black,
    margin: `${spacing.md} 0 0 0`,
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

  statusSelect: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    textTransform: "capitalize" as const,
    outline: "none",
  },

  quickStatusActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
    justifyContent: "flex-end",
  },

  quickStatusButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "9px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },

  quickStatusButtonSecondary: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: "9px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing.md,
    marginBottom: spacing.xl,
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

  error: {
    color: colors.accent.yellow,
    fontSize: "13px",
    margin: `${spacing.lg} 0 0 0`,
  },
};
