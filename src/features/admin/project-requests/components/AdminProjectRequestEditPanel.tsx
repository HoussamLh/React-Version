import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminProjectRequest,
  AdminProjectRequestStatus,
} from "../types/adminProjectRequests.types";
import { AdminProjectMessagesPanel } from "../messages/components/AdminProjectMessagesPanel";

type AdminProjectRequestEditPanelProps = {
  request: AdminProjectRequest;
  status: AdminProjectRequestStatus;
  adminNotes: string;
  statusOptions: AdminProjectRequestStatus[];
  isUpdating: boolean;
  updateError: string;
  onStatusChange: (status: AdminProjectRequestStatus) => void;
  onAdminNotesChange: (notes: string) => void;
  onSave: () => void;
  onClose: () => void;
  onMessagesRead: () => void;
};

export const AdminProjectRequestEditPanel: React.FC<
  AdminProjectRequestEditPanelProps
> = ({
  request,
  status,
  adminNotes,
  statusOptions,
  isUpdating,
  updateError,
  onStatusChange,
  onAdminNotesChange,
  onSave,
  onClose,
  onMessagesRead,
}) => {
  return (
    <div style={styles.editPanel}>
      <div style={styles.editHeader}>
        <div>
          <p style={styles.eyebrow}>Update Request</p>

          <h2 style={styles.editTitle}>{request.title}</h2>

          <p style={styles.editSubtitle}>
            {request.customerName || request.customerEmail}
          </p>
        </div>

        <button type="button" style={styles.secondaryButton} onClick={onClose}>
          Close
        </button>
      </div>

      {updateError && <p style={styles.errorBox}>{updateError}</p>}

      <div style={styles.editGrid}>
        <label style={styles.field}>
          <span style={styles.label}>Status</span>

          <select
            style={styles.input}
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as AdminProjectRequestStatus)
            }
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Admin notes</span>

          <textarea
            style={styles.textarea}
            value={adminNotes}
            placeholder="Internal notes for this request..."
            onChange={(event) => onAdminNotesChange(event.target.value)}
          />
        </label>
      </div>

      <button
        type="button"
        style={{
          ...styles.primaryButton,
          ...(isUpdating ? styles.disabledButton : {}),
        }}
        disabled={isUpdating}
        onClick={onSave}
      >
        {isUpdating ? "Saving..." : "Save Request"}
      </button>

      <AdminProjectMessagesPanel
        projectRequestId={request.id}
        onMessagesRead={onMessagesRead}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  editPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.lg,
    marginBottom: spacing.lg,
    display: "flex",
    flexDirection: "column",
    gap: spacing.lg,
  },

  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.lg,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  editTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  editSubtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  editGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 260px) 1fr",
    gap: spacing.lg,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  },

  label: {
    color: colors.text.main,
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    textTransform: "capitalize",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical",
  },

  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
    alignSelf: "flex-start",
  },

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },
};
