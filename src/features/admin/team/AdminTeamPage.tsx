import React from "react";

import { colors, radius, spacing } from "../../../design-system";
import { AdminTeamMemberForm } from "./AdminTeamMemberForm";
import { AdminTeamFormPanel } from "./components/AdminTeamFormPanel";
import { AdminTeamHeader } from "./components/AdminTeamHeader";
import { AdminTeamMemberCard } from "./components/AdminTeamMemberCard";
import { AdminTeamState } from "./components/AdminTeamState";
import { AdminTeamToolbar } from "./components/AdminTeamToolbar";
import { useAdminTeam } from "./hooks/useAdminTeam";

export const AdminTeamPage: React.FC = () => {
  const {
    filteredMembers,

    statusFilter,
    searchQuery,
    isCreateFormOpen,
    editingMember,

    isLoading,
    isCreatingMember,
    isUpdatingMember,
    isDeletingMemberId,

    error,
    createError,
    updateError,
    deleteError,

    setStatusFilter,
    setSearchQuery,

    loadMembers,
    handleCreateMember,
    handleUpdateMember,
    handleDeleteMember,

    openCreateForm,
    openEditForm,
    closeCreateForm,
    closeEditForm,
  } = useAdminTeam();

  return (
    <section style={styles.page}>
      <AdminTeamHeader
        isCreateFormOpen={isCreateFormOpen}
        isLoading={isLoading}
        onCreateToggle={openCreateForm}
        onRefresh={loadMembers}
      />

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.panel}>
        {isCreateFormOpen && (
          <AdminTeamFormPanel
            title="Create Team Member"
            description="Add a new person to the About page technical team."
            error={createError}
          >
            <AdminTeamMemberForm
              key="create-team-member"
              submitLabel="Create Member"
              isSubmitting={isCreatingMember}
              onCancel={closeCreateForm}
              onSubmit={handleCreateMember}
            />
          </AdminTeamFormPanel>
        )}

        {editingMember && (
          <AdminTeamFormPanel
            title="Edit Team Member"
            description="Update this member profile and public visibility."
            error={updateError}
          >
            <AdminTeamMemberForm
              key={editingMember.id}
              initialMember={editingMember}
              submitLabel="Save Changes"
              isSubmitting={isUpdatingMember}
              onCancel={closeEditForm}
              onSubmit={handleUpdateMember}
            />
          </AdminTeamFormPanel>
        )}

        {deleteError && <div style={styles.errorBox}>{deleteError}</div>}

        <AdminTeamToolbar
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
        />

        <AdminTeamState
          isLoading={isLoading}
          hasMembers={filteredMembers.length > 0}
        />

        {!isLoading && filteredMembers.length > 0 && (
          <div style={styles.grid}>
            {filteredMembers.map((member) => (
              <AdminTeamMemberCard
                key={member.id}
                member={member}
                isDeleting={isDeletingMemberId === member.id}
                onEdit={openEditForm}
                onDelete={(selectedMember) => {
                  void handleDeleteMember(selectedMember);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xl,
  },

  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
    marginBottom: spacing.lg,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
  },
};
