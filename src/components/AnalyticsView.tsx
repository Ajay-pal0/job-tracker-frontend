import React from 'react';
import type { AnalyticsData, ApplicationStatus } from '../types';
import { STATUS_COLORS } from './GridView';

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
  loading?: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((card) => (
            <div key={card} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-2xs space-y-4 animate-pulse">
              <div className="flex justify-between items-center pb-2">
                <div className="h-5 w-48 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                      <div className="h-4 w-12 bg-slate-200 rounded-md"></div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-2xs space-y-4 animate-pulse">
          <div className="h-5 w-44 bg-slate-200 rounded-md"></div>
          <div className="h-40 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6 mb-6">
      
      {/* Top 2 Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Application Pipeline Breakdown */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"></span>
              Application Pipeline Breakdown
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">
              Total: {analytics.total_applications}
            </span>
          </div>

          <div className="space-y-4">
            {analytics.by_status.map((item) => {
              const statusName = item.status as ApplicationStatus;
              const colorInfo = STATUS_COLORS[statusName] || STATUS_COLORS.Applied;
              return (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorInfo.dot}`}></span>
                      <span className="text-[#1E293B]">{item.status}</span>
                    </div>
                    <span className="text-[#64748B]">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>

                  <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorInfo.dot} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(item.percentage, item.count > 0 ? 4 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applications by Platform / Source */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"></span>
              Applications by Platform / Source
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">
              Platforms
            </span>
          </div>

          <div className="space-y-4">
            {analytics.by_platform.length === 0 ? (
              <p className="text-xs text-[#94A3B8] font-medium py-6 text-center">
                No platform data available yet.
              </p>
            ) : (
              analytics.by_platform.map((item) => (
                <div key={item.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1E293B]">{item.platform}</span>
                    <span className="text-[#64748B]">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>

                  <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4F46E5] transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(item.percentage, item.count > 0 ? 4 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Monthly Trend Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A] tracking-tight mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"></span>
          Monthly Application Trends
        </h3>

        {analytics.by_month.length === 0 ? (
          <p className="text-xs text-[#94A3B8] font-medium py-6 text-center">
            No monthly application data available yet.
          </p>
        ) : (
          <div className="flex items-end gap-3 pt-4 pb-2 h-44 overflow-x-auto no-scrollbar">
            {analytics.by_month.map((item) => {
              const maxCount = Math.max(...analytics.by_month.map((m) => m.count), 1);
              const heightPct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.month} className="flex flex-col items-center flex-1 min-w-[50px] h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#4F46E5] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-[#4F46E5] hover:bg-[#4338CA] rounded-t-lg transition-all"
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                  ></div>
                  <span className="text-[11px] font-semibold text-[#64748B] mt-2 truncate w-full text-center">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
