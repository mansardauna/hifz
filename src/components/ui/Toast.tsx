import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, ExternalLink } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  action?: ToastAction;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const requestBrowserNotificationPermission = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  }
  return false;
};

export const sendBrowserNotification = (title: string, body: string, icon = '/icons/icon-192x192.png') => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
      });
    } catch {
      // Fallback or ignore in unsupported environments
    }
  }
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-emerald-950/95 border-emerald-500/40 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          accent: 'bg-emerald-500',
        };
      case 'error':
        return {
          container: 'bg-rose-950/95 border-rose-500/40 text-white',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          accent: 'bg-rose-500',
        };
      case 'warning':
        return {
          container: 'bg-amber-950/95 border-amber-500/40 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          accent: 'bg-amber-500',
        };
      case 'info':
      default:
        return {
          container: 'bg-slate-900/95 border-slate-700 text-white',
          icon: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
          accent: 'bg-sky-500',
        };
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none font-sans"
      aria-live="assertive"
    >
      {toasts.map((toast) => {
        const style = getToastStyles(toast.type);

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 relative overflow-hidden ${style.container}`}
          >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent}`} />

            {/* Severity Icon */}
            {style.icon}

            {/* Content Body */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs leading-tight tracking-wide uppercase text-slate-200">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-100 mt-1 leading-relaxed">{toast.message}</p>

              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(toast.id);
                  }}
                  className="mt-2 text-xs font-bold underline hover:opacity-80 text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{toast.action.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
