import React from "react";
import { Card } from "../../../design-system";
import type { ComparisonRow } from "../data/pricing.data";

type ComparisonTableProps = {
  rows: ComparisonRow[];
};

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ rows }) => {
  return (
    <Card style={styles.card}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Features</th>
              <th style={styles.th}>Standard</th>
              <th style={styles.th}>Advanced</th>
              <th style={styles.th}>Premium</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td style={styles.td}>{row.feature}</td>
                <td style={styles.tdCenter}>{row.standard}</td>
                <td style={styles.tdCenter}>{row.advanced}</td>
                <td style={styles.tdCenter}>{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const styles = {
  card: {
    padding: "0",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto" as const,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    minWidth: "640px",
  },

  th: {
    padding: "22px",
    textAlign: "left" as const,
    color: "var(--text-muted)",
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    borderBottom: "1px solid var(--border-color)",
  },

  td: {
    padding: "22px",
    color: "var(--text-main)",
    borderBottom: "1px solid var(--border-color)",
  },

  tdCenter: {
    padding: "22px",
    textAlign: "center" as const,
    color: "var(--text-muted)",
    borderBottom: "1px solid var(--border-color)",
  },
};
