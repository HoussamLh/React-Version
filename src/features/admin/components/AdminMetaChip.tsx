import React from "react";
import { colors, radius } from "../../../design-system";

type AdminMetaChipProps = {
  children: React.ReactNode;
};

export const AdminMetaChip: React.FC<AdminMetaChipProps> = ({ children }) => {
  return <span style={styles.metaChip}>{children}</span>;
};

const styles = {
  metaChip: {
    color: colors.text.muted,
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    padding: "6px 10px",
    fontSize: "11px",
    lineHeight: "16px",
    whiteSpace: "nowrap" as const,
  },
};
