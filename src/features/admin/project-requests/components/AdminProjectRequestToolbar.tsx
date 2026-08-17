import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminProjectRequestStatus } from "../types/adminProjectRequests.types";
import { formatProjectRequestLabel } from "../utils/adminProjectRequests.utils";

export type AdminProjectRequestFilter = "all" | AdminProjectRequestStatus;

type AdminProjectRequestToolbarProps = {
  searchQuery: string;
  statusFilter: AdminProjectRequestFilter;
  statusOptions: AdminProjectRequestStatus[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: AdminProjectRequestFilter) => void;
};

export const AdminProjectRequestToolbar: React.FC<
  AdminProjectRequestToolbarProps
> = ({
  searchQuery,
  statusFilter,
  statusOptions,
  onSearchChange,
  onStatusFilterChange,
}) => {
  const filters: AdminProjectRequestFilter[] = ["all", ...statusOptions];

  return (
    <div style={styles.toolbar}>
      <input
        style={styles.searchInput}
        value={searchQuery}
        placeholder="Search requests..."
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div style={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            style={{
              ...styles.filterButton,
              ...(statusFilter === filter ? styles.filterButtonActive : {}),
            }}
            onClick={() => onStatusFilterChange(filter)}
          >
            {formatProjectRequestLabel(filter)}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "240px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    outline: "none",
  },

  filters: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.muted,
    padding: `${spacing.xs} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  filterButtonActive: {
    backgroundColor: colors.accent.green,
    borderColor: colors.accent.green,
    color: colors.background.dark,
  },
};
