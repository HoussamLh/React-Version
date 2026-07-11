import React from "react";
import { colors, radius } from "../../../design-system";

type AdminSearchInputProps = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  ariaLabel?: string;
  onChange: (value: string) => void;
};

export const AdminSearchInput: React.FC<AdminSearchInputProps> = ({
  value,
  placeholder,
  disabled = false,
  ariaLabel,
  onChange,
}) => {
  return (
    <input
      type="search"
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      disabled={disabled}
      style={{
        ...styles.input,
        ...(disabled ? styles.disabled : {}),
      }}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

const styles = {
  input: {
    width: "100%",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "11px 12px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box" as const,
  },

  disabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
