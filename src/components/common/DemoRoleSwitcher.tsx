import React from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { detectTenantNicheType } from '../../services/classroomCustomizationService';
import { ShieldCheck, GraduationCap, User, Sparkles } from 'lucide-react';

import { isDemoTenant } from '../../lib/tenants';

interface DemoRoleSwitcherProps {
  onRoleSwitched?: (role: UserRole) => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onRoleSwitched }) => {
  const { tenant } = useTenant();
  const { user, switchDemoRole } = useAuth();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';

  // ONLY render in Demo sandbox; Live accounts automatically detect verified user role from JWT/DB
  const isDemo = isDemoTenant(tenant?.subdomain);

  if (!isDemo) {
    return null;
  }

  const currentRole = user?.role || 'admin';

  const roles: { id: UserRole; label: string; icon: any; title: string }[] = isQuran
    ? [
        { id: 'admin', label: 'Admin (Director)', icon: ShieldCheck, title: 'Ustadhah Fatima Al-Zahra' },
        { id: 'teacher', label: 'Teacher (Ustadhah)', icon: GraduationCap, title: 'Ustadhah Zainab Al-Fayez' },
        { id: 'student', label: 'Student (Qariyah)', icon: User, title: 'Maryam Al-Mansoor' },
      ]
    : [
        { id: 'admin', label: 'Admin (Director)', icon: ShieldCheck, title: 'Director Robert Chen' },
        { id: 'teacher', label: 'Teacher (Instructor)', icon: GraduationCap, title: 'Dr. Sarah Jenkins' },
        { id: 'student', label: 'Student (Learner)', icon: User, title: 'Alex Morgan' },
      ];

  const handleSelectRole = (role: UserRole) => {
    switchDemoRole(role);
    if (onRoleSwitched) {
      onRoleSwitched(role);
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs mb-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span className="font-bold text-slate-200">Demo Role Switcher:</span>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Test interactive features as different roles in this sandbox (hidden in live portals)
        </span>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelectRole(r.id)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
              title={`Switch persona to ${r.title}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
