import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type { TeamFilter } from "../helpers/teamCms.helpers";

const filters: TeamFilter[] = ["all", "published", "draft"];

type AdminTeamToolbarProps = {
  statusFilter: TeamFilter;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TeamFilter) => void;
};

export const AdminTeamToolbar: React.FC<AdminTeamToolbarProps> = ({
  statusFilter,
  searchQuery,
  onSearchChange,
  onStatusFilterChange,
}) => {
  return (
    <div style={styles.toolbar}>
      <input
        style={styles.searchInput}
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search team members..."
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
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: "wrap" as const,
  },

  searchInput: {
    flex: 1,
    minWidth: "240px",
    boxSizing: "border-box" as const,
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
    flexWrap: "wrap" as const,
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
    textTransform: "capitalize" as const,
  },

  filterButtonActive: {
    backgroundColor: colors.accent.green,
    borderColor: colors.accent.green,
    color: colors.background.dark,
  },
};
