import React from 'react';
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
  Link as LinkIcon
} from 'lucide-react';
import type { Application, ApplicationStatus } from '../types';

interface GridViewProps {
  applications: Application[];
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
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] my-6">
        <Building className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#0F172A]">No Job Applications Found</h3>
        <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1">
          You haven't added any applications yet or no results match your search filters. Click "+ Add Application" or "Import Excel" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4 w-full">
      
      {/* Mobile Card List View (Visible on small screens) */}
      <div className="block md:hidden space-y-3">
        {applications.map((app, index) => {
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
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none cursor-pointer max-w-[180px] sm:max-w-none truncate`}
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st} className="bg-white text-[#0F172A] font-medium">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badges: Salary, Location, Contact */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] pt-1">
                {app.salary && (
                  <span className="inline-block bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    {app.salary}
                  </span>
                )}
                {app.location && (
                  <span className="inline-flex items-center space-x-1 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-0.5 rounded-lg text-[11px] font-medium max-w-full">
                    <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
                    <span className="truncate">{app.location}</span>
                  </span>
                )}
                {app.recruiter_name && (
                  <span className="inline-flex items-center space-x-1 text-[11px] text-[#334155] font-medium max-w-full">
                    <UserCheck className="w-3 h-3 text-[#4F46E5] shrink-0" />
                    <span className="truncate">{app.recruiter_name}</span>
                  </span>
                )}
              </div>

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
      </div>

      {/* Desktop & Tablet Widescreen Table View (Hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-4 px-3 w-10 text-center">#</th>
                
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

                <th className="py-4 px-4 w-20 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0] text-xs sm:text-sm text-[#334155]">
              {applications.map((app, index) => {
                const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
                const recruiterInitial = app.recruiter_name ? app.recruiter_name.trim().charAt(0).toUpperCase() : '';

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-3 text-[#94A3B8] font-bold text-center text-xs">
                      {index + 1}
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

    </div>
  );
};
