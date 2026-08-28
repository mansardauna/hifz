'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTenant } from '../../../src/context/TenantContext';
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
  const { setTenantBySubdomain, tenant } = useTenant();
  const router = useRouter();

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain]);

  const handleAddToast = (toast: any) => {
    console.log('Admin Toast:', toast);
  };

  const handleViewLiveSite = () => {
    router.push(`/${params.subdomain}`);
  };

  return (
    <AdminDashboard
      onAddToast={handleAddToast}
      onViewLiveSite={handleViewLiveSite}
    />
  );
}
