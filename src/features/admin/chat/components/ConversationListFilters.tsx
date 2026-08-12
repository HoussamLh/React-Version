import React from "react";
import { colors, spacing } from "../../../../design-system";
import {
  AdminSearchInput,
  AdminFilterButton,
  AdminResetButton,
} from "../../components";
import type { AdminConversationStatus } from "../types/adminChat.types";

export type AdminConversationFilter =
  | "all"
  | AdminConversationStatus
  | "unread"
  | "offline";

type ConversationListFiltersProps = {
  totalConversationCount: number;
  visibleConversationCount: number;
  searchQuery: string;
  conversationFilter: AdminConversationFilter;
  filterCounts: Record<AdminConversationFilter, number>;
  hasActiveFilters: boolean;
  isNarrowChat: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: AdminConversationFilter) => void;
  onResetFilters: () => void;
};

const filterOptions: {
  label: string;
  value: AdminConversationFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
  { label: "Unread", value: "unread" },
  { label: "Offline", value: "offline" },
];

export const ConversationListFilters: React.FC<
  ConversationListFiltersProps
> = ({
  totalConversationCount,
  visibleConversationCount,
  searchQuery,
  conversationFilter,
  filterCounts,
  hasActiveFilters,
  isNarrowChat,
  onSearchChange,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <>
      <div
        style={{
          ...styles.searchArea,
          ...(isNarrowChat ? styles.searchAreaNarrow : {}),
        }}
      >
        <AdminSearchInput
          value={searchQuery}
          placeholder="Search by name, email or phone number..."
          onChange={onSearchChange}
        />

        {hasActiveFilters && (
          <AdminResetButton isNarrow={isNarrowChat} onClick={onResetFilters} />
        )}
      </div>

      <div style={styles.filters}>
        {filterOptions.map((filter) => (
          <AdminFilterButton
            key={filter.value}
            label={filter.label}
            count={filterCounts[filter.value]}
            isActive={conversationFilter === filter.value}
            onClick={() => onFilterChange(filter.value)}
          />
        ))}
      </div>

      {hasActiveFilters && (
        <p style={styles.activeFilterText}>
          Showing {visibleConversationCount} of {totalConversationCount}{" "}
          conversations.
        </p>
      )}
    </>
  );
};

const styles = {
  searchArea: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
  },

  searchAreaNarrow: {
    flexDirection: "column" as const,
  },

  filters: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  activeFilterText: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.border.default}`,
  },
};
