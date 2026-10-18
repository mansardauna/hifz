'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SuperAdminDashboard = dynamic(
  () =>
    import('../../src/components/superadmin/SuperAdminDashboard').then(
      (mod) => mod.SuperAdminDashboard
    ),
  { ssr: false }
);

export default function SuperAdminPage() {
  return <SuperAdminDashboard />;
}
