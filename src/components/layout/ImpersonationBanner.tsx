'use client';

import React, { useState, useEffect } from 'react';
import { Shield, LogOut, ExternalLink, UserCheck } from 'lucide-react';

interface ImpersonationData {
  tenantId?: string;
  subdomain: string;
  name: string;
  role: string;
  startedAt?: string;
}

export const ImpersonationBanner: React.FC = () => {
  const [impersonation, setImpersonation] = useState<ImpersonationData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('ankabit_impersonating');
        if (raw) {
          setImpersonation(JSON.parse(raw));
        }
      } catch (e) {}
    }
  }, []);

  if (!impersonation) return null;

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ankabit_impersonating');
      window.location.href = '/super-admin';
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md sticky top-0 z-[9999] border-b border-amber-900 font-sans select-none">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-amber-900/50">
          <UserCheck className="w-3.5 h-3.5 text-amber-200" />
        </span>
        <span>
          Platform SuperAdmin Impersonation Mode: You are managing <strong className="underline decoration-amber-300">{impersonation.name}</strong> ({impersonation.subdomain}.ankabit.app)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleExit}
          className="px-3 py-1 bg-white text-amber-900 hover:bg-amber-50 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <LogOut className="w-3 h-3 text-amber-900" />
          <span>Exit Impersonation</span>
        </button>
      </div>
    </div>
  );
};
