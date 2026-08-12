import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '../services/applicationService';
import type { User } from '../types';

export function useAuth() {
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [checkingAuth, setCheckingAuth] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await applicationService.getProfile();
      setUser(profile);
    } catch (e) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        await fetchUserProfile();
      }
      setCheckingAuth(false);
    };
    initAuth();
  }, [fetchUserProfile]);

  const handleLoginSuccess = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    token,
    checkingAuth,
    authPage,
    setAuthPage,
    handleLoginSuccess,
    handleLogout,
    fetchUserProfile,
  };
}
