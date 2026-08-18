import { useState } from "react";

type CrudEntity = { id: string };

type UseAdminPricingCrudPanelOptions<T extends CrudEntity, V> = {
  onRefresh: () => Promise<void>;
  create: (values: V) => Promise<unknown>;
  update: (args: { itemId: string; values: V }) => Promise<unknown>;
  remove: (itemId: string) => Promise<unknown>;
  deleteLabel: (item: T) => string;
  createErrorMessage: string;
  updateErrorMessage: string;
  deleteErrorMessage: string;
  createLogMessage: string;
  updateLogMessage: string;
  deleteLogMessage: string;
};

export const useAdminPricingCrudPanel = <T extends CrudEntity, V>({
  onRefresh, create, update, remove, deleteLabel,
  createErrorMessage, updateErrorMessage, deleteErrorMessage,
  createLogMessage, updateLogMessage, deleteLogMessage,
}: UseAdminPricingCrudPanelOptions<T, V>) => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const clearErrors = () => {
    setCreateError(null); setUpdateError(null); setDeleteError(null);
  };

  const openCreateForm = () => {
    clearErrors(); setEditingItem(null);
    setIsCreateFormOpen((currentValue) => !currentValue);
  };

  const openEditForm = (item: T) => {
    clearErrors(); setIsCreateFormOpen(false); setEditingItem(item);
  };

  const handleCreate = async (values: V) => {
    setIsCreating(true); setCreateError(null);
    try {
      await create(values);
      setIsCreateFormOpen(false);
      await onRefresh();
    } catch (error) {
      console.error(createLogMessage, error);
      setCreateError(createErrorMessage);
    } finally { setIsCreating(false); }
  };

  const handleUpdate = async (values: V) => {
    if (!editingItem) return;
    setIsUpdating(true); setUpdateError(null);
    try {
      await update({ itemId: editingItem.id, values });
      setEditingItem(null);
      await onRefresh();
    } catch (error) {
      console.error(updateLogMessage, error);
      setUpdateError(updateErrorMessage);
    } finally { setIsUpdating(false); }
  };

  const handleDelete = async (item: T) => {
    const isConfirmed = window.confirm(`Delete "${deleteLabel(item)}"? This cannot be undone.`);
    if (!isConfirmed) return;
    setIsDeletingId(item.id); setDeleteError(null);
    try {
      await remove(item.id);
      if (editingItem?.id === item.id) setEditingItem(null);
      await onRefresh();
    } catch (error) {
      console.error(deleteLogMessage, error);
      setDeleteError(deleteErrorMessage);
    } finally { setIsDeletingId(null); }
  };

  return {
    isCreateFormOpen, editingItem, isCreating, isUpdating, isDeletingId,
    createError, updateError, deleteError, openCreateForm, openEditForm,
    setIsCreateFormOpen, setEditingItem, handleCreate, handleUpdate, handleDelete,
  };
};
