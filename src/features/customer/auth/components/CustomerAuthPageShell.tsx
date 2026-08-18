import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 90px)",
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  card: {
    width: "100%",
    maxWidth: "820px",
    padding: spacing["2xl"],
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
  },

  checkingText: {
    color: colors.text.muted,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    margin: 0,
  },

  header: {
    marginBottom: spacing.xl,
  },

  badge: {
    display: "inline-flex",
    marginBottom: spacing.md,
    padding: "7px 14px",
    borderRadius: radius.md,
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    fontSize: "10px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  title: {
    color: colors.text.main,
    fontSize: "34px",
    lineHeight: "42px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    maxWidth: "640px",
  },
};

type CustomerAuthPageShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export const CustomerAuthPageShell: React.FC<CustomerAuthPageShellProps> = ({
  badge,
  title,
  subtitle,
  children,
}) => {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>{badge}</span>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
};

export const CustomerAuthCheckingState: React.FC = () => {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.checkingText}>Checking customer session...</p>
      </section>
    </main>
  );
};
