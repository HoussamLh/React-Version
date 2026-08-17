import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { ProjectStatus } from "../types/projectsCms.types";

export type ProjectFilter = "all" | ProjectStatus;

type AdminProjectFiltersProps = {
  searchQuery: string;
  statusFilter: ProjectFilter;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: ProjectFilter) => void;
  onReset: () => void;
};

export const AdminProjectFilters: React.FC<AdminProjectFiltersProps> = ({
  searchQuery,
  statusFilter,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div style={styles.toolbar}>
      <div style={styles.searchWrap}>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects..."
          style={styles.searchInput}
        />
      </div>

      <div style={styles.filterRow}>
        <button
          type="button"
          style={{
            ...styles.filterButton,
            ...(statusFilter === "all" ? styles.activeFilter : {}),
          }}
          onClick={() => onStatusChange("all")}
        >
          All
        </button>

        <button
          type="button"
          style={{
            ...styles.filterButton,
            ...(statusFilter === "published" ? styles.activeFilter : {}),
          }}
          onClick={() => onStatusChange("published")}
        >
          Published
        </button>

        <button
          type="button"
          style={{
            ...styles.filterButton,
            ...(statusFilter === "draft" ? styles.activeFilter : {}),
          }}
          onClick={() => onStatusChange("draft")}
        >
          Draft
        </button>

        {hasActiveFilters && (
          <button type="button" style={styles.resetButton} onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    flexWrap: "wrap" as const,
    marginBottom: spacing.lg,
  },

  searchWrap: {
    flex: "1 1 280px",
  },

  searchInput: {
    width: "100%",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.muted,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  activeFilter: {
    color: colors.text.main,
    borderColor: colors.accent.green,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
  },

  resetButton: {
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.muted,
    cursor: "pointer",
    fontSize: "13px",
  },
};
