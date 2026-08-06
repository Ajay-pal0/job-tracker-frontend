import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Briefcase } from 'lucide-react';
import type { Application, ApplicationStatus, Platform } from '../types';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Application>) => void;
  initialData?: Application | null;
  loading?: boolean;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Interview Scheduled',
  'Interviewing',
  'Offer',
  'Rejected',
  'Joined',
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

export const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Application>>();

  useEffect(() => {
    if (initialData) {
      reset({
        company_name: initialData.company_name,
        job_title: initialData.job_title,
        location: initialData.location,
        applied_date: initialData.applied_date,
        status: initialData.status,
        salary: initialData.salary,
        platform: initialData.platform,
        job_url: initialData.job_url,
        recruiter_name: initialData.recruiter_name,
        recruiter_email: initialData.recruiter_email,
        notes: initialData.notes,
      });
    } else {
      reset({
        company_name: '',
        job_title: '',
        location: '',
        applied_date: new Date().toISOString().split('T')[0],
        status: 'Applied',
        salary: '',
        platform: 'LinkedIn',
        job_url: '',
        recruiter_name: '',
        recruiter_email: '',
        notes: '',
      });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 border border-[#E2E8F0] shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#EEF2FF] text-[#4F46E5] rounded-lg flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A]">
              {initialData ? 'Edit Application' : 'Add New Application'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#334155] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          
          {/* Row 1: Company Name & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Stripe"
                {...register('company_name', { required: 'Company name is required' })}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
              {errors.company_name && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.company_name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">
                Job role / position <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                {...register('job_title', { required: 'Job role is required' })}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
              {errors.job_title && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.job_title.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Location & Date Applied */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA or Remote"
                {...register('location')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Date Applied</label>
              <input
                type="date"
                {...register('applied_date', { required: 'Applied date is required' })}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Row 3: Status & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5] cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Salary / compensation</label>
              <input
                type="text"
                placeholder="e.g. 14 LPA or $140,000"
                {...register('salary')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Row 4: People connected & Source/Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">People connected / contacts</label>
              <input
                type="text"
                placeholder="e.g. Supriya (IT Recruiter)"
                {...register('recruiter_name')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Source / Platform</label>
              <select
                {...register('platform')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5] cursor-pointer"
              >
                {PLATFORM_OPTIONS.map((pf) => (
                  <option key={pf} value={pf}>{pf}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Job Link & Recruiter Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Job Link / URL</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('job_url')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Recruiter Email</label>
              <input
                type="email"
                placeholder="recruiter@company.com"
                {...register('recruiter_email')}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Notes / Call Logs / Next Steps</label>
            <textarea
              rows={3}
              placeholder="e.g. Received email asking for availability..."
              {...register('notes')}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#4F46E5]"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E8F0] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Application'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
