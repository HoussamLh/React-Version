import React, { useCallback, useEffect, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { CustomerProjectRequestForm } from "./CustomerProjectRequestForm";
import {
  createCustomerProjectRequest,
  getCustomerProjectRequests,
} from "./projectRequests.service";
import type {
  CustomerProjectRequest,
  CustomerProjectRequestFormValues,
} from "./projectRequests.types";

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatLabel = (value: string) => {
  return value.replaceAll("_", " ");
};

type CustomerProjectRequestsPanelProps = {
  initialRequestValues?: Partial<CustomerProjectRequestFormValues>;
};

export const CustomerProjectRequestsPanel: React.FC<
  CustomerProjectRequestsPanelProps
> = ({ initialRequestValues }) => {
  const [requests, setRequests] = useState<CustomerProjectRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState( Boolean(initialRequestValues?.selectedPackage),);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const results = await getCustomerProjectRequests();
      setRequests(results);
    } catch {
      setLoadError("Could not load your project requests.");
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

  const handleCreateRequest = async (
    values: CustomerProjectRequestFormValues,
  ) => {
    setIsCreatingRequest(true);
    setFormError("");

    try {
      await createCustomerProjectRequest(values);
      setIsFormOpen(false);
      await loadRequests();
    } catch {
      setFormError("Could not submit your project request. Please try again.");
    } finally {
      setIsCreatingRequest(false);
    }
  };

  return (
    <section style={styles.panel}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Project Requests</p>

          <h2 style={styles.title}>Start your project request</h2>

          <p style={styles.subtitle}>
            Submit your project details so DevBySam can review your goals,
            timeline, and package requirements.
          </p>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => {
            setFormError("");
            setIsFormOpen((currentValue) => !currentValue);
          }}
        >
          {isFormOpen ? "Close Form" : "New Request"}
        </button>
      </header>

      {isFormOpen && (
        <CustomerProjectRequestForm
          initialValues={initialRequestValues}
          isSubmitting={isCreatingRequest}
          error={formError}
          onSubmit={handleCreateRequest}
        />
      )}

      {loadError && <p style={styles.error}>{loadError}</p>}

      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading project requests...</p>
        </div>
      )}

      {!isLoading && requests.length === 0 && (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>No project requests yet</h3>

          <p style={styles.stateText}>
            Create your first request when you are ready to start a project.
          </p>
        </div>
      )}

      {!isLoading && requests.length > 0 && (
        <div style={styles.requestList}>
          {requests.map((request) => (
            <article key={request.id} style={styles.requestCard}>
              <div style={styles.requestTop}>
                <div>
                  <p style={styles.requestType}>
                    {formatLabel(request.projectType)}
                  </p>

                  <h3 style={styles.requestTitle}>{request.title}</h3>
                </div>

                <span style={styles.statusBadge}>
                  {formatLabel(request.status)}
                </span>
              </div>

              <p style={styles.requestText}>{request.description}</p>

              <div style={styles.metaGrid}>
                <span style={styles.metaItem}>
                  Package: {request.selectedPackage || "Not selected"}
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.card,
    padding: spacing["2xl"],
    display: "flex",
    flexDirection: "column",
    gap: spacing.xl,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.xl,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "24px",
    lineHeight: "32px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    maxWidth: "720px",
  },

  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "13px 18px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },

  formBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.xl,
  },

  error: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },

  stateBox: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    padding: spacing.xl,
    textAlign: "center",
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  requestList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },

  requestCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
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
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
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

  metaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: "8px 12px",
  },
};
