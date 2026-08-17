import React from "react";
import { CustomerProjectRequestForm } from "./ProjectRequestForm";
import { ProjectRequestCard } from "./ProjectRequestCard";
import { ProjectRequestsHeader } from "./ProjectRequestsHeader";
import { ProjectRequestsState } from "./ProjectRequestsState";
import { projectRequestsPanelStyles as styles } from "./projectRequestsPanel.styles";
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
