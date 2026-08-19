import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Building,
  UserCheck,
  Briefcase,
  Zap,
  DollarSign,
  Globe,
  Link as LinkIcon,
  FileText,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import type { Application, ApplicationStatus } from '../types';

interface GridViewProps {
  applications: Application[];
  loading?: boolean;
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: ApplicationStatus) => void;
}

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; dot: string; border: string }> = {
  Wishlist: { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', dot: 'bg-[#F59E0B]', border: 'border-[#FDE68A]' },
  Applied: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', dot: 'bg-[#3B82F6]', border: 'border-[#BFDBFE]' },
  'Interview Scheduled': { bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]', dot: 'bg-[#A855F7]', border: 'border-[#E9D5FF]' },
  Interviewing: { bg: 'bg-[#FAF5FF]', text: 'text-[#7E22CE]', dot: 'bg-[#A855F7]', border: 'border-[#E9D5FF]' },
  Offer: { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', dot: 'bg-[#10B981]', border: 'border-[#A7F3D0]' },
  Rejected: { bg: 'bg-[#FFF1F2]', text: 'text-[#BE123C]', dot: 'bg-[#F43F5E]', border: 'border-[#FECDD3]' },
  Joined: { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', dot: 'bg-[#22C55E]', border: 'border-[#BBF7D0]' },
  Withdrawn: { bg: 'bg-[#F8FAFC]', text: 'text-[#64748B]', dot: 'bg-[#94A3B8]', border: 'border-[#E2E8F0]' },
};

const ALL_STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Interview Scheduled',
  'Interviewing',
  'Offer',
  'Rejected',
  'Joined',
  'Withdrawn',
];

export const GridView: React.FC<GridViewProps> = ({
  applications,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [selectedNoteApp, setSelectedNoteApp] = useState<Application | null>(null);
  const [copied, setCopied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(10);
  const mobileSentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when applications change
  useEffect(() => {
    setCurrentPage(1);
    setMobileVisibleCount(10);
  }, [applications.length]);

  // Mobile Infinite Scroll Observer
  useEffect(() => {
    const sentinel = mobileSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMobileVisibleCount((prev) => {
            if (prev < applications.length) {
              return Math.min(prev + 10, applications.length);
            }
            return prev;
          });
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [applications.length]);

  const totalPages = Math.max(1, Math.ceil(applications.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const desktopPaginatedApps = applications.slice(startIndex, startIndex + itemsPerPage);
  const mobileVisibleApps = applications.slice(0, mobileVisibleCount);

  if (loading) {
    return (
      <div className="mb-6 space-y-4 w-full min-h-[calc(100vh-280px)] flex flex-col">
        {/* Mobile Skeleton Cards */}
        <div className="block md:hidden space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded-md"></div>
                </div>
                <div className="h-6 w-14 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="h-6 w-28 bg-slate-200 rounded-full"></div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                <div className="h-5 w-20 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Desktop Skeleton Table */}
        <div className="hidden md:flex flex-col flex-1 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-4 px-3 w-10 text-center">#</th>
                  <th className="py-4 px-4">COMPANY</th>
                  <th className="py-4 px-4">ROLE</th>
                  <th className="py-4 px-4">LOCATION</th>
                  <th className="py-4 px-4">DATE APPLIED</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">SALARY</th>
                  <th className="py-4 px-4">PEOPLE CONNECTED</th>
                  <th className="py-4 px-4">SOURCE / PLATFORM</th>
                  <th className="py-4 px-3 text-center">LINK</th>
                  <th className="py-4 px-4">NOTES</th>
                  <th className="py-4 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-3 text-center"><div className="h-3 w-4 bg-slate-200 rounded mx-auto"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-slate-200 rounded-md"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-36 bg-slate-200 rounded-md"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-slate-200 rounded-xl"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-slate-200 rounded-xl"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-28 bg-slate-200 rounded-full"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-24 bg-slate-200 rounded-xl"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-20 bg-slate-200 rounded-xl"></div></td>
                    <td className="py-4 px-3 text-center"><div className="h-6 w-6 bg-slate-200 rounded-xl mx-auto"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-36 bg-slate-200 rounded-md"></div></td>
                    <td className="py-4 px-4 text-right"><div className="h-6 w-12 bg-slate-200 rounded-xl ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] my-2 min-h-[calc(100vh-280px)] flex flex-col items-center justify-center">
        <Building className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#0F172A]">No Job Applications Found</h3>
        <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1">
          You haven't added any applications yet or no results match your search filters. Click "+ Add Application" or "Import Excel" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between w-full min-h-[calc(100dvh-220px)] md:min-h-0">
      
      {/* Mobile Card List View (Visible on small screens) */}
      <div className="block md:hidden flex-1 space-y-3 min-h-0 pb-12">
        {mobileVisibleApps.map((app, index) => {
          const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3 max-w-full overflow-hidden"
            >
              {/* Top Row: Index + Company + Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2 min-w-0">
                  <span className="text-xs font-bold text-[#94A3B8] shrink-0 mt-0.5">#{index + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                      {app.company_name}
                    </h4>
                    <p className="text-xs font-semibold text-[#64748B] truncate">
                      {app.job_title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#4F46E5] hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Open Job Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => onEdit(app)}
                    className="p-1.5 text-[#64748B] hover:text-[#4F46E5] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="p-1.5 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <span className="text-[11px] font-semibold text-[#64748B] shrink-0">Status:</span>
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none transition-all ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E2E8F0]">
                {app.salary ? (
                  <div className="flex items-center space-x-1.5 text-[#334155]">
                    <DollarSign className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span className="font-semibold">{app.salary}</span>
                  </div>
                ) : null}

                {app.location ? (
                  <div className="flex items-center space-x-1.5 text-[#64748B]">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span className="truncate">{app.location}</span>
                  </div>
                ) : null}

                {app.recruiter_name ? (
                  <div className="flex items-center space-x-1.5 text-[#334155] col-span-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
                    <span className="font-medium truncate">Recruiter: {app.recruiter_name}</span>
                  </div>
                ) : null}
              </div>

              {/* Notes Snippet */}
              {app.notes ? (
                <div
                  onClick={() => setSelectedNoteApp(app)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 space-y-1 cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-[#4F46E5]" />
                      <span>Notes</span>
                    </span>
                    <span className="text-[10px] text-[#4F46E5] font-semibold">Tap to view</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#334155] font-normal line-clamp-3" title={app.notes}>
                    {app.notes}
                  </p>
                </div>
              ) : null}

              {/* Footer: Date & Platform */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#94A3B8]" />
                  <span>
                    {new Date(app.applied_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <span className="bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded-md font-semibold border border-[#E2E8F0]">
                  {app.platform}
                </span>
              </div>

            </div>
          );
        })}

        {/* Mobile Scrollable Pagination / Load More Footer */}
        <div className="pt-2">
          <div className="flex flex-col items-center justify-center space-y-2.5 p-4 bg-white rounded-2xl border border-[#E2E8F0] text-center shadow-2xs">
            <span className="text-xs font-semibold text-[#64748B]">
              Showing <strong className="text-[#0F172A]">{mobileVisibleApps.length}</strong> of{' '}
              <strong className="text-[#0F172A]">{applications.length}</strong> applications
            </span>

            {mobileVisibleApps.length < applications.length && (
              <button
                type="button"
                onClick={() => setMobileVisibleCount((c) => Math.min(c + 10, applications.length))}
                className="w-full bg-[#F1F5F9] hover:bg-indigo-50 text-[#4F46E5] font-bold text-xs py-2.5 px-4 rounded-xl border border-[#E2E8F0] transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Load More Applications ({applications.length - mobileVisibleApps.length} remaining)</span>
              </button>
            )}
          </div>
          <div ref={mobileSentinelRef} className="h-4 w-full"></div>
        </div>
      </div>

      {/* Desktop & Tablet Widescreen Table View (Hidden on mobile) */}
      <div className="hidden md:flex flex-col flex-1 min-h-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto flex-1 w-full min-h-0 pb-2">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="sticky top-0 bg-[#F8FAFC] z-10 shadow-2xs border-b border-[#E2E8F0]">
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-4 px-3 w-10 text-center rounded-tl-2xl">#</th>

                <th className="py-4 px-4 min-w-[150px]">
                  <div className="flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>COMPANY</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[170px]">
                  <div className="flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>ROLE</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[140px]">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>LOCATION</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[140px]">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>DATE APPLIED</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[145px]">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>STATUS</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[110px]">
                  <div className="flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>SALARY</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[170px]">
                  <div className="flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>PEOPLE CONNECTED</span>
                  </div>
                </th>

                <th className="py-4 px-4 min-w-[130px]">
                  <div className="flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>SOURCE / PLATFORM</span>
                  </div>
                </th>

                <th className="py-4 px-3 w-16 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>LINK</span>
                  </div>
                </th>
                
                <th className="py-4 px-4 min-w-[180px] max-w-[280px]">
                  <div className="flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>NOTES</span>
                  </div>
                </th>

                <th className="py-4 px-4 w-20 text-right rounded-tr-2xl">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0] text-xs sm:text-sm text-[#334155]">
              {desktopPaginatedApps.map((app, index) => {
                const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
                const recruiterInitial = app.recruiter_name ? app.recruiter_name.trim().charAt(0).toUpperCase() : '';
                const isTopRow = index < 2;

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-3 text-[#94A3B8] font-bold text-center text-xs">
                      {startIndex + index + 1}
                    </td>

                    {/* Company */}
                    <td className="py-4 px-4 font-bold text-[#0F172A] text-sm leading-snug">
                      {app.company_name}
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 font-semibold text-[#1E293B] text-xs sm:text-sm leading-snug">
                      {app.job_title}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-[#64748B] text-xs">
                      {app.location ? (
                        <span className="inline-flex items-center space-x-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl font-medium text-[#334155] shadow-2xs">
                          <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span>{app.location}</span>
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">-</span>
                      )}
                    </td>

                    {/* Date Applied */}
                    <td className="py-4 px-4 text-[#334155] font-medium text-xs">
                      <span className="inline-flex items-center space-x-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                        <Calendar className="w-3.5 h-3.5 text-[#4F46E5]" />
                        <span className="font-semibold text-[#1E293B]">
                          {new Date(app.applied_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <div className="relative inline-block text-left max-w-full">
                        <select
                          value={app.status}
                          onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className={`appearance-none cursor-pointer text-xs font-bold px-3 py-1.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} pr-7 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 max-w-full truncate shadow-2xs`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-white text-[#0F172A] font-medium">
                              {st}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
                          <svg className="w-3 h-3 fill-current opacity-70" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-4">
                      {app.salary ? (
                        <span className="inline-block bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                          {app.salary}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] text-xs">-</span>
                      )}
                    </td>

                    {/* People Connected */}
                    <td className="py-4 px-4 text-[#334155] text-xs">
                      {app.recruiter_name ? (
                        <div className="inline-flex items-center space-x-2 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-xl">
                          <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center text-[10px] font-bold shrink-0">
                            {recruiterInitial}
                          </div>
                          <span className="font-semibold text-[#1E293B] text-xs">{app.recruiter_name}</span>
                        </div>
                      ) : (
                        <span className="text-[#94A3B8] text-xs">None</span>
                      )}
                    </td>

                    {/* Source / Platform */}
                    <td className="py-4 px-4">
                      <span className="inline-block bg-[#F1F5F9] text-[#334155] px-3 py-1 rounded-xl text-xs font-semibold border border-[#E2E8F0]">
                        {app.platform}
                      </span>
                    </td>

                    {/* Link */}
                    <td className="py-4 px-3 text-center">
                      {app.job_url ? (
                        <a
                          href={app.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 text-[#4F46E5] hover:bg-[#EEF2FF] border border-transparent hover:border-[#BFDBFE] rounded-xl transition-all shadow-2xs"
                          title="Open Job URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-[#94A3B8] text-xs">-</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-4 px-4 text-xs max-w-[240px]">
                      {app.notes && app.notes.trim() ? (
                        <div
                          onClick={() => setSelectedNoteApp(app)}
                          className="relative group/note cursor-pointer"
                        >
                          <p
                            className="text-[#334155] text-xs line-clamp-2 leading-relaxed font-normal group-hover/note:text-[#4F46E5] transition-colors"
                            title={app.notes}
                          >
                            {app.notes}
                          </p>

                          {/* Hover Tooltip / Popover showing full notes (Smart directional opening) */}
                          <div
                            className={`pointer-events-none opacity-0 group-hover/note:opacity-100 transition-all duration-200 absolute right-0 w-72 p-3.5 bg-slate-900 text-white text-xs rounded-2xl shadow-2xl z-50 whitespace-normal break-words space-y-1.5 ${
                              isTopRow
                                ? 'top-full mt-2.5 transform translate-y-[-4px] group-hover/note:translate-y-0'
                                : 'bottom-full mb-2.5 transform translate-y-[4px] group-hover/note:translate-y-0'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-300 text-[11px] pb-1 border-b border-slate-700/60">
                              <div className="flex items-center space-x-1.5">
                                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span>Full Note</span>
                              </div>
                              <span className="text-[10px] text-indigo-300 font-normal">Click cell for details</span>
                            </div>
                            <p className="text-slate-200 text-xs font-normal max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                              {app.notes}
                            </p>
                            
                            {/* Arrow Indicator pointing to cell */}
                            <div
                              className={`absolute right-6 w-2.5 h-2.5 bg-slate-900 rotate-45 ${
                                isTopRow ? '-top-1' : '-bottom-1'
                              }`}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#94A3B8] text-xs">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onEdit(app)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#4F46E5] hover:bg-[#EEF2FF] rounded-xl transition-colors cursor-pointer"
                          title="Edit Application"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(app.id)}
                          className="p-1.5 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desktop Page Count & Pagination Controls */}
      <div className="hidden md:flex items-center justify-between bg-white px-6 py-3.5 border border-[#E2E8F0] rounded-2xl shadow-2xs mt-3 shrink-0">
        {/* Count Info & Per Page selector */}
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold text-[#64748B]">
            Showing <strong className="text-[#0F172A]">{applications.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
            <strong className="text-[#0F172A]">{Math.min(startIndex + itemsPerPage, applications.length)}</strong> of{' '}
            <strong className="text-[#0F172A]">{applications.length}</strong> applications
          </span>

          <div className="flex items-center space-x-1.5 text-xs text-[#64748B]">
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Note Detail Modal */}
      {selectedNoteApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedNoteApp.company_name}</h4>
                  <p className="text-xs font-medium text-slate-500">{selectedNoteApp.job_title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNoteApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Application Notes</span>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs leading-relaxed text-slate-700 max-h-64 overflow-y-auto whitespace-pre-wrap">
                {selectedNoteApp.notes}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedNoteApp.notes);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className={copied ? 'text-emerald-600' : ''}>{copied ? 'Copied to Clipboard!' : 'Copy Note'}</span>
              </button>

              <button
                onClick={() => setSelectedNoteApp(null)}
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
