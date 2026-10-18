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
  const { setTenantBySubdomain, tenant, isLoading: isTenantLoading } = useTenant();
  const { user, isAuthenticated, isLoading: isAuthLoading, isUserValidForSubdomain } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain, setTenantBySubdomain]);

  useEffect(() => {
    // Wait for auth context to finish hydrating from localStorage
    if (isAuthLoading) return;

    // Assert strict authentication
    if (!isAuthenticated || !user) {
      router.push(`/${params.subdomain}/login?redirect=lms`);
      return;
    }

    // Wait for tenant config to finish loading from database
    if (isTenantLoading) return;

    // Verify user belongs to this specific academy workspace
    if (!isUserValidForSubdomain(params.subdomain, tenant?.id)) {
      router.push(`/${params.subdomain}/login?redirect=lms&error=workspace_mismatch`);
      return;
    }

    if (user.role === 'admin' || user.role === 'superadmin') {
      router.push(`/${params.subdomain}/admin`);
      return;
    }

    setIsCheckingAuth(false);
  }, [isAuthenticated, user, isAuthLoading, isTenantLoading, params.subdomain, tenant?.id, router, isUserValidForSubdomain]);

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
