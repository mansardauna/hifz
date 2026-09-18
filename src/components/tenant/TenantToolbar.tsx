import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { useTranslation } from '../../modules/i18n';
import { MOCK_TENANTS } from '../../services/mockData';
import { Globe, Building2, LayoutDashboard, BookOpen, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';

export const TenantToolbar: React.FC = () => {
  const { tenant, setTenantBySubdomain, activeRole, setActiveRole } = useTenant();
  const { language, setLanguage, supportedLanguages, currentLanguageOption, isRtl } = useTranslation();

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2.5 px-4 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Tenant Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ANKABIT LMS ARCHITECTURE</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 hidden sm:inline">Active Tenant:</span>
            <select
              value={tenant.subdomain}
              onChange={(e) => setTenantBySubdomain(e.target.value)}
              className="bg-slate-800 text-white font-medium px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {Object.values(MOCK_TENANTS).map((t) => (
                <option key={t.subdomain} value={t.subdomain}>
                  {t.name} ({t.subdomain}.ankabit.app)
                </option>
              ))}
            </select>
          </div>

          {/* Color Indicators for Branded Academy Identity */}
          <div className="hidden lg:flex items-center gap-1.5 ms-2 bg-slate-800/80 px-2 py-1 rounded text-[11px] border border-slate-700">
            <span className="text-slate-400">Theme:</span>
            <span
              className="w-3 h-3 rounded-full border border-slate-600 shadow-sm"
              style={{ backgroundColor: tenant.theme.primaryColor }}
              title={`Primary: ${tenant.theme.primaryColor}`}
            />
            <span
              className="w-3 h-3 rounded-full border border-slate-600 shadow-sm"
              style={{ backgroundColor: tenant.theme.secondaryColor }}
              title={`Secondary: ${tenant.theme.secondaryColor}`}
            />
            <span
              className="w-3 h-3 rounded-full border border-slate-600 shadow-sm"
              style={{ backgroundColor: tenant.theme.accentColor }}
              title={`Accent: ${tenant.theme.accentColor}`}
            />
          </div>
        </div>

        {/* Right: View Mode & Multi-Language Selector */}
        <div className="flex items-center gap-2">
          {/* Role Navigation */}
          <div className="bg-slate-800 p-0.5 rounded-lg flex items-center border border-slate-700">
            <button
              onClick={() => setActiveRole('landing')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeRole === 'landing'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin CRM</span>
            </button>
            <button
              onClick={() => setActiveRole('student')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student LMS</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName} ({l.direction.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
