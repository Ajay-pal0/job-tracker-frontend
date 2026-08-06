import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { Header } from './components/Header';
import { QuickGuideBanner } from './components/QuickGuideBanner';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { GridView } from './components/GridView';
import { KanbanView } from './components/KanbanView';
import { AnalyticsView } from './components/AnalyticsView';
import { AddEditModal } from './components/AddEditModal';
import { ImportModal } from './components/ImportModal';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { applicationService } from './services/applicationService';
import type { Application, ApplicationStatus, User } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MainTrackerApp: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<'grid' | 'kanban' | 'analytics'>('grid');
  
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSort, setSelectedSort] = useState('applied_date_asc');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data: applications = [], refetch: refetchApps } = useQuery({
    queryKey: ['applications', selectedStatus, selectedPlatform, search, selectedSort],
    queryFn: () => applicationService.getApplications({
      status: selectedStatus,
      platform: selectedPlatform,
      search,
      ordering: selectedSort,
    }),
  });

  const { data: summary = null, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => applicationService.getDashboardSummary(),
  });

  const { data: analytics = null, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: () => applicationService.getAnalyticsData(),
  });

  const refreshAllData = () => {
    refetchApps();
    refetchSummary();
    refetchAnalytics();
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<Application>) => applicationService.createApplication(data),
    onSuccess: () => {
      refreshAllData();
      setIsAddEditModalOpen(false);
      setEditingApp(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Application> }) =>
      applicationService.updateApplication(id, data),
    onSuccess: () => {
      refreshAllData();
      setIsAddEditModalOpen(false);
      setEditingApp(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => applicationService.deleteApplication(id),
    onSuccess: () => {
      refreshAllData();
    },
  });

  const handleOpenAdd = () => {
    setEditingApp(null);
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setIsAddEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this job application record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: number, newStatus: ApplicationStatus) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const handleAddEditSubmit = (data: Partial<Application>) => {
    if (editingApp) {
      updateMutation.mutate({ id: editingApp.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleExport = () => {
    applicationService.exportApplications();
  };

  const handleDownloadSample = () => {
    applicationService.downloadSampleTemplate();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={handleOpenAdd}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExport={handleExport}
        user={user}
        onLogout={onLogout}
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
          onImportClick={() => setIsImportModalOpen(true)}
          onExportClick={handleExport}
        />

        {currentView === 'grid' && (
          <GridView
            applications={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentView === 'kanban' && (
          <KanbanView
            applications={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView analytics={analytics} loading={isAnalyticsLoading} />
        )}

      </main>

      <AddEditModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSubmit={handleAddEditSubmit}
        initialData={editingApp}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(file, duplicateAction) => applicationService.importApplications(file, duplicateAction)}
        onDownloadSample={handleDownloadSample}
        onSuccessRefresh={refreshAllData}
      />

    </div>
  );
};

export default function App() {
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const profile = await applicationService.getProfile();
          setUser(profile);
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setToken(null);
          setUser(null);
        }
      }
      setCheckingAuth(false);
    };
    initAuth();
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

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
      <MainTrackerApp user={user} onLogout={handleLogout} />
    </QueryClientProvider>
  );
}
