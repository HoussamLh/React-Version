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
          <colgroup>
            <col style={styles.featureColumn} />
            <col style={styles.planColumn} />
            <col style={styles.planColumn} />
            <col style={styles.planColumn} />
          </colgroup>

          <thead>
            <tr>
              <th style={styles.thLeft}>Features</th>
              <th style={styles.thCenter}>Standard</th>
              <th style={styles.thCenter}>Advanced</th>
              <th style={styles.thCenter}>Premium</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td style={styles.tdLeft}>{row.feature}</td>
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
    tableLayout: "fixed" as const,
    minWidth: "720px",
  },

  featureColumn: {
    width: "40%",
  },

  planColumn: {
    width: "20%",
  },

  thLeft: {
    padding: "22px",
    textAlign: "left" as const,
    color: "var(--text-muted)",
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    borderBottom: "1px solid var(--border-color)",
    whiteSpace: "nowrap" as const,
  },

  thCenter: {
    padding: "22px",
    textAlign: "center" as const,
    color: "var(--text-muted)",
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    borderBottom: "1px solid var(--border-color)",
    whiteSpace: "nowrap" as const,
  },

  tdLeft: {
    padding: "22px",
    textAlign: "left" as const,
    color: "var(--text-main)",
    borderBottom: "1px solid var(--border-color)",
    verticalAlign: "middle" as const,
  },

  tdCenter: {
    padding: "22px",
    textAlign: "center" as const,
    color: "var(--text-muted)",
    borderBottom: "1px solid var(--border-color)",
    verticalAlign: "middle" as const,
  },
};
