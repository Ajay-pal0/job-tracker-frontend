import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Download } from 'lucide-react';
import type { ImportResult } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, duplicateAction: 'skip' | 'update') => Promise<ImportResult>;
  onDownloadSample?: () => void;
  onSuccessRefresh: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onDownloadSample,
  onSuccessRefresh,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update'>('skip');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await onImport(file, duplicateAction);
      setResult(res);
      onSuccessRefresh();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || 'Failed to import file. Please check file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 border border-[#E2E8F0] shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#ECFDF5] text-[#047857] rounded-lg flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-[18px] font-bold text-[#0F172A]">Import Excel / CSV</h3>
              <p className="text-xs text-[#64748B]">Upload job application spreadsheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#334155] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Download Sample Template Banner */}
        {onDownloadSample && !result && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 mb-4 gap-2">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Need a sample template?</p>
              <p className="text-[11px] text-[#64748B]">Download pre-formatted Excel file with example fields</p>
            </div>
            <button
              type="button"
              onClick={onDownloadSample}
              className="flex items-center justify-center space-x-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample</span>
            </button>
          </div>
        )}

        {/* If result is shown */}
        {result ? (
          <div className="space-y-4">
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 text-[#047857] text-xs">
              <div className="flex items-center space-x-2 font-bold text-sm mb-2 text-[#047857]">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span>Import Summary</span>
              </div>
              
              <div className="space-y-2 mt-3 text-xs font-semibold">
                <div className="flex justify-between py-1 border-b border-[#A7F3D0]/60">
                  <span className="text-[#047857]">✓ Records Imported / Updated:</span>
                  <span className="font-bold text-[#0F172A]">{result.imported_count}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#A7F3D0]/60">
                  <span className="text-[#B45309]">⚠ Duplicate Records Found:</span>
                  <span className="font-bold text-[#0F172A]">{result.duplicate_count}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#BE123C]">✖ Invalid Rows Skipped:</span>
                  <span className="font-bold text-[#0F172A]">{result.invalid_count}</span>
                </div>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 max-h-36 overflow-y-auto text-xs text-[#64748B] space-y-1">
                <p className="font-bold text-[#0F172A]">Notes / Errors:</p>
                {result.errors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#334155] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Import Another File</span>
              </button>

              <button
                onClick={onClose}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-indigo-200 hover:border-[#4F46E5] bg-[#EEF2FF]/50 hover:bg-[#EEF2FF] rounded-2xl p-6 text-center transition-all cursor-pointer relative"
            >
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <Upload className="w-8 h-8 text-[#4F46E5] mx-auto mb-2" />
              {file ? (
                <div>
                  <p className="font-bold text-[#0F172A] text-xs">{file.name}</p>
                  <p className="text-[10px] text-[#64748B]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-[#0F172A] text-xs">
                    Click or drag & drop Excel / CSV file
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Supports .xlsx, .xls, .csv files
                  </p>
                </div>
              )}
            </div>

            {/* Duplicate Handling Choice */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
              <label className="block font-bold text-[#0F172A] text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                Duplicate Handling Strategy
              </label>
              <p className="text-[11px] text-[#64748B]">
                Matches existing records on <strong className="text-[#1E293B]">Company + Role + Applied Date</strong>.
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center space-x-2 text-xs text-[#334155] font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="duplicateAction"
                    value="skip"
                    checked={duplicateAction === 'skip'}
                    onChange={() => setDuplicateAction('skip')}
                    className="text-[#4F46E5] focus:ring-[#6366F1]"
                  />
                  <span>Skip duplicates (Keep existing records untouched)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-[#334155] font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="duplicateAction"
                    value="update"
                    checked={duplicateAction === 'update'}
                    onChange={() => setDuplicateAction('update')}
                    className="text-[#4F46E5] focus:ring-[#6366F1]"
                  />
                  <span>Update existing records with new data from file</span>
                </label>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-2 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-3 text-[#BE123C] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!file || loading}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processing File...' : 'Upload & Import'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
