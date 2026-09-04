'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { TenantProvider } from '../src/context/TenantContext';
import { ToastProvider } from '../src/context/ToastContext';
import { PWAInstallToast } from '../src/components/ui/PWAInstallToast';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register PWA Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service worker registration failed:', err));
    }
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <TenantProvider>
          {children}
          <PWAInstallToast />
        </TenantProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
