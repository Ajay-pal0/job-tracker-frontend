import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';
import type { Application, ApplicationStatus } from '../types';

export function useApplications() {
  const [currentView, setCurrentView] = useState<'grid' | 'kanban' | 'analytics'>('grid');
  
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSort, setSelectedSort] = useState('applied_date_asc');

  // Queries
  const { data: applications = [], isLoading: isAppsLoading, refetch: refetchApps } = useQuery({
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

  const refreshAllData = useCallback(() => {
    refetchApps();
    refetchSummary();
    refetchAnalytics();
  }, [refetchApps, refetchSummary, refetchAnalytics]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<Application>) => applicationService.createApplication(data),
    onSuccess: () => {
      refreshAllData();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Application> }) =>
      applicationService.updateApplication(id, data),
    onSuccess: () => {
      refreshAllData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => applicationService.deleteApplication(id),
    onSuccess: () => {
      refreshAllData();
    },
  });

  const handleDelete = useCallback((id: number, onSuccess?: () => void) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  }, [deleteMutation]);

  const handleStatusChange = useCallback((id: number, newStatus: ApplicationStatus) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  }, [updateMutation]);

  const handleExport = useCallback(() => {
    applicationService.exportApplications();
  }, []);

  const handleDownloadSample = useCallback(() => {
    applicationService.downloadSampleTemplate();
  }, []);

  return {
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
  };
}
