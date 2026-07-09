import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../design-system";
import { getAdminConversations } from "../chat/adminChat.service";
import type { AdminConversation } from "../chat/adminChat.types";
import { getContactSubmissions } from "../contacts/contactSubmissions.service";
import type { ContactSubmission } from "../contacts/contactSubmissions.types";

const subscribeToCompactDashboard = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
};

const getCompactDashboardSnapshot = () => {
  return window.matchMedia("(max-width: 900px)").matches;
};

const getServerCompactDashboardSnapshot = () => false;

const subscribeToNarrowDashboard = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(max-width: 640px)");

  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
};

const getNarrowDashboardSnapshot = () => {
  return window.matchMedia("(max-width: 640px)").matches;
};

const getServerNarrowDashboardSnapshot = () => false;

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getVisitorLabel = (conversation: AdminConversation) => {
  return (
    conversation.visitorName ??
    conversation.visitorEmail ??
    `Visitor ${conversation.visitorId.slice(0, 8)}`
  );
};

export const AdminDashboard: React.FC = () => {
  const isCompactDashboard = useSyncExternalStore(
    subscribeToCompactDashboard,
    getCompactDashboardSnapshot,
    getServerCompactDashboardSnapshot,
  );

  const isNarrowDashboard = useSyncExternalStore(
    subscribeToNarrowDashboard,
    getNarrowDashboardSnapshot,
    getServerNarrowDashboardSnapshot,
  );

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextSubmissions, nextConversations] = await Promise.all([
        getContactSubmissions(),
        getAdminConversations(),
      ]);

      setSubmissions(nextSubmissions);
      setConversations(nextConversations);
    } catch {
      setError("Could not load dashboard overview.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    window.setTimeout(() => {
      if (!isMounted) return;
      void loadDashboard();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const totalSubmissions = submissions.length;
    const newSubmissions = submissions.filter(
      (submission) => submission.status === "new",
    ).length;

    const totalConversations = conversations.length;
    const openConversations = conversations.filter(
      (conversation) => conversation.status === "open",
    ).length;

    const unreadMessages = conversations.reduce(
      (total, conversation) => total + conversation.unreadCount,
      0,
    );

    const offlineMessages = conversations.filter(
      (conversation) => conversation.chatMode === "offline",
    ).length;

    return {
      totalSubmissions,
      newSubmissions,
      totalConversations,
      openConversations,
      unreadMessages,
      offlineMessages,
    };
  }, [conversations, submissions]);

  const recentSubmissions = submissions.slice(0, 5);
  const recentConversations = conversations.slice(0, 5);

  return (
    <section style={styles.page}>
      <header
        style={{
          ...styles.header,
          ...(isCompactDashboard ? styles.headerCompact : {}),
        }}
      >
        <div style={styles.headerContent}>
          <p style={styles.eyebrow}>Admin overview</p>
          <h2
            style={{
              ...styles.title,
              ...(isNarrowDashboard ? styles.titleNarrow : {}),
            }}
          >
            Dashboard
          </h2>
          <p style={styles.subtitle}>
            Monitor contact enquiries, live chat conversations, and follow-up
            activity from one place.
          </p>
        </div>

        <button
          type="button"
          style={{
            ...styles.refreshButton,
            ...(isNarrowDashboard ? styles.refreshButtonNarrow : {}),
            ...(isLoading ? styles.disabledAction : {}),
          }}
          onClick={loadDashboard}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && <p style={styles.error}>{error}</p>}

      {isLoading && (
        <p style={styles.loadingText}>
          {submissions.length === 0 && conversations.length === 0
            ? "Loading dashboard overview..."
            : "Refreshing dashboard overview..."}
        </p>
      )}

      <div
        style={{
          ...styles.statsGrid,
          ...(isCompactDashboard ? styles.statsGridCompact : {}),
          ...(isNarrowDashboard ? styles.statsGridNarrow : {}),
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

      <div
        style={{
          ...styles.contentGrid,
          ...(isCompactDashboard ? styles.contentGridCompact : {}),
        }}
      >
        <section style={styles.panel}>
          <div
            style={{
              ...styles.panelHeader,
              ...(isNarrowDashboard ? styles.panelHeaderNarrow : {}),
            }}
          >
            <div>
              <h3 style={styles.panelTitle}>Recent contact enquiries</h3>
              <p style={styles.panelSubtitle}>
                Latest submissions from the contact form.
              </p>
            </div>

            <Link to="/admin/contacts" style={styles.panelLink}>
              View all
            </Link>
          </div>

          <div style={styles.list}>
            {!isLoading && recentSubmissions.length === 0 && (
              <div style={styles.listEmptyState}>
                <h4 style={styles.listEmptyTitle}>
                  No contact submissions yet
                </h4>
                <p style={styles.listEmptyText}>
                  New website contact form enquiries will appear here.
                </p>
                <Link to="/admin/contacts" style={styles.listEmptyLink}>
                  Open contacts
                </Link>
              </div>
            )}

            {recentSubmissions.map((submission) => (
              <Link
                key={submission.id}
                to="/admin/contacts"
                style={styles.listItem}
              >
                <div style={styles.listTop}>
                  <span style={styles.itemTitle}>{submission.name}</span>
                  <span style={styles.itemDate}>
                    {formatDate(submission.createdAt)}
                  </span>
                </div>

                <p style={styles.itemText}>{submission.message}</p>

                <div style={styles.itemFooter}>
                  <span style={styles.serviceBadge}>{submission.service}</span>
                  <span style={styles.statusBadge}>{submission.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={styles.panel}>
          <div
            style={{
              ...styles.panelHeader,
              ...(isNarrowDashboard ? styles.panelHeaderNarrow : {}),
            }}
          >
            <div>
              <h3 style={styles.panelTitle}>Recent live chats</h3>
              <p style={styles.panelSubtitle}>
                Latest visitor conversations and unread messages.
              </p>
            </div>

            <Link to="/admin/chat" style={styles.panelLink}>
              View all
            </Link>
          </div>

          <div style={styles.list}>
            {!isLoading && recentConversations.length === 0 && (
              <div style={styles.listEmptyState}>
                <h4 style={styles.listEmptyTitle}>
                  No live chat conversations yet
                </h4>
                <p style={styles.listEmptyText}>
                  New visitor conversations will appear here after someone
                  starts a chat.
                </p>
                <Link to="/admin/chat" style={styles.listEmptyLink}>
                  Open chat inbox
                </Link>
              </div>
            )}

            {recentConversations.map((conversation) => (
              <Link
                key={conversation.id}
                to="/admin/chat"
                style={styles.listItem}
              >
                <div style={styles.listTop}>
                  <span style={styles.itemTitle}>
                    {getVisitorLabel(conversation)}
                  </span>

                  <span style={styles.itemDate}>
                    {formatDate(conversation.lastMessageAt)}
                  </span>
                </div>

                <p style={styles.itemText}>
                  {conversation.lastMessageBody ?? "New conversation"}
                </p>

                <div style={styles.itemFooter}>
                  <span style={styles.serviceBadge}>
                    {conversation.chatMode === "offline"
                      ? "Offline message"
                      : "Live chat"}
                  </span>

                  <span style={styles.statusBadge}>
                    {conversation.unreadCount > 0
                      ? `${conversation.unreadCount} unread`
                      : conversation.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section
        style={{
          ...styles.quickActions,
          ...(isCompactDashboard ? styles.quickActionsCompact : {}),
        }}
      >
        <div style={styles.quickActionsContent}>
          <h3 style={styles.panelTitle}>Quick actions</h3>
          <p style={styles.panelSubtitle}>
            Jump directly to the admin tools you use most.
          </p>
        </div>

        <div
          style={{
            ...styles.actionLinks,
            ...(isNarrowDashboard ? styles.actionLinksNarrow : {}),
          }}
        >
          <Link
            to="/admin/chat"
            style={{
              ...styles.actionLink,
              ...(isNarrowDashboard ? styles.actionLinkNarrow : {}),
            }}
          >
            Open chat inbox
          </Link>

          <Link
            to="/admin/contacts"
            style={{
              ...styles.actionLinkSecondary,
              ...(isNarrowDashboard ? styles.actionLinkNarrow : {}),
            }}
          >
            Review contact submissions
          </Link>
        </div>
      </section>
    </section>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xl,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xl,
  },

  headerCompact: {
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  headerContent: {
    minWidth: 0,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  titleNarrow: {
    fontSize: "28px",
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "15px",
    lineHeight: "24px",
    maxWidth: "680px",
    margin: `${spacing.sm} 0 0 0`,
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

  loadingText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  disabledAction: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "14px",
    margin: 0,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: spacing.lg,
  },

  statsGridCompact: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  statsGridNarrow: {
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
    textTransform: "uppercase" as const,
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

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing.lg,
  },

  contentGridCompact: {
    gridTemplateColumns: "1fr",
  },

  panel: {
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    minWidth: 0,
  },

  panelHeader: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
  },

  panelHeaderNarrow: {
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  panelTitle: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  panelSubtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  panelLink: {
    color: colors.accent.green,
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: typography.fontWeight.bold,
    flexShrink: 0,
  },

  list: {
    display: "flex",
    flexDirection: "column" as const,
  },

  listItem: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    textDecoration: "none",
    display: "block",
    minWidth: 0,
  },

  listTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  itemTitle: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    minWidth: 0,
  },

  itemDate: {
    color: colors.text.muted,
    fontSize: "11px",
    flexShrink: 0,
  },

  itemText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },

  itemFooter: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  serviceBadge: {
    color: colors.text.main,
    backgroundColor: "rgba(255,255,255,0.05)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
  },

  statusBadge: {
    color: colors.accent.green,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    padding: spacing.lg,
  },

  listEmptyState: {
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  listEmptyTitle: {
    color: colors.text.main,
    fontSize: "16px",
    fontWeight: typography.fontWeight.black,
    margin: `0 0 ${spacing.sm} 0`,
  },

  listEmptyText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `0 0 ${spacing.md} 0`,
  },

  listEmptyLink: {
    color: colors.accent.green,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },

  quickActions: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xl,
  },

  quickActionsCompact: {
    flexDirection: "column" as const,
    alignItems: "stretch",
  },

  quickActionsContent: {
    minWidth: 0,
  },

  actionLinks: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    flexWrap: "wrap" as const,
  },

  actionLinksNarrow: {
    flexDirection: "column" as const,
    alignItems: "stretch",
  },

  actionLink: {
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `12px ${spacing.lg}`,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: typography.fontWeight.black,
    textAlign: "center" as const,
  },

  actionLinkSecondary: {
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    color: colors.text.main,
    padding: `12px ${spacing.lg}`,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "center" as const,
  },

  actionLinkNarrow: {
    width: "100%",
    boxSizing: "border-box" as const,
  },
};
