'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { TenantProvider } from '../src/context/TenantContext';
import { ToastContainer, ToastMessage } from '../src/components/ui/Toast';
import { PWAInstallToast } from '../src/components/ui/PWAInstallToast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Register PWA Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service worker registration failed:', err));
    }
  }, []);

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
        <PWAInstallToast />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </TenantProvider>
    </AuthProvider>
  );
}
