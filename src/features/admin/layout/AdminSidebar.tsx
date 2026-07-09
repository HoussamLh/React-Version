import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, PanelTop, Users } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import {
  getAdminConversations,
  subscribeToAllAdminMessages,
} from "../chat/adminChat.service";
import { getContactSubmissions } from "../contacts/contactSubmissions.service";

type AdminBadgeCounts = {
  unreadChatMessages: number;
  newContactSubmissions: number;
};

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: <PanelTop size={18} />,
    badgeKey: null,
  },
  {
    label: "Chat",
    to: "/admin/chat",
    icon: <MessageSquare size={18} />,
    badgeKey: "unreadChatMessages" as const,
  },
  {
    label: "Contacts",
    to: "/admin/contacts",
    icon: <Users size={18} />,
    badgeKey: "newContactSubmissions" as const,
  },
];

const getBadgeLabel = (value: number) => {
  if (value <= 0) return null;
  if (value > 99) return "99+";
  return String(value);
};

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const [badgeCounts, setBadgeCounts] = useState<AdminBadgeCounts>({
    unreadChatMessages: 0,
    newContactSubmissions: 0,
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

      const newContactSubmissions = submissions.filter(
        (submission) => submission.status === "new",
      ).length;

      setBadgeCounts({
        unreadChatMessages,
        newContactSubmissions,
      });
    } catch {
      setBadgeCounts({
        unreadChatMessages: 0,
        newContactSubmissions: 0,
      });
    }
  }, []);

  useEffect(() => {
    void loadBadgeCounts();

    const refreshIntervalId = window.setInterval(() => {
      void loadBadgeCounts();
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadBadgeCounts();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const unsubscribeFromMessages = subscribeToAllAdminMessages({
      onMessage: () => {
        void loadBadgeCounts();
      },
    });

    return () => {
      window.clearInterval(refreshIntervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribeFromMessages();
    };
  }, [loadBadgeCounts]);

  const enrichedNavItems = useMemo(() => {
    return navItems.map((item) => {
      const badgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : 0;

      return {
        ...item,
        badgeLabel: getBadgeLabel(badgeValue),
      };
    });
  }, [badgeCounts]);

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>DevBySam</div>

      <nav style={styles.nav}>
        {enrichedNavItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
              }}
            >
              <span style={styles.linkContent}>
                {item.icon}
                <span>{item.label}</span>
              </span>

              {item.badgeLabel && (
                <span
                  style={{
                    ...styles.badge,
                    ...(isActive ? styles.badgeActive : {}),
                  }}
                >
                  {item.badgeLabel}
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
  },

  brand: {
    color: colors.accent.green,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    marginBottom: spacing["2xl"],
  },

  nav: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
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
