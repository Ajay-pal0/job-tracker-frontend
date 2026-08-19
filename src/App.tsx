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
import { GmailModal } from './components/GmailModal';
import { EmailReviewModal } from './components/EmailReviewModal';
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
    isGmailModalOpen,
    isReviewModalOpen,
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
    openGmailModal,
    closeGmailModal,
    openReviewModal,
    closeReviewModal,
  } = useModals();

  const [pendingReviewCount, setPendingReviewCount] = React.useState(0);

  const fetchPendingCount = React.useCallback(() => {
    applicationService.getGmailMessages({ status: 'PENDING_REVIEW' })
      .then((res) => setPendingReviewCount(res.pending_review_count || 0))
      .catch(() => setPendingReviewCount(0));
  }, []);

  React.useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  const handleGlobalRefresh = React.useCallback(() => {
    refreshAllData();
    fetchPendingCount();
  }, [refreshAllData, fetchPendingCount]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const redirectUri = window.location.origin;
      applicationService.connectGmail({ code, redirect_uri: redirectUri })
        .then(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          openGmailModal();
          handleGlobalRefresh();
        })
        .catch((err) => {
          console.error('Failed to exchange Google OAuth code', err);
        });
    }
  }, [openGmailModal, handleGlobalRefresh]);

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
    <div className="min-h-screen md:h-screen w-full overflow-y-auto md:overflow-hidden bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col">
      
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
        onOpenGmailModal={openGmailModal}
        onOpenReviewModal={openReviewModal}
        pendingReviewCount={pendingReviewCount}
      />

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col min-h-0">
        
        {/* Top Controls */}
        <div className="shrink-0 space-y-3 mb-3">
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
        </div>

        {/* View Area (Desktop isolated item scroll / Mobile page content scroll under fixed header) */}
        <div className="flex-1 min-h-0 flex flex-col">
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
            <div className="flex-1 overflow-y-auto min-h-0">
              <AnalyticsView analytics={analytics} loading={isAnalyticsLoading} />
            </div>
          )}
        </div>

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

      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={closeGmailModal}
        onSuccessRefresh={handleGlobalRefresh}
      />

      <EmailReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        onSuccessRefresh={handleGlobalRefresh}
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
