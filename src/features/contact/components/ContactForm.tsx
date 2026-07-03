import React, { useState } from "react";
import {
  Button,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const updateField =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.badge}>Project inquiry</span>

        <h3 style={styles.title}>Email us</h3>

        <p style={styles.subtitle}>
          Share your project requirements and we’ll get back to you within 24 hours.
        </p>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.row} className="ds-grid ds-grid-2">
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={updateField("name")}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone</label>
            <input
              style={styles.input}
              type="tel"
              placeholder="07732 323232"
              value={form.phone}
              onChange={updateField("phone")}
              required
            />
          </div>
        </div>

        <div style={styles.row} className="ds-grid ds-grid-2">
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={updateField("email")}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Service</label>

            <select
              style={styles.select}
              value={form.service}
              onChange={updateField("service")}
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="Backend Systems">Backend Systems</option>
              <option value="Maintenance & Support">
                Maintenance & Support
              </option>
              <option value="Emergency Restoration">
                Emergency Restoration
              </option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Message</label>
          <textarea
            style={styles.textarea}
            placeholder="Briefly describe your project requirements..."
            rows={5}
            value={form.message}
            onChange={updateField("message")}
            required
          />
        </div>

        <Button type="submit" fullWidth>
          {status === "sending" ? "Sending..." : "Send an Email"}
        </Button>

        {status === "success" && (
          <p style={styles.success}>Message sent successfully.</p>
        )}

        {status === "error" && (
          <p style={styles.error}>
            Something went wrong. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
};

const styles = {
  panel: {
    width: "100%",
    height: "100%",
    minHeight: "560px",
    boxSizing: "border-box" as const,
    overflow: "hidden",
    padding: spacing["2xl"],
    borderRadius: radius.lg,
    backgroundColor: "rgba(24, 26, 30, 0.82)",
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    flexDirection: "column" as const,
  },

  header: {
    flexShrink: 0,
    marginBottom: spacing.xl,
  },

  badge: {
    display: "inline-flex",
    marginBottom: spacing.md,
    padding: "6px 12px",
    borderRadius: radius.sm,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    backgroundColor: "rgba(147, 220, 92, 0.08)",
    color: colors.accent.green,
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },

  title: {
    fontSize: "24px",
    lineHeight: "36px",
    color: colors.text.main,
    fontWeight: typography.fontWeight.black,
    margin: `0 0 ${spacing.sm} 0`,
  },

  subtitle: {
    fontSize: "14px",
    lineHeight: "22px",
    color: colors.text.muted,
    margin: 0,
    maxWidth: "520px",
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.lg,
    flex: 1,
  },

  row: {
    gap: spacing.lg,
  },

  field: {
    minWidth: 0,
  },

  label: {
    display: "block",
    fontSize: "11px",
    color: colors.text.main,
    marginBottom: spacing.sm,
    letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
  },

  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    backgroundColor: "#F8F0E3",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.sm,
    padding: `12px ${spacing.md}`,
    color: colors.background.dark,
    outline: "none",
    fontSize: typography.fontSize.xs,
  },

  select: {
    width: "100%",
    boxSizing: "border-box" as const,
    backgroundColor: "#F8F0E3",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.sm,
    padding: `12px ${spacing.md}`,
    color: colors.background.dark,
    outline: "none",
    fontSize: typography.fontSize.xs,
    cursor: "pointer",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box" as const,
    minHeight: "140px",
    backgroundColor: "#F8F0E3",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.sm,
    padding: spacing.md,
    color: colors.background.dark,
    outline: "none",
    fontSize: typography.fontSize.xs,
    resize: "vertical" as const,
  },

  success: {
    color: colors.accent.green,
    fontSize: "13px",
    margin: 0,
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "13px",
    margin: 0,
  },
};
