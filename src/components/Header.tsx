import React, { useState } from 'react';
import { Briefcase, Table, Kanban, BarChart3, Plus, LogOut, Menu, X } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  currentView: 'grid' | 'kanban' | 'analytics';
  onViewChange: (view: 'grid' | 'kanban' | 'analytics') => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExport: () => void;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenAddModal,
  user,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-[24px] font-bold text-[#0F172A] leading-tight tracking-tight">
                Job Application Tracker
              </h1>
              <p className="hidden sm:block text-xs font-medium text-[#64748B]">
                Track, manage, and accelerate your job search pipeline
              </p>
            </div>
          </div>

          {/* Desktop Controls (View Switcher + Add Button + Profile) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* View Switcher Pill */}
            <div className="bg-[#F1F5F9] p-1 rounded-xl flex items-center space-x-1 border border-[#E2E8F0]">
              <button
                onClick={() => onViewChange('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'grid'
                    ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Grid Table</span>
              </button>

              <button
                onClick={() => onViewChange('kanban')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'kanban'
                    ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>

              <button
                onClick={() => onViewChange('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'analytics'
                    ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Primary Add Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Application</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 border-l border-[#E2E8F0] pl-3">
              <div className="flex items-center space-x-2 text-[#1E293B] bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
                <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center text-xs font-bold">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">
                  {user?.username || 'User'}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3.5 pb-2 border-t border-[#E2E8F0] mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-[#F1F5F9] p-1 rounded-xl flex items-center justify-between border border-[#E2E8F0]">
              <button
                onClick={() => {
                  onViewChange('grid');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'grid'
                    ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B]'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Grid Table</span>
              </button>

              <button
                onClick={() => {
                  onViewChange('kanban');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'kanban'
                    ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B]'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>

              <button
                onClick={() => {
                  onViewChange('analytics');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'analytics'
                    ? 'bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center space-x-2 text-[#1E293B]">
                <div className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center text-xs font-bold">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">
                  {user?.username || 'User'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
