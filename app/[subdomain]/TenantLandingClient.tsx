'use client';

import React, { useEffect } from 'react';
import { useTenant } from '../../src/context/TenantContext';
import { LandingPage } from '../../src/components/landing/LandingPage';

interface TenantLandingClientProps {
  subdomain: string;
}

export function TenantLandingClient({ subdomain }: TenantLandingClientProps) {
  const { setTenantBySubdomain } = useTenant();

  useEffect(() => {
    if (subdomain) {
      setTenantBySubdomain(subdomain);
    }
  }, [subdomain]);

  const handleAddToast = (toast: any) => {
    console.log('Toast:', toast);
  };

  return <LandingPage onAddToast={handleAddToast} />;
}
