'use client';

import React, { useEffect } from 'react';
import { SignInPage } from '../../../src/components/auth/SignInPage';
import { useTenant } from '../../../src/context/TenantContext';

interface TenantLoginPageProps {
  params: { subdomain: string };
}

export default function TenantLoginPage({ params }: TenantLoginPageProps) {
  const { setTenantBySubdomain } = useTenant();

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain]);

  const handleAddToast = (toast: any) => {
    console.log('Login Toast:', toast);
  };

  return <SignInPage onAddToast={handleAddToast} />;
}
