import React, { useState } from 'react';
import { Briefcase, Lock, AlertCircle, Eye, EyeOff, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { applicationService } from '../services/applicationService';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (token: string, user: User) => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);
  const [resetUid, setResetUid] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.login({ username, password });
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);

      const userProfile = await applicationService.getProfile();
      onLoginSuccess(res.access, userProfile);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        'Invalid credentials. Please check email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setError('Google authentication failed: missing token.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.googleLogin(credentialResponse.credential);
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);

      const userProfile = await applicationService.getProfile();
      onLoginSuccess(res.access, userProfile);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotLoading(true);
    setForgotError(null);
    try {
      const res = await applicationService.forgotPassword(forgotEmail);
      setForgotSuccessMessage(res.message);
      if (res.uidb64 && res.token) {
        setResetUid(res.uidb64);
        setResetToken(res.token);
      }
    } catch (err: any) {
      setForgotError(err?.response?.data?.error || 'Failed to request password reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUid || !resetToken || !newPassword || !confirmPassword) return;

    setForgotLoading(true);
    setForgotError(null);
    try {
      await applicationService.resetPassword({
        uidb64: resetUid,
        token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setForgotSuccessMessage('Password reset successfully! You can now log in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccessMessage(null);
        setResetUid(null);
        setResetToken(null);
      }, 2000);
    } catch (err: any) {
      setForgotError(err?.response?.data?.error || err?.response?.data?.confirm_password?.[0] || 'Password reset failed.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'dummy-google-client-id.apps.googleusercontent.com'}>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200/80 shadow-xl space-y-6">

          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sign in to access your Job Application Tracker
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username & Password Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50 text-xs"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider: Or Continue With Google */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
              Or Continue With
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Google SSO Button below Username & Password Login */}
          <div className="flex justify-center">
            {loading ? (
              <div className="w-full py-2.5 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center space-x-2 text-slate-600 text-xs font-medium animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Connecting Google...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                shape="pill"
                theme="outline"
                size="large"
                width="340"
                text="continue_with"
              />
            )}
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Create an Account
            </button>
          </div>

        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Reset Password</h3>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {forgotError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{forgotSuccessMessage}</span>
                </div>
              )}

              {!resetToken ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <p className="text-slate-500">
                    Enter your email address and we'll generate password reset instructions.
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? 'Processing...' : 'Request Reset Token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? 'Resetting Password...' : 'Confirm Reset Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </GoogleOAuthProvider>
  );
};


