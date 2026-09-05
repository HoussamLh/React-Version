import React from "react";
import { colors, radius, spacing } from "../../../../../design-system";
import { ProjectMessageMediaList } from "../../../../../shared/components/media/ProjectMessageMediaList";
import type { AdminProjectMessage } from "../services/adminProjectMessages.service";

type Props = {
  message: AdminProjectMessage;
};

export const AdminProjectMessagesItem: React.FC<Props> = ({ message }) => (
  <div
    style={{
      ...styles.message,
      ...(message.senderType === "admin" ? styles.admin : styles.customer),
    }}
  >
    <strong style={styles.sender}>
      {message.senderType === "admin" ? "DevBySam Team" : "Customer"}
    </strong>

    {message.message && <p style={styles.text}>{message.message}</p>}

    <ProjectMessageMediaList media={message.media} />

    <span style={styles.date}>
      {new Date(message.createdAt).toLocaleString()}
    </span>
  </div>
);

const styles = {
  message: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  admin: {
    backgroundColor: "rgba(116,245,66,0.08)",
    border: `1px solid ${colors.accent.green}`,
  },
  customer: {
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
    display: "block",
    marginTop: spacing.sm,
    color: colors.text.muted,
    fontSize: "11px",
  },
};
