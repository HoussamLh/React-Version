import React from "react";
import { colors, radius, spacing } from "../../../../../design-system";
import type { CustomerProjectMessage } from "../ProjectRequestsMessages.types";

type Props = { 
  message: CustomerProjectMessage 
};

export const ProjectMessageItem: React.FC<Props> = ({ message }) => (
  <div style={{ 
    ...styles.message, 
    ...(message.senderType === "customer" ? 
      styles.customer : styles.team) 
    }}>
    <strong style={styles.sender}>
      {message.senderType === "customer" ? "You" : "DevBySam Team"}
      </strong>
    <p style={styles.text}>
      {message.message}
    </p>
    <span 
    style={styles.date}>{
      new Date(message.createdAt).toLocaleString()}
    </span>
  </div>
);

const styles = {
  message: { 
    padding: spacing.md, 
    borderRadius: radius.lg, 
  },
  customer: { 
    backgroundColor: "rgba(116,245,66,0.08)", 
    border: `1px solid ${colors.accent.green}`,
  },
  team: { 
    backgroundColor: "rgba(255,255,255,0.04)", 
    border: `1px solid ${colors.border.default}`, 
  },
  sender: { 
    color: colors.text.main, 
    fontSize: "13px", 
  },
  text: { 
    color: colors.text.muted, 
    lineHeight: "22px", 
  },
  date: { 
    color: colors.text.muted, 
    fontSize: "11px", 
  },
};
