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

    // Assert strict authentication and authorization
    if (!isAuthenticated || !user) {
      router.push(`/${params.subdomain}/login?redirect=admin`);
      return;
    }

    // Wait for tenant config to finish loading from database
    if (isTenantLoading) return;

    // Verify user belongs to this specific academy workspace
    if (!isUserValidForSubdomain(params.subdomain, tenant?.id)) {
      router.push(`/${params.subdomain}/login?redirect=admin&error=workspace_mismatch`);
      return;
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      router.push(`/${params.subdomain}/lms`);
      return;
    }

    setIsCheckingAuth(false);
  }, [isAuthenticated, user, isAuthLoading, isTenantLoading, params.subdomain, tenant?.id, router, isUserValidForSubdomain]);

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
