import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Application } from '../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  application: Application | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  application,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 text-center">
        
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto shadow-sm">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-lg">
            Delete Application?
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Are you sure you want to delete the job application for{' '}
            <span className="font-bold text-slate-800">
              {application?.job_title || 'this position'}
            </span>{' '}
            at{' '}
            <span className="font-bold text-slate-800">
              {application?.company_name || 'this company'}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-2.5 rounded-xl shadow-md shadow-rose-200 transition-all cursor-pointer text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Application</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
