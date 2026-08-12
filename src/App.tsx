import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { QuickGuideBanner } from './components/QuickGuideBanner';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { GridView } from './components/GridView';
import { KanbanView } from './components/KanbanView';
import { AnalyticsView } from './components/AnalyticsView';
import { AddEditModal } from './components/AddEditModal';
import { ImportModal } from './components/ImportModal';
import { SetPasswordModal } from './components/SetPasswordModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { applicationService } from './services/applicationService';
import { useAuth } from './hooks/useAuth';
import { useApplications } from './hooks/useApplications';
import { useModals } from './hooks/useModals';
import type { Application, User } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MainTrackerApp: React.FC<{ user: User; onLogout: () => void; onRefreshUser: () => void }> = ({ user, onLogout, onRefreshUser }) => {
  const {
    currentView,
    setCurrentView,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedPlatform,
    setSelectedPlatform,
    selectedSort,
    setSelectedSort,
    applications,
    summary,
    analytics,
    isAppsLoading,
    isSummaryLoading,
    isAnalyticsLoading,
    refreshAllData,
    createMutation,
    updateMutation,
    deleteMutation,
    handleDelete,
    handleStatusChange,
    handleExport,
    handleDownloadSample,
  } = useApplications();

  const {
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
  } = useModals();

  const handleAddEditSubmit = (data: Partial<Application>) => {
    if (editingApp) {
      updateMutation.mutate(
        { id: editingApp.id, data },
        { onSuccess: closeAddEditModal }
      );
    } else {
      createMutation.mutate(data, { onSuccess: closeAddEditModal });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={openAddModal}
        onOpenImportModal={openImportModal}
        onExport={handleExport}
        user={user}
        onLogout={onLogout}
        onOpenSetPasswordModal={openSetPasswordModal}
        onOpenEditProfileModal={openEditProfileModal}
      />

      <main className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-6">
        
        <QuickGuideBanner />

        <SummaryCards summary={summary} loading={isSummaryLoading} />

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          onImportClick={openImportModal}
          onExportClick={handleExport}
        />

        {currentView === 'grid' && (
          <GridView
            applications={applications}
            loading={isAppsLoading}
            onEdit={openEditModal}
            onDelete={(id) => {
              const target = applications.find((a) => a.id === id);
              if (target) openDeleteModal(target);
            }}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentView === 'kanban' && (
          <KanbanView
            applications={applications}
            loading={isAppsLoading}
            onEdit={openEditModal}
            onDelete={(id) => {
              const target = applications.find((a) => a.id === id);
              if (target) openDeleteModal(target);
            }}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView analytics={analytics} loading={isAnalyticsLoading} />
        )}

      </main>

      <AddEditModal
        isOpen={isAddEditModalOpen}
        onClose={closeAddEditModal}
        onSubmit={handleAddEditSubmit}
        initialData={editingApp}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={closeImportModal}
        onImport={(file, duplicateAction) => applicationService.importApplications(file, duplicateAction)}
        onDownloadSample={handleDownloadSample}
        onSuccessRefresh={refreshAllData}
      />

      <SetPasswordModal
        isOpen={isSetPasswordModalOpen}
        user={user}
        onClose={closeSetPasswordModal}
        onSuccess={onRefreshUser}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        user={user}
        onClose={closeEditProfileModal}
        onSuccess={onRefreshUser}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingApp}
        application={deletingApp}
        loading={deleteMutation.isPending}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (deletingApp) {
            handleDelete(deletingApp.id, closeDeleteModal);
          }
        }}
      />

    </div>
  );
};

export default function App() {
  const {
    user,
    token,
    checkingAuth,
    authPage,
    setAuthPage,
    handleLoginSuccess,
    handleLogout,
    fetchUserProfile,
  } = useAuth();

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xs font-bold text-slate-500">Loading Job Tracker...</p>
      </div>
    );
  }

  if (!token || !user) {
    return authPage === 'login' ? (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthPage('register')}
      />
    ) : (
      <RegisterPage
        onRegisterSuccess={handleLoginSuccess}
        onNavigateToLogin={() => setAuthPage('login')}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MainTrackerApp user={user} onLogout={handleLogout} onRefreshUser={fetchUserProfile} />
    </QueryClientProvider>
  );
}
