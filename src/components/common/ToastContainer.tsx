import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  let toasts: any[] = [];
  let dismissToast: (id: string) => void = () => {};

  try {
    const agency = useAgency();
    if (agency) {
      toasts = agency.toasts || [];
      dismissToast = agency.dismissToast || (() => {});
    }
  } catch {
    return null;
  }

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#ffffff] border border-[#e5e5e5] text-[#0a0a0a] p-3.5 rounded-[18px] shadow-[0_0_0_1px_rgba(23,23,23,0.05),0_4px_12px_rgba(0,0,0,0.08)] flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#0a0a0a] shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#e7000b] shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#737373] shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#0a0a0a] shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#0a0a0a]">{toast.title}</div>
              <div className="text-[11px] text-[#737373] mt-0.5 leading-snug">{toast.message}</div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#737373] hover:text-[#0a0a0a] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
