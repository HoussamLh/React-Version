import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { ProjectStatus } from "../types/projectsCms.types";

type ProjectFilter = "all" | ProjectStatus;

type AdminProjectsToolbarProps = {
  searchQuery: string;
  statusFilter: ProjectFilter;
  hasActiveFilters: boolean;
  projectCount: number;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: ProjectFilter) => void;
  onResetFilters: () => void;
};

export const AdminProjectsToolbar: React.FC<AdminProjectsToolbarProps> = ({
  searchQuery,
  statusFilter,
  hasActiveFilters,
  projectCount,
  onSearchChange,
  onStatusFilterChange,
  onResetFilters,
}) => {
  return (
    <>
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
            onClick={() => onStatusFilterChange("all")}
          >
            All
          </button>

          <button
            type="button"
            style={{
              ...styles.filterButton,
              ...(statusFilter === "published" ? styles.activeFilter : {}),
            }}
            onClick={() => onStatusFilterChange("published")}
          >
            Published
          </button>

          <button
            type="button"
            style={{
              ...styles.filterButton,
              ...(statusFilter === "draft" ? styles.activeFilter : {}),
            }}
            onClick={() => onStatusFilterChange("draft")}
          >
            Draft
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              style={styles.resetButton}
              onClick={onResetFilters}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={styles.countRow}>
        <span style={styles.countBadge}>{projectCount}</span>

        <span style={styles.countText}>
          {projectCount === 1 ? "project" : "projects"} shown
        </span>
      </div>
    </>
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

  countRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  countBadge: {
    minWidth: "28px",
    height: "24px",
    borderRadius: "999px",
    backgroundColor: "rgba(116, 245, 66, 0.12)",
    color: colors.accent.green,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  countText: {
    color: colors.text.muted,
    fontSize: "13px",
  },
};
