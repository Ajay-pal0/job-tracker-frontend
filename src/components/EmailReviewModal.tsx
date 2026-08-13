import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  Ban,
  Edit2,
  Save,
  Clock,
  Building,
  Briefcase,
  Sparkles,
  Inbox,
  CheckSquare,
  Square,
  MinusSquare,
  FileText,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { STATUS_COLORS } from './GridView';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import type { EmailMessageItem, ApplicationStatus, Platform } from '../types';

interface EmailReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRefresh: () => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Applied',
  'Interview Scheduled',
  'Interviewing',
  'Offer',
  'Rejected',
  'Joined',
  'Wishlist',
  'Withdrawn',
];

const PLATFORM_OPTIONS: Platform[] = [
  'LinkedIn',
  'Indeed',
  'Naukri',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Other',
];

export const EmailReviewModal: React.FC<EmailReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccessRefresh,
}) => {
  useLockBodyScroll(isOpen);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<EmailMessageItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [ignoredCount, setIgnoredCount] = useState(0);

  const [filterStatus, setFilterStatus] = useState<string>('PENDING_REVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedSnippetMsg, setSelectedSnippetMsg] = useState<EmailMessageItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Editable row state map
  const [editingMap, setEditingMap] = useState<
    Record<
      number,
      {
        company_name: string;
        job_title: string;
        status: ApplicationStatus;
        platform: Platform;
      }
    >
  >({});

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      setSelectedIds([]);
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen, filterStatus, currentPage, itemsPerPage]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const fetchMessages = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await applicationService.getGmailMessages({
        status: filterStatus === 'ALL' ? undefined : filterStatus,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        page_size: itemsPerPage,
      });
      setMessages(res.messages || []);
      setPendingCount(res.pending_review_count || 0);
      setProcessedCount(res.processed_count || 0);
      setIgnoredCount(res.ignored_count || 0);
      setTotalCount(res.count || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to load extracted emails.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMessages();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map((m) => m.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const startEditing = (msg: EmailMessageItem) => {
    setEditingMap((prev) => ({
      ...prev,
      [msg.id]: {
        company_name: msg.extracted_company_name || 'Unknown Company',
        job_title: msg.extracted_job_title || 'Software Engineer',
        status: msg.extracted_status || 'Applied',
        platform: msg.extracted_platform || 'LinkedIn',
      },
    }));
  };

  const cancelEditing = (id: number) => {
    setEditingMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleApproveSingle = async (msg: EmailMessageItem) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const overrides = editingMap[msg.id] || {
        company_name: msg.extracted_company_name,
        job_title: msg.extracted_job_title,
        status: msg.extracted_status,
        platform: msg.extracted_platform,
      };

      await applicationService.approveGmailEmail(msg.id, overrides);
      setSuccessMsg(`Approved "${overrides.company_name} - ${overrides.job_title}".`);
      cancelEditing(msg.id);
      onSuccessRefresh();
      fetchMessages();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to approve application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIgnoreSingle = async (id: number) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await applicationService.ignoreGmailEmail(id);
      setSuccessMsg('Email marked as ignored.');
      onSuccessRefresh();
      fetchMessages();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to ignore email.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await applicationService.bulkApproveGmailEmails(selectedIds);
      setSuccessMsg(res.message);
      setSelectedIds([]);
      onSuccessRefresh();
      fetchMessages();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed bulk approval.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkIgnore = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await applicationService.bulkIgnoreGmailEmails(selectedIds);
      setSuccessMsg(res.message);
      setSelectedIds([]);
      onSuccessRefresh();
      fetchMessages();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed bulk ignore.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 border border-[#E2E8F0] shadow-2xl relative my-auto h-[85vh] min-h-[540px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header - Consistent with GmailModal and ImportModal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-50 text-[#4F46E5] rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A]">Review Extracted Applications</h3>
              <p className="text-xs text-[#64748B]">Confirm, edit, or ignore job applications extracted from Gmail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#334155] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row - Matches project summary cards */}
        <div className="grid grid-cols-3 gap-3 py-3 border-b border-[#E2E8F0] shrink-0">
          <div
            onClick={() => setFilterStatus('PENDING_REVIEW')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'PENDING_REVIEW'
                ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400/30'
                : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">Pending Review</span>
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            </div>
            <p className="text-lg font-extrabold text-[#0F172A] mt-1">{pendingCount}</p>
          </div>

          <div
            onClick={() => setFilterStatus('PROCESSED')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'PROCESSED'
                ? 'bg-[#ECFDF5] border-[#A7F3D0] ring-1 ring-[#10B981]/30'
                : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#047857] uppercase tracking-wider">Approved / Imported</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <p className="text-lg font-extrabold text-[#0F172A] mt-1">{processedCount}</p>
          </div>

          <div
            onClick={() => setFilterStatus('IGNORED')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              filterStatus === 'IGNORED'
                ? 'bg-slate-100 border-slate-300 ring-1 ring-slate-400/30'
                : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Ignored</span>
              <Ban className="w-3.5 h-3.5 text-[#94A3B8]" />
            </div>
            <p className="text-lg font-extrabold text-[#0F172A] mt-1">{ignoredCount}</p>
          </div>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {[
              { id: 'PENDING_REVIEW', label: 'Pending Review', count: pendingCount },
              { id: 'PROCESSED', label: 'Approved', count: processedCount },
              { id: 'IGNORED', label: 'Ignored', count: ignoredCount },
              { id: 'ALL', label: 'All Emails', count: pendingCount + processedCount + ignoredCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, title, sender..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
            />
          </form>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-3 flex items-center space-x-2 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-3 text-[#BE123C] text-xs shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 flex items-center space-x-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3 text-[#047857] text-xs shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-3 p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between animate-in fade-in duration-150 shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-bold text-[#4F46E5]">
                {selectedIds.length} email{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] font-semibold text-[#BE123C] hover:text-rose-700 bg-white hover:bg-rose-50 px-2 py-0.5 rounded-md border border-[#FECDD3] transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Deselect All</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkApprove}
                disabled={actionLoading}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Selected</span>
              </button>
              <button
                onClick={handleBulkIgnore}
                disabled={actionLoading}
                className="bg-white border border-[#FECDD3] text-[#BE123C] hover:bg-rose-50 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Ignore Selected</span>
              </button>
            </div>
          </div>
        )}

        {/* List of Email Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B] py-12">
              <RefreshCw className="w-6 h-6 text-[#4F46E5] animate-spin mb-2" />
              <p className="text-xs font-medium">Loading extracted emails...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B] bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl p-8 my-auto">
              <Inbox className="w-8 h-8 text-[#94A3B8] mb-2" />
              <p className="text-sm font-bold text-[#0F172A]">No extracted emails found</p>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm">
                {filterStatus === 'PENDING_REVIEW'
                  ? 'All extracted emails have been reviewed or approved!'
                  : 'No emails match the selected filters.'}
              </p>
            </div>
          ) : (
            <>
              {/* Sticky Select All & Selection Actions Header */}
              <div className="sticky top-0 bg-white z-20 py-2 px-1 border-b border-[#E2E8F0] mb-3 flex items-center justify-between shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center space-x-1.5 text-[#334155] hover:text-[#4F46E5] cursor-pointer"
                >
                  {selectedIds.length === messages.length && messages.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                  ) : selectedIds.length > 0 ? (
                    <MinusSquare className="w-4 h-4 text-[#4F46E5]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="font-semibold text-xs">Select All ({messages.length})</span>
                </button>

                {selectedIds.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#64748B]">
                      <strong className="text-[#4F46E5] font-bold">{selectedIds.length}</strong> selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="text-xs font-semibold text-[#BE123C] hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-[#FECDD3] transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Deselect All</span>
                    </button>
                  </div>
                )}
              </div>

              {messages.map((msg) => {
                const isEditing = !!editingMap[msg.id];
                const editValues = editingMap[msg.id];

                const statusStyle = STATUS_COLORS[msg.extracted_status as ApplicationStatus] || STATUS_COLORS.Applied;

                return (
                  <div
                    key={msg.id}
                    className={`bg-white border rounded-xl p-4 transition-all ${
                      msg.processing_status === 'PENDING_REVIEW'
                        ? 'border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1]'
                        : msg.processing_status === 'PROCESSED'
                        ? 'bg-[#ECFDF5]/40 border-[#A7F3D0]'
                        : 'bg-slate-50 border-slate-200 opacity-80'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 pb-2">
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={() => toggleSelect(msg.id)}
                          className="text-[#94A3B8] hover:text-[#4F46E5] cursor-pointer pt-0.5"
                        >
                          {selectedIds.includes(msg.id) ? (
                            <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-[#0F172A]">
                              {msg.sender_name || msg.sender_email}
                            </span>
                            <span className="text-[10px] text-[#64748B]">({msg.sender_email})</span>
                          </div>
                          <p className="text-[11px] text-[#64748B]">
                            {msg.received_at ? new Date(msg.received_at).toLocaleString() : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {(msg.gmail_url || msg.gmail_message_id) && (
                          <a
                            href={msg.gmail_url || `https://mail.google.com/mail/u/0/#inbox/${msg.gmail_message_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] hover:bg-indigo-50 text-[#4F46E5] border border-[#E2E8F0] hover:border-indigo-200 transition-colors flex items-center space-x-1 cursor-pointer"
                            title="Open this email directly in Gmail"
                          >
                            <ExternalLink className="w-3 h-3 text-[#4F46E5]" />
                            <span>Open in Gmail</span>
                          </a>
                        )}

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-[#4F46E5]" />
                          <span>{Math.round((msg.confidence_score || 0.95) * 100)}% Match</span>
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                            msg.has_linked_application || msg.processing_status === 'PROCESSED'
                              ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                              : msg.processing_status === 'PENDING_REVIEW'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          {msg.has_linked_application || msg.processing_status === 'PROCESSED'
                            ? 'Approved (In Application Table)'
                            : msg.processing_status === 'PENDING_REVIEW'
                            ? 'Pending Review'
                            : msg.processing_status}
                        </span>
                      </div>
                    </div>

                    {/* Email Subject */}
                    <div className="py-1">
                      <p className="text-xs font-semibold text-[#1E293B] flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                        <span>{msg.subject}</span>
                      </p>
                    </div>

                    {/* Linked Application Notice */}
                    {msg.has_linked_application && (
                      <div className="my-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-medium text-emerald-800">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Active application present in Application Table. Delete application to unlock ignore/unapprove.</span>
                      </div>
                    )}

                    {/* Extracted Details / Inline Edit Box */}
                    <div className="my-2.5 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        
                        {/* Company Name */}
                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase block">Company Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValues.company_name}
                              onChange={(e) =>
                                setEditingMap((prev) => ({
                                  ...prev,
                                  [msg.id]: { ...prev[msg.id], company_name: e.target.value },
                                }))
                              }
                              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#4F46E5]"
                            />
                          ) : (
                            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1">
                              <Building className="w-3.5 h-3.5 text-[#4F46E5]" />
                              <span>{msg.extracted_company_name || 'Unknown Company'}</span>
                            </span>
                          )}
                        </div>

                        {/* Job Title */}
                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase block">Job Title</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValues.job_title}
                              onChange={(e) =>
                                setEditingMap((prev) => ({
                                  ...prev,
                                  [msg.id]: { ...prev[msg.id], job_title: e.target.value },
                                }))
                              }
                              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#4F46E5]"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-[#334155] flex items-center space-x-1 truncate">
                              <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
                              <span className="truncate">{msg.extracted_job_title || 'Software Engineer'}</span>
                            </span>
                          )}
                        </div>

                        {/* Status Badge (Uses project STATUS_COLORS) */}
                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase block">Status</label>
                          {isEditing ? (
                            <select
                              value={editValues.status}
                              onChange={(e) =>
                                setEditingMap((prev) => ({
                                  ...prev,
                                  [msg.id]: { ...prev[msg.id], status: e.target.value as ApplicationStatus },
                                }))
                              }
                              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#4F46E5]"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="pt-0.5">
                              <span
                                className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                <span>{msg.extracted_status || 'Applied'}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Platform */}
                        <div>
                          <label className="text-[10px] font-bold text-[#64748B] uppercase block">Platform</label>
                          {isEditing ? (
                            <select
                              value={editValues.platform}
                              onChange={(e) =>
                                setEditingMap((prev) => ({
                                  ...prev,
                                  [msg.id]: { ...prev[msg.id], platform: e.target.value as Platform },
                                }))
                              }
                              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#4F46E5]"
                            >
                              {PLATFORM_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs font-medium text-[#64748B]">
                              {msg.extracted_platform || 'LinkedIn'}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Email Snippet Button (Matches GridView Note Modal pattern) */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedSnippetMsg(msg)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Raw Email Snippet</span>
                      </button>
                    </div>

                    {/* Row Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E8F0] mt-3">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => cancelEditing(msg.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveSingle(msg)}
                            disabled={actionLoading}
                            className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save & Approve</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditing(msg)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#4F46E5] hover:bg-indigo-50 border border-indigo-200 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Details</span>
                          </button>

                          {msg.processing_status !== 'IGNORED' && (
                            <button
                              type="button"
                              onClick={() => handleIgnoreSingle(msg.id)}
                              disabled={actionLoading || !!msg.has_linked_application}
                              title={
                                msg.has_linked_application
                                  ? 'Cannot ignore because an active application exists in Application table. Delete application first.'
                                  : 'Ignore email'
                              }
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1 ${
                                msg.has_linked_application
                                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                                  : 'text-[#BE123C] hover:bg-rose-50 border-[#FECDD3] cursor-pointer'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Ignore</span>
                            </button>
                          )}

                          {msg.processing_status !== 'PROCESSED' && (
                            <button
                              type="button"
                              onClick={() => handleApproveSingle(msg)}
                              disabled={actionLoading}
                              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Import</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 mt-3 gap-2.5 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-[#64748B]">
                Showing <strong className="text-[#0F172A]">{totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
                <strong className="text-[#0F172A]">{Math.min(currentPage * itemsPerPage, totalCount)}</strong> of{' '}
                <strong className="text-[#0F172A]">{totalCount}</strong> emails
              </span>

              <div className="flex items-center space-x-1.5 text-xs text-[#64748B]">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-0.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center space-x-0.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | string)[]>((acc, page, idx, arr) => {
                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    typeof item === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-[#94A3B8]">…</span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCurrentPage(item)}
                        className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          currentPage === item
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'text-[#64748B] hover:bg-white hover:text-[#0F172A]'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Full Email Snippet Detail Modal (Identical to GridView Notes Modal) */}
      {selectedSnippetMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedSnippetMsg.extracted_company_name || 'Extracted Application'}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 truncate max-w-[240px]">
                    {selectedSnippetMsg.extracted_job_title || selectedSnippetMsg.subject}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSnippetMsg(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Raw Email Snippet</span>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs leading-relaxed text-slate-700 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono">
                {selectedSnippetMsg.body_text || selectedSnippetMsg.snippet || 'No raw email content available.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const text = selectedSnippetMsg.body_text || selectedSnippetMsg.snippet || '';
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className={copied ? 'text-emerald-600' : ''}>{copied ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSnippetMsg(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
