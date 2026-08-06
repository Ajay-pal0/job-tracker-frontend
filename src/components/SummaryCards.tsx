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
      subtitle: 'Active search',
      icon: FileText,
      iconBg: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    },
    {
      title: 'INTERVIEWING',
      value: summary?.interviewing_count ?? 0,
      subtitle: 'In active rounds',
      icon: Clock,
      iconBg: 'bg-[#FAF5FF] text-[#7E22CE] border border-[#E9D5FF]',
    },
    {
      title: 'OFFERS RECEIVED',
      value: summary?.offers_count ?? 0,
      subtitle: 'Ready for review',
      icon: CheckCircle2,
      iconBg: 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]',
    },
    {
      title: 'RESPONSE RATE',
      value: `${summary?.response_rate ?? 0}%`,
      subtitle: 'Hear back metric',
      icon: TrendingUp,
      iconBg: 'bg-[#EEF2FF] text-[#4F46E5] border border-indigo-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-[24px] font-bold text-[#0F172A] leading-tight tracking-tight">
                  {loading ? '...' : card.value}
                </span>
              </div>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                {card.subtitle}
              </p>
            </div>

            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center ${card.iconBg} shrink-0`}>
              <IconComponent className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
