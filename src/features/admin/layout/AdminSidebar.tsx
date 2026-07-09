import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, PanelTop, Users } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: <PanelTop size={18} />,
  },
  {
    label: "Chat",
    to: "/admin/chat",
    icon: <MessageSquare size={18} />,
  },
  {
    label: "Contacts",
    to: "/admin/contacts",
    icon: <Users size={18} />,
  },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>DevBySam</div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
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
              {item.icon}
              <span>{item.label}</span>
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
};
