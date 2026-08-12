import api from './api';
import type {
  Application,
  DashboardSummary,
  AnalyticsData,
  ImportResult,
  User,
} from '../types';

export interface ApplicationFilterParams {
  status?: string;
  platform?: string;
  search?: string;
  ordering?: string;
}

export const applicationService = {
  // Applications CRUD
  async getApplications(params?: ApplicationFilterParams): Promise<Application[]> {
    const response = await api.get('/applications/', { params });
    return response.data;
  },

  async createApplication(data: Partial<Application>): Promise<Application> {
    const response = await api.post('/applications/', data);
    return response.data;
  },

  async updateApplication(id: number, data: Partial<Application>): Promise<Application> {
    const response = await api.patch(`/applications/${id}/`, data);
    return response.data;
  },

  async deleteApplication(id: number): Promise<void> {
    await api.delete(`/applications/${id}/`);
  },

  // Import / Export & Sample Template
  async importApplications(file: File, duplicateAction: 'skip' | 'update'): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('duplicate_action', duplicateAction);

    const response = await api.post('/applications/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async exportApplications(): Promise<void> {
    const response = await api.get('/applications/export/', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'job_applications.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async downloadSampleTemplate(): Promise<void> {
    const response = await api.get('/applications/sample-template/', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_applications.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Metrics
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get('/dashboard/');
    return response.data;
  },

  async getAnalyticsData(): Promise<AnalyticsData> {
    const response = await api.get('/analytics/');
    return response.data;
  },

  // Auth
  async login(credentials: { username?: string; password?: string }) {
    const response = await api.post('/accounts/login/', credentials);
    return response.data;
  },

  async register(data: Record<string, string>) {
    const response = await api.post('/accounts/register/', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch('/accounts/profile/', data);
    return response.data;
  },

  async ssoLogin(provider: string, token: string) {
    const response = await api.post(`/accounts/sso/${provider}/`, { token });
    return response.data;
  },

  async googleLogin(idToken: string) {
    const response = await api.post('/accounts/google/', { id_token: idToken });
    return response.data;
  },

  async setPassword(data: { old_password?: string; new_password: string; confirm_password: string }) {
    const response = await api.post('/accounts/set-password/', data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/accounts/forgot-password/', { email });
    return response.data;
  },

  async resetPassword(data: { uidb64: string; token: string; new_password: string; confirm_password: string }) {
    const response = await api.post('/accounts/reset-password/', data);
    return response.data;
  },
};

