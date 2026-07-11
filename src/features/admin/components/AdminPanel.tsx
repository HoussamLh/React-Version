import React from "react";
import { colors, radius } from "../../../design-system";

type AdminPanelProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ children, style }) => {
  return (
    <section
      style={{
        ...styles.panel,
        ...style,
      }}
    >
      {children}
    </section>
  );
};

const styles = {
  panel: {
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    minWidth: 0,
  },
};
