import React from "react";
import { colors, radius, spacing } from "../../../../design-system";

const styles: Record<string, React.CSSProperties> = {
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
  },
};

type CustomerAuthFormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const CustomerAuthFormField: React.FC<CustomerAuthFormFieldProps> = ({
  label,
  ...inputProps
}) => {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input style={styles.input} {...inputProps} />
    </label>
  );
};
