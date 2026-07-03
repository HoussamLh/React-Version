import React from "react";
import { colors, spacing } from "../../../design-system";
import { ContactForm, ContactInfoItem } from "../components";

export const ContactFormSection: React.FC = () => {
  return (
    <section style={styles.container} className="ds-section">
      <div style={styles.grid} className="ds-grid ds-grid-2">
        <ContactInfoItem />

        <div style={styles.formWrapper}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
  },

  grid: {
    alignItems: "stretch",
    gap: spacing.lg,
  },

  formWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
};
