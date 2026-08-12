import { useState, useCallback } from 'react';
import type { Application } from '../types';

export function useModals() {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSetPasswordModalOpen, setIsSetPasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const openAddModal = useCallback(() => {
    setEditingApp(null);
    setIsAddEditModalOpen(true);
  }, []);

  const openEditModal = useCallback((app: Application) => {
    setEditingApp(app);
    setIsAddEditModalOpen(true);
  }, []);

  const closeAddEditModal = useCallback(() => {
    setIsAddEditModalOpen(false);
    setEditingApp(null);
  }, []);

  const openDeleteModal = useCallback((app: Application) => {
    setDeletingApp(app);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingApp(null);
  }, []);

  const openImportModal = useCallback(() => setIsImportModalOpen(true), []);
  const closeImportModal = useCallback(() => setIsImportModalOpen(false), []);

  const openSetPasswordModal = useCallback(() => setIsSetPasswordModalOpen(true), []);
  const closeSetPasswordModal = useCallback(() => setIsSetPasswordModalOpen(false), []);

  const openEditProfileModal = useCallback(() => setIsEditProfileModalOpen(true), []);
  const closeEditProfileModal = useCallback(() => setIsEditProfileModalOpen(false), []);

  return {
    isAddEditModalOpen,
    editingApp,
    deletingApp,
    isImportModalOpen,
    isSetPasswordModalOpen,
    isEditProfileModalOpen,
    openAddModal,
    openEditModal,
    closeAddEditModal,
    openDeleteModal,
    closeDeleteModal,
    openImportModal,
    closeImportModal,
    openSetPasswordModal,
    closeSetPasswordModal,
    openEditProfileModal,
    closeEditProfileModal,
  };
}
