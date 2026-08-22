import React from 'react';
import { FileText, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import type { DashboardSummary } from '../types';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  loading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  const cards = [
    {
      title: 'TOTAL APPLICATIONS',
      value: summary?.total_applications ?? 0,
      subtitle: 'Active pipeline',
      trend: '+12% this month',
      icon: FileText,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      title: 'INTERVIEWING',
      value: summary?.interviewing_count ?? 0,
      subtitle: 'Active rounds',
      trend: 'High priority',
      icon: Clock,
      iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    {
      title: 'OFFERS RECEIVED',
      value: summary?.offers_count ?? 0,
      subtitle: 'Ready for review',
      trend: 'Offer stage',
      icon: CheckCircle2,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      title: 'RESPONSE RATE',
      value: `${summary?.response_rate ?? 0}%`,
      subtitle: 'Hear back metric',
      trend: 'Hear-back rate',
      icon: TrendingUp,
      iconBg: 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  {card.title}
                </p>
              </div>

              <div className="flex items-baseline space-x-2">
                {loading ? (
                  <div className="h-7 w-16 bg-slate-200 rounded-lg animate-pulse my-1"></div>
                ) : (
                  <span className="text-[26px] font-extrabold text-[#0F172A] leading-tight tracking-tight group-hover:text-[#4F46E5] transition-colors">
                    {card.value}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1.5 mt-1">
                <span className="text-xs font-medium text-[#64748B]">
                  {card.subtitle}
                </span>
              </div>
            </div>

            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${card.iconBg} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
              <IconComponent className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
