import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { CustomerProfile } from "../../auth/customerAuth.types";
import { CustomerProfileForm } from "./CustomerProfileForm";

type CustomerAccountSettingsProps = {
  profile: CustomerProfile;
  onProfileUpdated: (profile: CustomerProfile) => void;
  onUpdateProfile: (values: {
    fullName: string;
    companyName: string;
    phone: string;
  }) => Promise<CustomerProfile>;
};

export const CustomerAccountSettings: React.FC<
  CustomerAccountSettingsProps
> = ({ profile, onProfileUpdated, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateProfile = async (values: {
    fullName: string;
    companyName: string;
    phone: string;
  }) => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatedProfile = await onUpdateProfile(values);

      onProfileUpdated(updatedProfile);

      setSuccessMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Could not update profile:", error);

      setError(
        error instanceof Error ? error.message : "Could not update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.badge}>Account Settings</p>

          <h2 style={styles.title}>Your Profile</h2>

          <p style={styles.subtitle}>
            Manage your customer account information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            style={styles.button}
            onClick={() => {
              setError("");
              setSuccessMessage("");
              setIsEditing(true);
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {!isEditing ? (
        <div style={styles.details}>
          <div style={styles.item}>
            <span style={styles.label}>Name</span>

            <span style={styles.value}>
              {profile.fullName || "Not provided"}
            </span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Email</span>

            <span style={styles.value}>{profile.email}</span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Company</span>

            <span style={styles.value}>
              {profile.companyName || "Not provided"}
            </span>
          </div>

          <div style={styles.item}>
            <span style={styles.label}>Phone</span>

            <span style={styles.value}>{profile.phone || "Not provided"}</span>
          </div>
        </div>
      ) : (
        <CustomerProfileForm
          profile={profile}
          isSaving={isSaving}
          error={error}
          successMessage={successMessage}
          onSubmit={handleUpdateProfile}
        />
      )}
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    marginBottom: spacing.lg,
    flexWrap: "wrap",
  },

  badge: {
    color: colors.accent.green,
    fontSize: "11px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: 0,
  },

  title: {
    color: colors.text.main,
    fontSize: "24px",
    margin: `${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: 0,
  },

  button: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: typography.fontWeight.black,
  },

  details: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: spacing.lg,
  },

  item: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  label: {
    display: "block",
    color: colors.text.muted,
    fontSize: "11px",
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },

  value: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
  },

  success: {
    borderRadius: radius.md,
    border: `1px solid ${colors.accent.green}`,
    backgroundColor: "rgba(116,245,66,0.08)",
    color: colors.accent.green,
    padding: spacing.md,
    marginBottom: spacing.lg,
    fontSize: "13px",
  },
};
