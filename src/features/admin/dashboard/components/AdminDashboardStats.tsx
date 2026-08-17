import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminDashboardStats as DashboardStats } from "../helpers/adminDashboard.helpers";

type AdminDashboardStatsProps = {
  stats: DashboardStats;
  isCompact: boolean;
  isNarrow: boolean;
};

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  stats,
  isCompact,
  isNarrow,
}) => {
  return (
    <div
      style={{
        ...styles.grid,
        ...(isCompact ? styles.gridCompact : {}),
        ...(isNarrow ? styles.gridNarrow : {}),
      }}
    >
      <div style={styles.statCard}>
        <p style={styles.statLabel}>Contact submissions</p>
        <h3 style={styles.statValue}>{stats.totalSubmissions}</h3>
        <p style={styles.statText}>{stats.newSubmissions} new enquiry</p>
      </div>

      <div style={styles.statCard}>
        <p style={styles.statLabel}>Live chat conversations</p>
        <h3 style={styles.statValue}>{stats.totalConversations}</h3>
        <p style={styles.statText}>{stats.openConversations} open chat</p>
      </div>

      <div style={styles.statCard}>
        <p style={styles.statLabel}>Unread chat messages</p>
        <h3 style={styles.statValue}>{stats.unreadMessages}</h3>
        <p style={styles.statText}>Visitor replies waiting</p>
      </div>

      <div style={styles.statCard}>
        <p style={styles.statLabel}>Offline enquiries</p>
        <h3 style={styles.statValue}>{stats.offlineMessages}</h3>
        <p style={styles.statText}>Messages left out of hours</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: spacing.lg,
  },

  gridCompact: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  gridNarrow: {
    gridTemplateColumns: "1fr",
  },

  statCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    minWidth: 0,
  },

  statLabel: {
    color: colors.text.muted,
    fontSize: "12px",
    margin: `0 0 ${spacing.md} 0`,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  statValue: {
    color: colors.text.main,
    fontSize: "34px",
    lineHeight: "40px",
    fontWeight: typography.fontWeight.black,
    margin: `0 0 ${spacing.sm} 0`,
  },

  statText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },
};
