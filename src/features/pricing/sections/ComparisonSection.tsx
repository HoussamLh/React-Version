import React, { useEffect, useState } from "react";
import {
  colors,
  radius,
  SharedHero,
  spacing,
  typography,
} from "../../../design-system";
import { ComparisonTable } from "../components";
import type { ComparisonRow } from "../data/pricing.data";
import { getPublishedComparisonRows } from "../api";

export const ComparisonSection: React.FC = () => {
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsRows = await getPublishedComparisonRows();

          if (!isMounted) return;

          setRows(cmsRows);
          setError(null);
        } catch (error) {
          console.error("Could not load CMS comparison rows:", error);

          if (!isMounted) return;

          setError("Comparison rows could not be loaded right now.");
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      })();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section style={styles.container} className="ds-section">
      <SharedHero
        badgeText="COMPARISON TABLE"
        titleStart="Know what is"
        titleAccent="Included."
        subtitle="A quick technical comparison between the main build levels."
        align="center"
        className="ds-hero-no-bottom-gap"
        containerStyle={{
          padding: 0,
        }}
      />

      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading comparison rows...</p>
        </div>
      )}

      {!isLoading && error && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Comparison unavailable</h2>
          <p style={styles.stateText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Comparison coming soon</h2>
          <p style={styles.stateText}>
            Comparison rows will be published here soon.
          </p>
        </div>
      )}

      {!isLoading && !error && rows.length > 0 && (
        <ComparisonTable rows={rows} />
      )}
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },

  stateBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    textAlign: "center" as const,
    marginTop: spacing["2xl"],
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
