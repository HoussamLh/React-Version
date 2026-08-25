import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createAdminTeamMember,
  deleteAdminTeamMember,
  getAdminTeamMembers,
  updateAdminTeamMember,
} from "../services/teamCms.service";
import {
  filterTeamMembers,
  type TeamFilter,
} from "../helpers/teamCms.helpers";
import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "../types/teamCms.types";

export const useAdminTeam = () => {
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

  const filteredMembers = useMemo(
    () =>
      filterTeamMembers({
        members,
        statusFilter,
        searchQuery,
      }),
    [members, searchQuery, statusFilter],
  );

  const clearFormErrors = () => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
  };

  const openCreateForm = () => {
    clearFormErrors();
    setEditingMember(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const closeCreateForm = () => {
    setCreateError(null);
    setIsCreateFormOpen(false);
  };

  const openEditForm = (member: AdminTeamMember) => {
    clearFormErrors();
    setIsCreateFormOpen(false);
    setEditingMember(member);
  };

  const closeEditForm = () => {
    setUpdateError(null);
    setEditingMember(null);
  };

  const handleCreateMember = async (
    values: AdminTeamMemberFormValues,
    memberId: string,
  ) => {
    setIsCreatingMember(true);
    setCreateError(null);

    try {
      await createAdminTeamMember(values, memberId);
      setIsCreateFormOpen(false);
    } catch (error) {
      console.error("Could not create team member:", error);
      setCreateError("Could not create team member. Please try again.");
      throw error;
    } finally {
      setIsCreatingMember(false);
    }

    try {
      await loadMembers();
    } catch (error) {
      console.error("Could not refresh team members:", error);
      setError("Team member was saved, but the list could not be refreshed.");
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
    } catch (error) {
      console.error("Could not update team member:", error);
      setUpdateError("Could not update team member. Please try again.");
      throw error;
    } finally {
      setIsUpdatingMember(false);
    }

    try {
      await loadMembers();
    } catch (error) {
      console.error("Could not refresh team members:", error);
      setError("Team member was saved, but the list could not be refreshed.");
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

  return {
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
  };
};
