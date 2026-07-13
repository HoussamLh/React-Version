import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { AdminTeamMemberForm } from "./AdminTeamMemberForm";
import {
  createAdminTeamMember,
  deleteAdminTeamMember,
  getAdminTeamMembers,
  updateAdminTeamMember,
} from "./teamCms.service";
import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "./teamCms.types";

type TeamFilter = "all" | "published" | "draft";

const accentColorMap: Record<AdminTeamMember["hoverAccent"], string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
};

export const AdminTeamPage: React.FC = () => {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [statusFilter, setStatusFilter] = useState<TeamFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminTeamMember | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);
  const [isDeletingMemberId, setIsDeletingMemberId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await getAdminTeamMembers();
      setMembers(results);
    } catch (error) {
      console.error("Could not load team members:", error);
      setError("Could not load team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return;
      void loadMembers();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;

      const matchesSearch =
        !normalizedSearchQuery ||
        member.name.toLowerCase().includes(normalizedSearchQuery) ||
        member.role.toLowerCase().includes(normalizedSearchQuery) ||
        member.description.toLowerCase().includes(normalizedSearchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [members, searchQuery, statusFilter]);

  const openCreateForm = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setEditingMember(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (member: AdminTeamMember) => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setIsCreateFormOpen(false);
    setEditingMember(member);
  };

  const handleCreateMember = async (values: AdminTeamMemberFormValues) => {
    setIsCreatingMember(true);
    setCreateError(null);

    try {
      await createAdminTeamMember(values);
      setIsCreateFormOpen(false);
      await loadMembers();
    } catch (error) {
      console.error("Could not create team member:", error);
      setCreateError("Could not create team member. Please try again.");
    } finally {
      setIsCreatingMember(false);
    }
  };

  const handleUpdateMember = async (values: AdminTeamMemberFormValues) => {
    if (!editingMember) return;

    setIsUpdatingMember(true);
    setUpdateError(null);

    try {
      await updateAdminTeamMember({
        memberId: editingMember.id,
        values,
      });

      setEditingMember(null);
      await loadMembers();
    } catch (error) {
      console.error("Could not update team member:", error);
      setUpdateError("Could not update team member. Please try again.");
    } finally {
      setIsUpdatingMember(false);
    }
  };

  const handleDeleteMember = async (member: AdminTeamMember) => {
    const isConfirmed = window.confirm(
      `Delete "${member.name}"? This cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeletingMemberId(member.id);
    setDeleteError(null);

    try {
      await deleteAdminTeamMember(member.id);

      if (editingMember?.id === member.id) {
        setEditingMember(null);
      }

      await loadMembers();
    } catch (error) {
      console.error("Could not delete team member:", error);
      setDeleteError("Could not delete team member. Please try again.");
    } finally {
      setIsDeletingMemberId(null);
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow} className="mono-text">
            Team CMS
          </p>

          <h1 style={styles.title}>Manage Technical Team</h1>

          <p style={styles.subtitle}>
            Add, edit, publish, and reorder team members shown on the About
            page.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => void loadMembers()}
          >
            Refresh
          </button>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={openCreateForm}
          >
            {isCreateFormOpen ? "Close Form" : "New Team Member"}
          </button>
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.panel}>
        {isCreateFormOpen && (
          <div style={styles.formPanel}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create Team Member</h2>
              <p style={styles.formText}>
                Add a new person to the About page technical team.
              </p>
            </div>

            <AdminTeamMemberForm
              submitLabel="Create Member"
              isSubmitting={isCreatingMember}
              error={createError}
              onCancel={() => setIsCreateFormOpen(false)}
              onSubmit={handleCreateMember}
            />
          </div>
        )}

        {editingMember && (
          <div style={styles.formPanel}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Edit Team Member</h2>
              <p style={styles.formText}>
                Update this member profile and public visibility.
              </p>
            </div>

            <AdminTeamMemberForm
              initialMember={editingMember}
              submitLabel="Save Changes"
              isSubmitting={isUpdatingMember}
              error={updateError}
              onCancel={() => setEditingMember(null)}
              onSubmit={handleUpdateMember}
            />
          </div>
        )}

        {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search team members..."
          />

          <div style={styles.filters}>
            {(["all", "published", "draft"] as TeamFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                style={{
                  ...styles.filterButton,
                  ...(statusFilter === filter ? styles.filterButtonActive : {}),
                }}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div style={styles.loadingBox}>Loading team members...</div>
        )}

        {!isLoading && filteredMembers.length === 0 && (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>No team members found</h2>
            <p style={styles.emptyText}>
              Create your first team member or adjust your filters.
            </p>
          </div>
        )}

        {!isLoading && filteredMembers.length > 0 && (
          <div style={styles.grid}>
            {filteredMembers.map((member) => {
              const accentColor = accentColorMap[member.hoverAccent];

              return (
                <article key={member.id} style={styles.card}>
                  <div style={styles.imageWrapper}>
                    <img
                      src={member.imageUrl}
                      alt={member.imageAlt}
                      style={styles.image}
                    />
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.cardTop}>
                      <div>
                        <p
                          style={{
                            ...styles.role,
                            color: accentColor,
                          }}
                          className="mono-text"
                        >
                          {member.role}
                        </p>

                        <h2 style={styles.memberName}>{member.name}</h2>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(member.status === "published"
                            ? styles.statusPublished
                            : styles.statusDraft),
                        }}
                      >
                        {member.status}
                      </span>
                    </div>

                    <p style={styles.description}>{member.description}</p>

                    <div style={styles.metaList}>
                      <span style={styles.metaItem}>
                        Accent: {member.hoverAccent}
                      </span>
                      <span style={styles.metaItem}>
                        Order: {member.sortOrder}
                      </span>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        type="button"
                        style={styles.editButton}
                        onClick={() => openEditForm(member)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        style={{
                          ...styles.deleteButton,
                          ...(isDeletingMemberId === member.id
                            ? styles.disabledButton
                            : {}),
                        }}
                        disabled={isDeletingMemberId === member.id}
                        onClick={() => void handleDeleteMember(member)}
                      >
                        {isDeletingMemberId === member.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xl,
  },

  header: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
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

  title: {
    color: colors.text.main,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
    maxWidth: "720px",
  },

  headerActions: {
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap",
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

  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  formPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  formHeader: {
    marginBottom: spacing.lg,
  },

  formTitle: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  formText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.xs} 0 0 0`,
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "240px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    outline: "none",
  },

  filters: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },

  filterButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.muted,
    padding: `${spacing.xs} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  filterButtonActive: {
    backgroundColor: colors.accent.green,
    borderColor: colors.accent.green,
    color: colors.background.dark,
  },

  loadingBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.dark,
    color: colors.text.muted,
    padding: spacing.lg,
    fontSize: "14px",
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
  },

  emptyState: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: spacing.xl,
    textAlign: "center",
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
  },

  card: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    overflow: "hidden",
  },

  imageWrapper: {
    width: "100%",
    height: "220px",
    backgroundColor: colors.background.dark,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  cardContent: {
    padding: spacing.lg,
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    alignItems: "flex-start",
  },

  role: {
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: `0 0 ${spacing.xs} 0`,
  },

  memberName: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  statusBadge: {
    borderRadius: radius.pill,
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: "11px",
    lineHeight: 1,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    fontWeight: typography.fontWeight.black,
  },

  statusPublished: {
    backgroundColor: "rgba(116, 245, 66, 0.12)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
  },

  statusDraft: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${colors.border.default}`,
    color: colors.text.muted,
  },

  description: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.md} 0`,
  },

  metaList: {
    display: "flex",
    gap: spacing.xs,
    flexWrap: "wrap",
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: `${spacing.xs} ${spacing.sm}`,
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  editButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  deleteButton: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
