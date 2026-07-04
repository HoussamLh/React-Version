import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { contactServiceOptions } from "../data/contactForm.data";

type ContactServiceSelectProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const ContactServiceSelect: React.FC<ContactServiceSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div style={styles.field}>
      <label style={styles.label}>Service</label>

      <select style={styles.select} value={value} onChange={onChange} required>
        <option value="" disabled>
          Select a service
        </option>

        {contactServiceOptions.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
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
};
