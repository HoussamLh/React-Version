import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { useMediaQuery } from "../../../shared/hooks";
import { AdminPageHeader, AdminLoadingText } from "../components";
import { AdminDashboardQuickActions } from "./components/AdminDashboardQuickActions";
import { AdminDashboardRecentConversations } from "./components/AdminDashboardRecentConversations";
import { AdminDashboardRecentSubmissions } from "./components/AdminDashboardRecentSubmissions";
import { AdminDashboardStats } from "./components/AdminDashboardStats";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export const AdminDashboard: React.FC = () => {
  const isCompactDashboard = useMediaQuery("(max-width: 900px)");
  const isNarrowDashboard = useMediaQuery("(max-width: 640px)");

  const {
    submissions,
    conversations,
    stats,
    isLoading,
    error,
    loadDashboard,
  } = useAdminDashboard();

  return (
    <section style={styles.page}>
      <AdminPageHeader
        eyebrow="Admin overview"
        title="Dashboard"
        subtitle="Monitor contact enquiries, live chat conversations, and follow-up activity from one place."
        isCompact={isCompactDashboard}
        isNarrow={isNarrowDashboard}
        actions={
          <button
            type="button"
            style={{
              ...styles.refreshButton,
              ...(isNarrowDashboard ? styles.refreshButtonNarrow : {}),
              ...(isLoading ? styles.disabledAction : {}),
            }}
            onClick={() => void loadDashboard()}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        }
      />

      {error && <p style={styles.error}>{error}</p>}

      {isLoading && (
        <AdminLoadingText>
          {submissions.length === 0 && conversations.length === 0
            ? "Loading dashboard overview..."
            : "Refreshing dashboard overview..."}
        </AdminLoadingText>
      )}

      <AdminDashboardStats
        stats={stats}
        isCompact={isCompactDashboard}
        isNarrow={isNarrowDashboard}
      />

      <div
        style={{
          ...styles.contentGrid,
          ...(isCompactDashboard ? styles.contentGridCompact : {}),
        }}
      >
        <AdminDashboardRecentSubmissions
          submissions={submissions}
          isLoading={isLoading}
          isNarrow={isNarrowDashboard}
        />

        <AdminDashboardRecentConversations
          conversations={conversations}
          isLoading={isLoading}
          isNarrow={isNarrowDashboard}
        />
      </div>

      <AdminDashboardQuickActions
        isCompact={isCompactDashboard}
        isNarrow={isNarrowDashboard}
      />
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xl,
  },

  refreshButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `11px ${spacing.lg}`,
    cursor: "pointer",
    fontWeight: typography.fontWeight.bold,
    flexShrink: 0,
  },

  refreshButtonNarrow: {
    width: "100%",
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "14px",
    margin: 0,
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing.lg,
  },

  contentGridCompact: {
    gridTemplateColumns: "1fr",
  },
};
