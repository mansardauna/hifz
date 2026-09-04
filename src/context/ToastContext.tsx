import React, { createContext, useContext, useState } from 'react';
import { ToastMessage, ToastType, ToastAction, ToastContainer } from '../components/ui/Toast';

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  success: (title: string, message: string, action?: ToastAction) => void;
  error: (title: string, message: string, action?: ToastAction) => void;
  warning: (title: string, message: string, action?: ToastAction) => void;
  info: (title: string, message: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const duration = toast.duration || 4500;
    
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (title: string, message: string, action?: ToastAction) => {
    addToast({ type: 'success', title, message, action });
  };

  const error = (title: string, message: string, action?: ToastAction) => {
    addToast({ type: 'error', title, message, action });
  };

  const warning = (title: string, message: string, action?: ToastAction) => {
    addToast({ type: 'warning', title, message, action });
  };

  const info = (title: string, message: string, action?: ToastAction) => {
    addToast({ type: 'info', title, message, action });
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        dismissToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      addToast: (t) => console.log('Toast:', t),
      dismissToast: () => {},
      success: (title, message) => console.log('Success Toast:', title, message),
      error: (title, message) => console.error('Error Toast:', title, message),
      warning: (title, message) => console.warn('Warning Toast:', title, message),
      info: (title, message) => console.info('Info Toast:', title, message),
    };
  }
  return context;
};
