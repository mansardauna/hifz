import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500/50 text-white'
              : toast.type === 'error'
              ? 'bg-rose-900/90 border-rose-500/50 text-white'
              : 'bg-slate-900/90 border-slate-700 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 me-3 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 me-3 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white transition-colors ms-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
