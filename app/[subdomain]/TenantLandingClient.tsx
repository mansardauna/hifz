'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '../../src/context/TenantContext';
import { LandingPage } from '../../src/components/landing/LandingPage';
import { ToastContainer, ToastMessage } from '../../src/components/ui/Toast';

interface TenantLandingClientProps {
  subdomain: string;
}

export function TenantLandingClient({ subdomain }: TenantLandingClientProps) {
  const { setTenantBySubdomain } = useTenant();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (subdomain) {
      setTenantBySubdomain(subdomain);
    }
  }, [subdomain]);

  const handleAddToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      handleDismissToast(id);
    }, toast.duration || 5000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <LandingPage onAddToast={handleAddToast} />
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </>
  );
}
