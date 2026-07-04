import React, { useState } from "react";
import {
  Button,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";
import {
  initialContactFormState,
  type ContactFormState,
  type ContactFormStatus,
} from "../data/contactForm.data";
import { ContactFormField } from "./ContactFormField";
import { ContactServiceSelect } from "./ContactServiceSelect";

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialContactFormState);
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  const updateField =
    (field: keyof ContactFormState) =>
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
      setForm(initialContactFormState);
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
          Share your project requirements and we’ll get back to you within 24
          hours.
        </p>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.row} className="ds-grid ds-grid-2">
          <ContactFormField
            label="Name"
            placeholder="John Doe"
            value={form.name}
            onChange={updateField("name")}
          />

          <ContactFormField
            label="Phone"
            type="tel"
            placeholder="07732 323232"
            value={form.phone}
            onChange={updateField("phone")}
          />
        </div>

        <div style={styles.row} className="ds-grid ds-grid-2">
          <ContactFormField
            label="Email"
            type="email"
            placeholder="john@company.com"
            value={form.email}
            onChange={updateField("email")}
          />

          <ContactServiceSelect
            value={form.service}
            onChange={updateField("service")}
          />
        </div>

        <ContactFormField
          label="Message"
          placeholder="Briefly describe your project requirements..."
          value={form.message}
          onChange={updateField("message")}
          multiline
          rows={5}
        />

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
