import React, { useEffect, useMemo, useState } from "react";
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

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === "all") {
      return submissions;
    }

    return submissions.filter(
      (submission) => submission.status === statusFilter,
    );
  }, [statusFilter, submissions]);

  const loadSubmissions = async () => {
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
  };

  useEffect(() => {
    void loadSubmissions();
  }, []);

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
              {status}
            </button>
          ))}
        </div>

        {isLoading && <p style={styles.stateText}>Loading submissions...</p>}

        {!isLoading && filteredSubmissions.length === 0 && (
          <p style={styles.stateText}>No submissions found.</p>
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
                  <span style={styles.statusBadge}>{submission.status}</span>
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
              <div>
                <span style={styles.detailBadge}>
                  {selectedSubmission.status}
                </span>

                <h3 style={styles.detailTitle}>{selectedSubmission.name}</h3>

                <p style={styles.detailMeta}>
                  Submitted {formatDate(selectedSubmission.createdAt)}
                </p>
              </div>

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
                    {status}
                  </option>
                ))}
              </select>
            </header>

            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Email</span>
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  style={styles.infoValue}
                >
                  {selectedSubmission.email}
                </a>
              </div>

              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Phone</span>
                <a
                  href={`tel:${selectedSubmission.phone}`}
                  style={styles.infoValue}
                >
                  {selectedSubmission.phone}
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
              <span style={styles.infoLabel}>Message</span>
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
  },

  filterButtonActive: {
    backgroundColor: "rgba(147, 220, 92, 0.12)",
    borderColor: colors.accent.green,
    color: colors.accent.green,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
    padding: spacing.lg,
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
    color: colors.accent.green,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
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

  detailBadge: {
    display: "inline-flex",
    color: colors.accent.green,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    borderRadius: radius.pill,
    padding: "6px 10px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
    marginBottom: spacing.md,
  },

  detailTitle: {
    color: colors.text.main,
    fontSize: "28px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  detailMeta: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: `${spacing.sm} 0 0 0`,
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

  infoLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "12px",
    marginBottom: spacing.sm,
  },

  infoValue: {
    color: colors.text.main,
    fontSize: "14px",
    lineHeight: "22px",
    textDecoration: "none",
    overflowWrap: "anywhere" as const,
  },

  messageCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
  },

  messageText: {
    color: colors.text.main,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    whiteSpace: "pre-line" as const,
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
