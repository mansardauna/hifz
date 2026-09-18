'use client';

import React, { useEffect } from 'react';
import { I18nProvider } from '../src/modules/i18n';
import { AuthProvider } from '../src/context/AuthContext';
import { TenantProvider } from '../src/context/TenantContext';
import { ToastProvider } from '../src/context/ToastContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { PWAInstallToast } from '../src/components/ui/PWAInstallToast';
import { AppPreloader } from '../src/components/ui/AppPreloader';

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
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <TenantProvider>
            <NotificationProvider>
              <AppPreloader />
              {children}
              <PWAInstallToast />
            </NotificationProvider>
          </TenantProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
