import React, { useEffect, useState } from "react";
import { colors, SharedHero } from "../../../design-system";
import { ComparisonTable } from "../components";
import {
  comparisonRows as fallbackComparisonRows,
  type ComparisonRow,
} from "../data/pricing.data";
import { getPublishedComparisonRows } from "../api";

export const ComparisonSection: React.FC = () => {
  const [rows, setRows] = useState<ComparisonRow[]>(fallbackComparisonRows);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsRows = await getPublishedComparisonRows();

          if (!isMounted || cmsRows.length === 0) return;

          setRows(cmsRows);
        } catch (error) {
          console.error("Could not load CMS comparison rows:", error);
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

      <ComparisonTable rows={rows} />
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },
};
