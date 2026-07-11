import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FolderKanban, MessageSquare, PanelTop, Users } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { getAdminConversations } from "../chat/adminChat.service";
import { getContactSubmissions } from "../contacts/contactSubmissions.service";

type AdminSidebarProps = {
  isCompactLayout?: boolean;
};

type AdminBadgeCounts = {
  unreadChatMessages: number;
  activeContactSubmissions: number;
};

type BadgeKey = keyof AdminBadgeCounts;

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  badgeKey: BadgeKey | null;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: <PanelTop size={18} />,
    badgeKey: null,
  },
  {
    label: "Projects",
    to: "/admin/projects",
    icon: <FolderKanban size={18} />,
    badgeKey: null,
  },
  {
    label: "Chat",
    to: "/admin/chat",
    icon: <MessageSquare size={18} />,
    badgeKey: "unreadChatMessages",
  },
  {
    label: "Contacts",
    to: "/admin/contacts",
    icon: <Users size={18} />,
    badgeKey: "activeContactSubmissions",
  },
];

const getBadgeLabel = (value: number) => {
  if (value <= 0) return null;
  if (value > 99) return "99+";
  return String(value);
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCompactLayout = false,
}) => {
  const location = useLocation();

  const [badgeCounts, setBadgeCounts] = useState<AdminBadgeCounts>({
    unreadChatMessages: 0,
    activeContactSubmissions: 0,
  });

  const loadBadgeCounts = useCallback(async () => {
    try {
      const [conversations, submissions] = await Promise.all([
        getAdminConversations(),
        getContactSubmissions(),
      ]);

      const unreadChatMessages = conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0,
      );

      const activeContactSubmissions = submissions.filter(
        (submission) => submission.status !== "closed",
      ).length;

      setBadgeCounts({
        unreadChatMessages,
        activeContactSubmissions,
      });
    } catch (error) {
      console.error("Failed to load admin sidebar badge counts:", error);

      setBadgeCounts({
        unreadChatMessages: 0,
        activeContactSubmissions: 0,
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const safeLoadBadgeCounts = () => {
      window.setTimeout(() => {
        if (!isMounted) return;
        void loadBadgeCounts();
      }, 0);
    };

    safeLoadBadgeCounts();

    const refreshIntervalId = window.setInterval(() => {
      safeLoadBadgeCounts();
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        safeLoadBadgeCounts();
      }
    };

    const handleAdminBadgesChanged = () => {
      safeLoadBadgeCounts();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("admin-badges-changed", handleAdminBadgesChanged);

    return () => {
      isMounted = false;
      window.clearInterval(refreshIntervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(
        "admin-badges-changed",
        handleAdminBadgesChanged,
      );
    };
  }, [loadBadgeCounts]);

  return (
    <aside
      style={{
        ...styles.sidebar,
        ...(isCompactLayout ? styles.sidebarCompact : {}),
      }}
    >
      <div
        style={{
          ...styles.brand,
          ...(isCompactLayout ? styles.brandCompact : {}),
        }}
      >
        DevBySam
      </div>

      <nav
        style={{
          ...styles.nav,
          ...(isCompactLayout ? styles.navCompact : {}),
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const badgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          const badgeLabel = getBadgeLabel(badgeValue);

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.link,
                ...(isCompactLayout ? styles.linkCompact : {}),
                ...(isActive ? styles.linkActive : {}),
              }}
            >
              <span style={styles.linkContent}>
                {item.icon}
                <span>{item.label}</span>
              </span>

              {badgeLabel && (
                <span
                  style={{
                    ...styles.badge,
                    ...(isActive ? styles.badgeActive : {}),
                  }}
                >
                  {badgeLabel}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    backgroundColor: colors.background.card,
    borderRight: `1px solid ${colors.border.default}`,
    padding: spacing.xl,
    boxSizing: "border-box" as const,
    flexShrink: 0,
  },

  sidebarCompact: {
    width: "100%",
    minHeight: "auto",
    borderRight: "none",
    borderBottom: `1px solid ${colors.border.default}`,
    padding: spacing.md,
  },

  brand: {
    color: colors.accent.green,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    marginBottom: spacing["2xl"],
  },

  brandCompact: {
    marginBottom: spacing.md,
  },

  nav: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  navCompact: {
    flexDirection: "row" as const,
    overflowX: "auto" as const,
    paddingBottom: "2px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    padding: `12px ${spacing.md}`,
    borderRadius: radius.md,
    color: colors.text.muted,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
  },

  linkCompact: {
    flexShrink: 0,
    minWidth: "fit-content",
  },

  linkActive: {
    color: colors.background.dark,
    backgroundColor: colors.accent.green,
  },

  linkContent: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },

  badge: {
    minWidth: "22px",
    height: "22px",
    padding: "0 7px",
    borderRadius: radius.pill,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: typography.fontWeight.black,
    lineHeight: 1,
    flexShrink: 0,
  },

  badgeActive: {
    backgroundColor: colors.background.dark,
    color: colors.accent.green,
  },
};
