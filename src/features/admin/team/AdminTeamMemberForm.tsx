import React, { useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type {
  AdminTeamAccent,
  AdminTeamMember,
  AdminTeamMemberFormValues,
  AdminTeamStatus,
} from "./teamCms.types";

type AdminTeamMemberFormProps = {
  initialMember?: AdminTeamMember | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: AdminTeamMemberFormValues) => Promise<void>;
};

const defaultTeamMemberValues: AdminTeamMemberFormValues = {
  name: "",
  role: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  hoverAccent: "green",
  status: "draft",
  sortOrder: 0,
};

export const AdminTeamMemberForm: React.FC<AdminTeamMemberFormProps> = ({
  initialMember,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const initialValues = useMemo<AdminTeamMemberFormValues>(() => {
    if (!initialMember) {
      return defaultTeamMemberValues;
    }

    return {
      name: initialMember.name,
      role: initialMember.role,
      description: initialMember.description,
      imageUrl: initialMember.imageUrl,
      imageAlt: initialMember.imageAlt,
      hoverAccent: initialMember.hoverAccent,
      status: initialMember.status,
      sortOrder: initialMember.sortOrder,
    };
  }, [initialMember]);

  const [name, setName] = useState(initialValues.name);
  const [role, setRole] = useState(initialValues.role);
  const [description, setDescription] = useState(initialValues.description);
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);
  const [imageAlt, setImageAlt] = useState(initialValues.imageAlt);
  const [hoverAccent, setHoverAccent] = useState<AdminTeamAccent>(
    initialValues.hoverAccent,
  );
  const [status, setStatus] = useState<AdminTeamStatus>(initialValues.status);
  const [sortOrder, setSortOrder] = useState(String(initialValues.sortOrder));
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setValidationError("Team member name is required.");
      return;
    }

    if (!role.trim()) {
      setValidationError("Team member role is required.");
      return;
    }

    if (!description.trim()) {
      setValidationError("Team member description is required.");
      return;
    }

    if (!imageUrl.trim()) {
      setValidationError("Image URL is required.");
      return;
    }

    setValidationError(null);

    await onSubmit({
      name: name.trim(),
      role: role.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      imageAlt: imageAlt.trim() || name.trim(),
      hoverAccent,
      status,
      sortOrder: Number(sortOrder) || 0,
    });
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(validationError || error) && (
        <div style={styles.errorBox}>{validationError || error}</div>
      )}

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Name</span>
          <input
            style={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Sam Lahlah"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Role</span>
          <input
            style={styles.input}
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Founder & Software Engineer"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Image URL</span>
          <input
            style={styles.input}
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/team/sam-lahlah.png"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Image alt</span>
          <input
            style={styles.input}
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            placeholder="Sam Lahlah"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Hover accent</span>
          <select
            style={styles.input}
            value={hoverAccent}
            onChange={(event) =>
              setHoverAccent(event.target.value as AdminTeamAccent)
            }
          >
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            <option value="pink">Pink</option>
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Status</span>
          <select
            style={styles.input}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AdminTeamStatus)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Sort order</span>
          <input
            style={styles.input}
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </label>
      </div>

      <label style={styles.field}>
        <span style={styles.label}>Description</span>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Focused on building scalable web platforms..."
        />
      </label>

      {imageUrl.trim() && (
        <div style={styles.previewBox}>
          <span style={styles.label}>Image preview</span>
          <img src={imageUrl} alt={imageAlt || name} style={styles.preview} />
        </div>
      )}

      <div style={styles.actions}>
        <button type="button" style={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>

        <button
          type="submit"
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing.md,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
  },

  label: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical",
    outline: "none",
  },

  previewBox: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  },

  preview: {
    width: "160px",
    height: "120px",
    objectFit: "cover",
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.dark,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  cancelButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  submitButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
  },
};
