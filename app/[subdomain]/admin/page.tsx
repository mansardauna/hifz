'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTenant } from '../../../src/context/TenantContext';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'next/navigation';

// Dynamic import with SSR disabled for GrapesJS DOM Canvas
const AdminDashboard = dynamic(
  () =>
    import('../../../src/components/admin/AdminDashboard').then(
      (mod) => mod.AdminDashboard
    ),
  { ssr: false }
);

interface AdminPageProps {
  params: { subdomain: string };
}

export default function TenantAdminPage({ params }: AdminPageProps) {
  const { setTenantBySubdomain } = useTenant();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain, setTenantBySubdomain]);

  useEffect(() => {
    // Check authentication and authorization
    const isDemo = ['hifz-academy', 'al-furqan', 'code-academy', 'school-demo', 'madrasat-demo', 'demo'].includes(params.subdomain);
    if (!isDemo && (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'superadmin'))) {
      router.push(`/${params.subdomain}/login?redirect=admin`);
      return;
    }
    setIsCheckingAuth(false);
  }, [isAuthenticated, user, params.subdomain, router]);

  const handleAddToast = (toast: any) => {
    console.log('Admin Toast:', toast);
  };

  const handleViewLiveSite = () => {
    router.push(`/${params.subdomain}`);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-300">Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      onAddToast={handleAddToast}
      onViewLiveSite={handleViewLiveSite}
    />
  );
}
