import React from 'react';
import { Search, Download, Upload } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPlatform: string;
  onPlatformChange: (val: string) => void;
  selectedSort: string;
  onSortChange: (val: string) => void;
  onImportClick: () => void;
  onExportClick: () => void;
}

const STATUSES: string[] = [
  'All',
  'Wishlist',
  'Applied',
  'Interview Scheduled',
  'Interviewing',
  'Offer',
  'Rejected',
  'Joined',
  'Withdrawn',
];

const PLATFORMS: string[] = [
  'All',
  'LinkedIn',
  'Indeed',
  'Naukri',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Other',
];

const SORT_OPTIONS = [
  { label: 'Date Applied (Oldest)', value: 'applied_date_asc' },
  { label: 'Date Applied (Newest)', value: 'applied_date_desc' },
  { label: 'Company (A-Z)', value: 'company_asc' },
  { label: 'Highest Salary', value: 'highest_salary' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  selectedSort,
  onSortChange,
  onImportClick,
  onExportClick,
}) => {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 max-w-full overflow-hidden">
      
      {/* Search Input Box */}
      <div className="relative flex-1 w-full min-w-0">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company, role, location, contact, platform, notes..."
          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5] transition-all font-medium box-border"
        />
      </div>

      {/* Select Dropdowns & Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 w-full lg:w-auto max-w-full">
        
        {/* Status & Platform Dropdowns (Grid 2 cols on mobile) */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 sm:px-3 py-2 text-xs font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5] cursor-pointer truncate"
          >
            <option value="All">All Statuses</option>
            {STATUSES.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Platform Dropdown */}
          <select
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value)}
            className="w-full min-w-0 max-w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 sm:px-3 py-2 text-xs font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5] cursor-pointer truncate"
          >
            <option value="All">All Platforms</option>
            {PLATFORMS.filter(p => p !== 'All').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full min-w-0 max-w-full sm:w-auto bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5] cursor-pointer truncate"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Action Buttons: Import & Export */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onImportClick}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-[#F1F5F9] hover:bg-slate-200/80 text-[#334155] px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            <span className="truncate">Import Excel</span>
          </button>

          <button
            onClick={onExportClick}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-[#ECFDF5] hover:bg-emerald-100 text-[#047857] px-3 py-2 rounded-xl text-xs font-semibold border border-[#A7F3D0] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#047857] shrink-0" />
            <span className="truncate">Export Excel</span>
          </button>
        </div>

      </div>

    </div>
  );
};
