import React from "react";

export const SubscriptionSection: React.FC = () => {
  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.textWrapper}>
          <div style={styles.badge} className="mono-text">
            <span style={styles.badgeDot}>• Subscribe Now</span>
          </div>
          <h2 style={styles.heading}>
            Maintenance{" "}
            <span style={styles.subBadge} className="mono-text">
              Subscription.
            </span>
          </h2>
          <h2 style={styles.heading}> Fixed Pricing. </h2>
          <p style={styles.subheading}>
            Enterprise-grade support and insurance for digital products that
            can't afford to fail.
          </p>
        </div>

        {/* Anti-Churn Protection Banner */}
        <div style={styles.emergencyBanner} className="mono-text">
          ⚠️ Website currently broken? A one-time{" "}
          <strong>£150 Restoration Fee</strong> applies to stabilize
          pre-existing crashes.
        </div>
      </div>

      {/* 3-Column Tier Grid */}
      <div style={styles.grid}>
        {/* Tier 1: Static */}
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={styles.tierName} className="mono-text">
              STATIC
            </div>
            <div style={styles.priceContainer}>
              <span style={styles.currency}>£</span>
              <span style={styles.amount}>40</span>
              <span style={styles.period}>/mo</span>
            </div>
            <h3 style={styles.cardTitle}>Maintenance</h3>
            <p style={styles.cardDesc}>
              Best for landing pages, portfolio sites, and simple corporate
              layouts.
            </p>
          </div>

          <hr style={styles.divider} />

          <ul style={styles.featureList}>
            <li style={styles.featureItem}>✓ 24/7 Monitoring</li>
            <li style={styles.featureItem}>✓ Style & Layout Fixes</li>
            <li style={styles.featureItem}>✓ Fix Within 24-Hour </li>
          </ul>

          <button style={styles.btnSecondary}>Protect Site</button>
        </div>

        {/* Tier 2: Dynamic (Most Popular/Highlighted) */}
        <div style={{ ...styles.card, ...styles.featuredCard }}>
          <div style={styles.cardTop}>
            <div style={styles.featuredHeader}>
              <div style={styles.tierName} className="mono-text">
                DYNAMIC
              </div>
              <span style={styles.popularBadge} className="mono-text">
                MOST POPULAR
              </span>
            </div>
            <div style={styles.priceContainer}>
              <span style={styles.currency}>£</span>
              <span style={styles.amount}>80</span>
              <span style={styles.period}>/mo</span>
            </div>
            <h3 style={styles.cardTitle}>Full-Stack</h3>
            <p style={styles.cardDesc}>
              Best for dynamic web apps featuring databases, payment flows, and
              user state.
            </p>
          </div>

          <hr
            style={{
              ...styles.divider,
              borderColor: "rgba(116, 245, 66, 0.2)",
            }}
          />
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>✓ Core Maintenance</li>
            <li style={styles.featureItem}>✓ Database Management</li>
            <li style={styles.featureItem}>✓ API Connection Fixes</li>
            <li style={styles.featureItem}>✓ Fix Within 24-Hour </li>
          </ul>

          <button style={styles.btnPrimary}>Protect App</button>
        </div>

        {/* Tier 3: Enterprise */}
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={styles.tierName} className="mono-text">
              ENTERPRISE
            </div>
            <div style={styles.priceContainer}>
              <span style={styles.currency}>£</span>
              <span style={styles.amount}>100</span>
              <span style={styles.period}>/mo</span>
            </div>
            <h3 style={styles.cardTitle}>Tech Authority</h3>
            <p style={styles.cardDesc}>
              Best for e-commerce stores, custom SaaS products, and active scale
              ups.
            </p>
          </div>

          <hr style={styles.divider} />

          <ul style={styles.featureList}>
            <li style={styles.featureItem}>✓ Full-Stack Shield</li>
            <li style={styles.featureItem}>✓ U-Interface State Fixes</li>
            <li style={styles.featureItem}>✓ Payment Restorations</li>
            <li style={styles.featureItem}>✓ 4-Hour Emergency Fix</li>
          </ul>

          <button style={styles.btnSecondary}>Go Enterprise</button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "100px 0",
    backgroundColor: "var(--bg-dark)",
    borderTop: "1px solid var(--border-color)",
  },
  header: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    marginBottom: "64px",
  },
  heading: {
    fontSize: "44px",
    fontWeight: 900,
    letterSpacing: "-1px",
    color: "var(--text-main)",
    margin: "0 0 16px 0",
  },
  subheading: {
    fontSize: "18px",
    color: "var(--text-muted)",
    maxWidth: "600px",
    lineHeight: "1.5",
    margin: "0 0 32px 0",
  },
  subBadge: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    fontSize: "30px",
    fontWeight: 900,
    padding: "4px 10px",
    borderRadius: "18px",
    letterSpacing: "0.5px",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  },
  emergencyBanner: {
    backgroundColor: "rgba(255, 189, 46, 0.06)",
    border: "1px solid #ffbd2e",
    color: "#ffbd2e",
    padding: "12px 24px",
    borderRadius: "30px",
    fontSize: "13px",
    maxWidth: "700px",
  },
  badge: {
    backgroundColor: "#1c1f26",
    border: "1px solid var(--border-color)",
    color: "var(--accent-green)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  badgeDot: {
    color: "var(--accent-green)",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "32px",
    alignItems: "stretch",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  featuredCard: {
    border: "2px solid var(--accent-green)",
    boxShadow: "0 0 40px rgba(116, 245, 94, 0.03)",
    transform: "scale(1.03)",
  },
  cardTop: {
    display: "flex",
    flexDirection: "column" as const,
  },
  featuredHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierName: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "var(--text-muted)",
    marginBottom: "20px",
  },
  popularBadge: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    fontSize: "10px",
    fontWeight: 900,
    padding: "4px 10px",
    borderRadius: "12px",
    letterSpacing: "0.5px",
    transform: "translateY(-10px)",
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: "16px",
  },
  currency: {
    fontSize: "28px",
    fontWeight: 800,
    color: "var(--text-main)",
  },
  amount: {
    fontSize: "56px",
    fontWeight: 900,
    color: "var(--text-main)",
    lineHeight: 1,
  },
  period: {
    fontSize: "16px",
    color: "var(--text-muted)",
    marginLeft: "4px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 12px 0",
  },
  cardDesc: {
    fontSize: "14px",
    color: "var(--text-muted)",
    lineHeight: "1.5",
    margin: 0,
    minHeight: "42px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid var(--border-color)",
    margin: "32px 0",
    width: "100%",
  },
  featureList: {
    listStyleType: "none",
    padding: 0,
    margin: "0 0 40px 0",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  featureItem: {
    fontSize: "14px",
    color: "var(--text-muted)",
    lineHeight: "1.4",
  },
  btnPrimary: {
    backgroundColor: "var(--accent-green)",
    color: "#000000",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
    transition: "opacity 0.2s ease",
  },
  btnSecondary: {
    backgroundColor: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.2s ease",
  },
};
