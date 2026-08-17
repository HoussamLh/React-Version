import React from "react";
import {radius, colors, spacing } from "../../../../design-system";
import { CustomerProjectRequestForm } from "./ProjectRequestForm";
import { ProjectRequestCard } from "./ProjectRequestCard";
import { ProjectRequestsHeader } from "./ProjectRequestsHeader";
import { ProjectRequestsState } from "./ProjectRequestsState";
import { useCustomerProjectRequests } from "../hooks/useCustomerProjectRequests";
import type { ProjectRequestFormValues } from "../types/projectRequests.types";

type CustomerProjectRequestsPanelProps = {
  initialRequestValues?: Partial<ProjectRequestFormValues>;
  onClearInitialRequestIntent?: () => void;
};

export const CustomerProjectRequestsPanel: React.FC<
  CustomerProjectRequestsPanelProps
> = (props) => {
  const {
    requests,
    unreadCounts,
    isLoading,
    isFormOpen,
    isCreatingRequest,
    loadError,
    formError,
    toggleForm,
    handleCreateRequest,
  } = useCustomerProjectRequests(props);

  return (
    <section style={styles.panel}>
      <ProjectRequestsHeader isFormOpen={isFormOpen} onToggleForm={toggleForm} />

      {isFormOpen && (
        <CustomerProjectRequestForm
          initialValues={props.initialRequestValues}
          isSubmitting={isCreatingRequest}
          error={formError}
          onSubmit={handleCreateRequest}
        />
      )}

      {loadError && <p style={styles.error}>{loadError}</p>}

      {isLoading && (
        <ProjectRequestsState
          title=""
          text="Loading project requests..."
        />
      )}

      {!isLoading && requests.length === 0 && (
        <ProjectRequestsState
          title="No project requests yet"
          text="Create your first request when you are ready to start a project."
        />
      )}

      {!isLoading && requests.length > 0 && (
        <div style={styles.list}>
          {requests.map((request) => (
            <ProjectRequestCard
              key={request.id}
              request={request}
              unreadCount={unreadCounts[request.id] ?? 0}
            />
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
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: spacing.xl,
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
  list: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: spacing.md,
  },
};
