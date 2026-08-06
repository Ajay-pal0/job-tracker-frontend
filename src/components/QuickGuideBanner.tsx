import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';

export const QuickGuideBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-4 mb-6 relative transition-all shadow-xs">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3.5 right-3.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100/50 p-1 rounded-lg transition-colors cursor-pointer"
        title="Dismiss guide"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="text-xs text-indigo-950 pr-6 space-y-1">
          <h4 className="font-bold text-indigo-900 text-xs">
            Quick Guide: How to Edit Notes & Details
          </h4>
          <ul className="list-disc list-inside space-y-0.5 text-indigo-800/90 text-[11px] leading-relaxed">
            <li>
              <strong className="font-semibold text-indigo-900">Editing notes & application details:</strong> Click the ✏️ pencil icon on any row or click directly on any Note to open the full edit dialog.
            </li>
            <li>
              <strong className="font-semibold text-indigo-900">Sorting by Applied Date:</strong> Click the "Date Applied" table header or select Date Applied (Newest / Oldest) from the sort dropdown.
            </li>
            <li>
              <strong className="font-semibold text-indigo-900">Quick Status Changes:</strong> Change status anytime using the inline status dropdown in the Table, Modal, or drag cards in Kanban.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
