import React, { useState } from 'react';
import { Lock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import type { User } from '../types';

interface SetPasswordModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  useLockBodyScroll(isOpen);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasPassword = user?.has_password !== false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await applicationService.setPassword({
        old_password: hasPassword ? oldPassword : undefined,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(hasPassword ? 'Password updated successfully!' : 'Password created successfully!');
      setTimeout(() => {
        setSuccess(null);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.old_password?.[0] ||
        err?.response?.data?.confirm_password?.[0] ||
        err?.response?.data?.error ||
        'Failed to set password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {hasPassword ? 'Change Password' : 'Set Account Password'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!hasPassword && (
          <p className="text-xs text-slate-500">
            You signed in using Google. Set a password if you would also like to sign in with email/password in the future.
          </p>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {hasPassword && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

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
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : hasPassword ? 'Update Password' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
