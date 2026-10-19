'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const SuperAdminDashboard = dynamic(
  () =>
    import('../../src/components/superadmin/SuperAdminDashboard').then(
      (mod) => mod.SuperAdminDashboard
    ),
  { ssr: false }
);

export default function SuperAdminPage() {
  const router = useRouter();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkSetupStatus() {
      try {
        const res = await fetch('/api/setup');
        const data = await res.json();
        // If system setup is not completed or no superadmin exists yet, navigate to /setup
        if (data && data.isSetupCompleted === false && data.superAdminExists === false) {
          if (isMounted) {
            router.replace('/setup');
            return;
          }
        }
      } catch (_e) {
        // Fallback: render dashboard normally if inspection fails
      } finally {
        if (isMounted) {
          setIsCheckingSetup(false);
        }
      }
    }

    checkSetupStatus();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSetup) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Checking platform initialization status...</p>
        </div>
      </div>
    );
  }

  return <SuperAdminDashboard />;
}
