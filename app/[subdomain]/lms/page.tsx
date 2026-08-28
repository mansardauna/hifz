'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTenant } from '../../../src/context/TenantContext';

const StudentLMS = dynamic(
  () =>
    import('../../../src/components/lms/StudentLMS').then(
      (mod) => mod.StudentLMS
    ),
  { ssr: false }
);

interface LmsPageProps {
  params: { subdomain: string };
}

export default function TenantLmsPage({ params }: LmsPageProps) {
  const { setTenantBySubdomain } = useTenant();

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain]);

  const handleAddToast = (toast: any) => {
    console.log('LMS Toast:', toast);
  };

  return <StudentLMS onAddToast={handleAddToast} />;
}
