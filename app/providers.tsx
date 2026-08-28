'use client';

import React, { useState } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { TenantProvider } from '../src/context/TenantContext';
import { ToastContainer, ToastMessage } from '../src/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AuthProvider>
      <TenantProvider>
        {children}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </TenantProvider>
    </AuthProvider>
  );
}
