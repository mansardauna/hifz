'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTenant } from '../../../src/context/TenantContext';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';

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
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain, setTenantBySubdomain]);

  useEffect(() => {
    const isDemo = ['hifz-academy', 'al-furqan', 'code-academy', 'school-demo', 'madrasat-demo', 'demo'].includes(params.subdomain);
    if (!isDemo && !isAuthenticated) {
      router.push(`/${params.subdomain}/login?redirect=lms`);
      return;
    }
    setIsCheckingAuth(false);
  }, [isAuthenticated, params.subdomain, router]);

  const handleAddToast = (toast: any) => {
    console.log('LMS Toast:', toast);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-300">Loading Student Portal...</span>
        </div>
      </div>
    );
  }

  return <StudentLMS onAddToast={handleAddToast} />;
}
