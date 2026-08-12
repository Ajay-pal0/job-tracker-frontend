import React, { useState, useRef } from 'react';
import { Briefcase, Table, Kanban, BarChart3, Plus, LogOut, Menu, X, KeyRound, UserCog, ChevronDown } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import type { User } from '../types';

interface HeaderProps {
  currentView: 'grid' | 'kanban' | 'analytics';
  onViewChange: (view: 'grid' | 'kanban' | 'analytics') => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExport: () => void;
  user: User | null;
  onLogout: () => void;
  onOpenSetPasswordModal?: () => void;
  onOpenEditProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenAddModal,
  user,
  onLogout,
  onOpenSetPasswordModal,
  onOpenEditProfileModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside using custom hook
  useOutsideClick(dropdownRef, () => setProfileDropdownOpen(false));

  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : (user?.username || 'User');

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

          {/* Desktop Controls (View Switcher + Add Button + Profile Dropdown) */}
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

            {/* User Profile Dropdown Menu Trigger */}
            <div className="relative border-l border-[#E2E8F0] pl-3" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 text-[#1E293B] bg-[#F8FAFC] hover:bg-[#EEF2FF] px-3 py-1.5 rounded-xl border border-[#E2E8F0] transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold max-w-[110px] truncate">
                  {displayName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {/* Profile Popover Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                      {user?.email || `@${user?.username || 'user'}`}
                    </p>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    {onOpenEditProfileModal && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenEditProfileModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2.5 transition-colors cursor-pointer"
                      >
                        <UserCog className="w-4 h-4 text-indigo-500" />
                        <span>Edit Profile</span>
                      </button>
                    )}

                    {onOpenSetPasswordModal && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenSetPasswordModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2.5 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-indigo-500" />
                        <span>{user?.has_password !== false ? 'Change Password' : 'Set Password'}</span>
                      </button>
                    )}
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>

                </div>
              )}
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

            {/* Mobile Profile & Actions Card */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-[#0F172A] block truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate block">
                    {user?.email || `@${user?.username || 'user'}`}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-semibold">
                {onOpenEditProfileModal && (
                  <button
                    onClick={() => {
                      onOpenEditProfileModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    <UserCog className="w-4 h-4 text-indigo-600" />
                    <span>Edit Profile</span>
                  </button>
                )}

                {onOpenSetPasswordModal && (
                  <button
                    onClick={() => {
                      onOpenSetPasswordModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span>{user?.has_password !== false ? 'Change Password' : 'Set Password'}</span>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </header>
  );
};
