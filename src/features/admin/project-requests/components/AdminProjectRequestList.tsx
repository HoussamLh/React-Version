import React from "react";

import { spacing } from "../../../../design-system";
import type { AdminProjectRequest } from "../types/adminProjectRequests.types";
import { AdminProjectRequestCard } from "./AdminProjectRequestCard";

type AdminProjectRequestListProps = {
  requests: AdminProjectRequest[];
  unreadCounts: Record<string, number>;
  deletingRequestId: string | null;
  onReview: (request: AdminProjectRequest) => void;
  onDelete: (request: AdminProjectRequest) => void;
};

export const AdminProjectRequestList: React.FC<
  AdminProjectRequestListProps
> = ({ requests, unreadCounts, deletingRequestId, onReview, onDelete }) => {
  return (
    <div style={styles.requestList}>
      {requests.map((request) => (
        <AdminProjectRequestCard
          key={request.id}
          request={request}
          unreadCount={unreadCounts[request.id] ?? 0}
          isDeleting={deletingRequestId === request.id}
          onReview={onReview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const styles = {
  requestList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.lg,
  },
};
