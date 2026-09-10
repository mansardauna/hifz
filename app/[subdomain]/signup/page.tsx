'use client';

import React, { useEffect } from 'react';
import { SignUpPage } from '../../../src/components/auth/SignUpPage';
import { useTenant } from '../../../src/context/TenantContext';

interface TenantSignUpPageProps {
  params: { subdomain: string };
}

export default function TenantSignUpPage({ params }: TenantSignUpPageProps) {
  const { setTenantBySubdomain } = useTenant();

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain]);

  const handleAddToast = (toast: any) => {
    console.log('SignUp Toast:', toast);
  };

  return <SignUpPage onAddToast={handleAddToast} />;
}
