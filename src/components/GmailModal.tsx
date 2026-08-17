import React, { useState, useEffect } from 'react';
import { X, Mail, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Unplug, KeyRound } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import type { GmailStatusResponse, GmailSyncResponse } from '../types';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRefresh: () => void;
}

export const GmailModal: React.FC<GmailModalProps> = ({
  isOpen,
  onClose,
  onSuccessRefresh,
}) => {
  useLockBodyScroll(isOpen);

  const [statusLoading, setStatusLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [authUrlLoading, setAuthUrlLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  const [gmailStatus, setGmailStatus] = useState<GmailStatusResponse | null>(null);
  const [syncResult, setSyncResult] = useState<GmailSyncResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showManualInput, setShowManualInput] = useState(false);
  const [accessTokenInput, setAccessTokenInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setSyncResult(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Poll status while background sync is active
  useEffect(() => {
    let intervalId: any;
    if (isOpen && gmailStatus?.sync_status === 'IN_PROGRESS') {
      intervalId = setInterval(async () => {
        try {
          const res = await applicationService.getGmailStatus();
          setGmailStatus(res);
          if (res.sync_status !== 'IN_PROGRESS') {
            onSuccessRefresh();
            if (intervalId) clearInterval(intervalId);
          }
        } catch {
          // Ignore transient polling errors
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, gmailStatus?.sync_status, onSuccessRefresh]);

  const fetchStatus = async () => {
    setStatusLoading(true);
    setErrorMsg(null);
    try {
      const res = await applicationService.getGmailStatus();
      setGmailStatus(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to fetch Gmail integration status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleConnectOAuth = async () => {
    setAuthUrlLoading(true);
    setErrorMsg(null);
    try {
      const redirectUri = window.location.origin;
      const res = await applicationService.getGmailAuthUrl(redirectUri);
      if (res.auth_url) {
        window.location.href = res.auth_url;
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to generate Google OAuth URL.');
    } finally {
      setAuthUrlLoading(false);
    }
  };

  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessTokenInput.trim()) {
      setErrorMsg('Access token is required.');
      return;
    }
    setConnectLoading(true);
    setErrorMsg(null);
    try {
      const res = await applicationService.connectGmail({
        access_token: accessTokenInput.trim(),
        email_address: emailInput.trim(),
      });
      setGmailStatus(res);
      setShowManualInput(false);
      setAccessTokenInput('');
      setEmailInput('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to connect Gmail credential.');
    } finally {
      setConnectLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncLoading(true);
    setErrorMsg(null);
    setSyncResult(null);
    try {
      const res = await applicationService.syncGmail();
      setSyncResult(res);
      onSuccessRefresh();
      fetchStatus();

      // Auto-close modal after 2.5 seconds to give smooth feedback
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Failed to sync Gmail applications.');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Gmail integration?')) return;
    setStatusLoading(true);
    setErrorMsg(null);
    try {
      const res = await applicationService.disconnectGmail();
      setGmailStatus(res);
      setSyncResult(null);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to disconnect Gmail.');
    } finally {
      setStatusLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-[#E2E8F0] shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-50 text-[#4F46E5] rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A]">Gmail Integration</h3>
              <p className="text-xs text-[#64748B]">Automatically extract job application emails</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#334155] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 flex items-center space-x-2 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-3 text-[#BE123C] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Active Sync Task Running Banner */}
        {gmailStatus?.sync_status === 'IN_PROGRESS' && !syncResult && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-900 space-y-1.5 animate-pulse duration-1000">
            <div className="flex items-center space-x-2 font-bold text-xs text-amber-800">
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Sync Task Currently Running</span>
            </div>
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              A background Gmail sync is actively scanning your inbox for job application emails. Additional manual syncs are disabled until this run completes.
            </p>
          </div>
        )}

        {/* Connection Status Card */}
        <div className="space-y-4">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</span>
              {statusLoading ? (
                <RefreshCw className="w-3.5 h-3.5 text-[#4F46E5] animate-spin" />
              ) : gmailStatus?.connected ? (
                gmailStatus?.sync_status === 'IN_PROGRESS' ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-bold animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Sync In Progress...</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#10B981] text-white rounded-md text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Connected</span>
                  </span>
                )
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-slate-200 text-[#334155] rounded-md text-[10px] font-bold">
                  <span>Not Connected</span>
                </span>
              )}
            </div>

            {gmailStatus?.connected ? (
              <div className="space-y-1 pt-1">
                <p className="text-xs font-bold text-[#0F172A]">{gmailStatus.email_address || 'Connected Account'}</p>
                <p className="text-[11px] text-[#64748B]">
                  Last Synced: {gmailStatus.last_synced_at ? new Date(gmailStatus.last_synced_at).toLocaleString() : 'Never'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#64748B] leading-relaxed">
                Connect your Gmail account to automatically import application receipts, interview invitations, and status updates directly into your tracking dashboard.
              </p>
            )}
          </div>

          {/* Connected State Actions */}
          {gmailStatus?.connected ? (
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={handleSync}
                disabled={syncLoading || gmailStatus?.sync_status === 'IN_PROGRESS'}
                className="w-full sm:flex-1 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncLoading || gmailStatus?.sync_status === 'IN_PROGRESS' ? 'animate-spin' : ''}`} />
                <span>
                  {syncLoading
                    ? 'Initiating Sync...'
                    : gmailStatus?.sync_status === 'IN_PROGRESS'
                    ? 'Sync Currently Running...'
                    : 'Sync Applications Now'}
                </span>
              </button>

              <button
                onClick={handleDisconnect}
                disabled={statusLoading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#BE123C] hover:bg-rose-50 border border-[#FECDD3] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Unplug className="w-3.5 h-3.5 text-[#BE123C]" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            /* Disconnected State Actions */
            <div className="space-y-3 pt-1">
              <button
                onClick={handleConnectOAuth}
                disabled={authUrlLoading}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{authUrlLoading ? 'Opening Google Auth...' : 'Connect Gmail with Google OAuth'}</span>
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center space-x-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showManualInput ? 'Hide Manual Token Input' : 'Enter Access Token Manually'}</span>
                </button>
              </div>

              {/* Manual Token Input Form */}
              {showManualInput && (
                <form onSubmit={handleManualConnect} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#0F172A] uppercase">Google Access Token</label>
                    <input
                      type="text"
                      value={accessTokenInput}
                      onChange={(e) => setAccessTokenInput(e.target.value)}
                      placeholder="ya29.a0A..."
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#334155] font-mono focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#0F172A] uppercase">Gmail Email Address (Optional)</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={connectLoading}
                    className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    {connectLoading ? 'Saving Token...' : 'Save & Connect Token'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Sync Results Summary */}
          {syncResult && (
            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-4 text-[#3730A3] space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center space-x-2 font-bold text-xs text-[#4338CA]">
                <CheckCircle2 className="w-4 h-4 text-[#6366F1]" />
                <span>{syncResult.status === 'STARTED' ? 'Background Sync Started' : 'Sync Summary'}</span>
              </div>

              <p className="text-xs text-[#3730A3] font-medium leading-relaxed">
                {syncResult.message || 'Gmail sync process started in the background. New job emails will appear in your review queue shortly.'}
              </p>

              {syncResult.details && (syncResult.details.scanned_emails_count || 0) > 0 && (
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold pt-1">
                  <div className="bg-white/80 p-2 rounded-lg border border-[#C7D2FE]">
                    <span className="block text-sm font-extrabold text-[#0F172A]">{syncResult.details.scanned_emails_count || 0}</span>
                    <span className="text-[10px] text-[#64748B] uppercase">Scanned</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-[#C7D2FE]">
                    <span className="block text-sm font-extrabold text-[#047857]">{syncResult.details.created_count || 0}</span>
                    <span className="text-[10px] text-[#047857] uppercase">Created</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-[#C7D2FE]">
                    <span className="block text-sm font-extrabold text-[#4F46E5]">{syncResult.details.updated_count || 0}</span>
                    <span className="text-[10px] text-[#4F46E5] uppercase">Updated</span>
                  </div>
                </div>
              )}

              {syncResult.details?.processed_applications && syncResult.details.processed_applications.length > 0 && (
                <div className="pt-1 space-y-1">
                  <span className="text-[11px] font-bold text-[#0F172A] block">Extracted Applications:</span>
                  <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
                    {syncResult.details.processed_applications.map((app, idx) => (
                      <div key={idx} className="bg-white px-3 py-1.5 rounded-md border border-[#C7D2FE] flex items-center justify-between">
                        <span className="font-bold text-[#0F172A]">{app.company_name}</span>
                        <span className="text-[#64748B] truncate max-w-[130px]">{app.job_title}</span>
                        <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#334155] rounded text-[10px] font-bold">{app.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E8F0] mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
