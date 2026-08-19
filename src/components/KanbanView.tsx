import React, { useState } from 'react';
import { ExternalLink, Edit2, Trash2, Calendar, MapPin, UserCheck, FileText } from 'lucide-react';
import type { Application, ApplicationStatus } from '../types';

interface KanbanViewProps {
  applications: Application[];
  loading?: boolean;
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: ApplicationStatus) => void;
}

const KANBAN_COLUMNS: { status: ApplicationStatus; label: string; dotColor: string }[] = [
  { status: 'Wishlist', label: 'Wishlist', dotColor: 'bg-[#F59E0B]' },
  { status: 'Applied', label: 'Applied', dotColor: 'bg-[#3B82F6]' },
  { status: 'Interview Scheduled', label: 'Interview Scheduled', dotColor: 'bg-[#A855F7]' },
  { status: 'Interviewing', label: 'Interviewing', dotColor: 'bg-[#A855F7]' },
  { status: 'Offer', label: 'Offer', dotColor: 'bg-[#10B981]' },
  { status: 'Rejected', label: 'Rejected', dotColor: 'bg-[#F43F5E]' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  applications,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [draggedAppId, setDraggedAppId] = useState<number | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<string>('All');

  if (loading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden flex-1 min-h-0 w-full pb-2">
          <div className="flex gap-4 min-w-[1200px] h-full">
            {KANBAN_COLUMNS.map((col) => (
              <div
                key={col.status}
                className="w-[280px] bg-[#F1F5F9]/70 rounded-2xl p-3 border border-[#E2E8F0] flex flex-col shrink-0 h-full space-y-3 animate-pulse"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] px-1 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
                    <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="h-5 w-6 bg-slate-200 rounded-full"></div>
                </div>

                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] space-y-2.5 shadow-2xs">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
                    <div className="h-3 w-1/2 bg-slate-200 rounded-md"></div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
                      <div className="h-4 w-12 bg-slate-200 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedAppId(id);
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    if (draggedAppId !== null) {
      onStatusChange(draggedAppId, targetStatus);
      setDraggedAppId(null);
    }
  };

  const filteredColumns = activeMobileTab === 'All'
    ? KANBAN_COLUMNS
    : KANBAN_COLUMNS.filter(col => col.status === activeMobileTab);

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-visible md:overflow-hidden">
      
      {/* Mobile Column Quick Filter Tabs */}
      <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto pb-2 no-scrollbar shrink-0">
        <button
          onClick={() => setActiveMobileTab('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
            activeMobileTab === 'All'
              ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
              : 'bg-white text-[#64748B] border-[#E2E8F0]'
          }`}
        >
          All Stages ({applications.length})
        </button>
        {KANBAN_COLUMNS.map((col) => {
          const cnt = applications.filter((a) => a.status === col.status).length;
          return (
            <button
              key={col.status}
              onClick={() => setActiveMobileTab(col.status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 border ${
                activeMobileTab === col.status
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
              <span>{col.label} ({cnt})</span>
            </button>
          );
        })}
      </div>

      {/* Board Scroll Container */}
      <div className="overflow-x-auto overflow-y-visible md:overflow-y-hidden flex-1 min-h-0 w-full pb-2">
        <div className="flex gap-4 min-w-full md:min-w-[1200px] min-h-[480px] md:h-full">
          {filteredColumns.map((col) => {
            const columnApps = applications.filter((app) => app.status === col.status);
            return (
              <div
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
                className="w-full sm:w-[300px] md:w-[280px] bg-[#F1F5F9]/70 rounded-2xl p-3 border border-[#E2E8F0] flex flex-col shrink-0 min-h-[400px] md:h-full md:max-h-full overflow-hidden snap-start"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0] px-1 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
                    <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
                      {col.label}
                    </h3>
                  </div>
                  <span className="bg-[#E2E8F0] text-[#475569] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
                  {columnApps.length === 0 ? (
                    <div className="h-full border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center flex flex-col items-center justify-center my-auto min-h-[140px]">
                      <p className="text-[11px] font-medium text-[#94A3B8]">
                        No applications in this stage
                      </p>
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        className="bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative space-y-2"
                      >
                        {/* Company + Role + Link */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-[#0F172A] leading-snug">
                              {app.company_name}
                            </h4>
                            <p className="text-xs font-medium text-[#64748B]">
                              {app.job_title}
                            </p>
                          </div>
                          {app.job_url && (
                            <a
                              href={app.job_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#94A3B8] hover:text-[#4F46E5] p-1 transition-colors shrink-0"
                              title="Open Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Salary Pill */}
                        {app.salary && (
                          <div>
                            <span className="inline-block bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {app.salary}
                            </span>
                          </div>
                        )}

                        {/* Details */}
                        <div className="space-y-1 text-[11px] text-[#64748B]">
                          {app.location && (
                            <div className="flex items-center space-x-1.5">
                              <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
                              <span className="truncate">{app.location}</span>
                            </div>
                          )}
                          {app.recruiter_name && (
                            <div className="flex items-center space-x-1.5">
                              <UserCheck className="w-3 h-3 text-[#4F46E5] shrink-0" />
                              <span className="truncate">Name - {app.recruiter_name}</span>
                            </div>
                          )}
                          {app.platform && (
                            <div className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
                              <span className="font-semibold text-[#334155]">{app.platform}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes snippet */}
                        {app.notes && (
                          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-2 text-[10px] text-[#B45309] leading-tight">
                            <div className="flex items-center space-x-1 font-bold text-[#B45309] uppercase tracking-wider mb-0.5">
                              <FileText className="w-2.5 h-2.5" />
                              <span>NOTES</span>
                            </div>
                            <p className="line-clamp-2">{app.notes}</p>
                          </div>
                        )}

                        {/* Footer: Date + Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-[10px] text-[#64748B] font-medium">
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

                          <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEdit(app)}
                              className="p-1 text-[#94A3B8] hover:text-[#4F46E5] rounded transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(app.id)}
                              className="p-1 text-[#94A3B8] hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
