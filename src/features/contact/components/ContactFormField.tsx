import React from "react";
import { 
  colors, 
  radius, 
  spacing, 
  typography 
} from "../../../design-system";

type ContactFormFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: React.HTMLInputTypeAttribute;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
};

export const ContactFormField: React.FC<ContactFormFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  multiline = false,
  rows = 5,
  required = true,
}) => {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      {multiline ? (
        <textarea
          style={styles.textarea}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          style={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

const styles = {
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
};
