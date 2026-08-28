import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { Globe, LogOut, LayoutDashboard, Menu, X, GraduationCap, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  const { tenant, language, toggleLanguage } = useTenant();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const isAr = language === 'ar';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Academy Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/${tenant.subdomain}`)}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity text-start cursor-pointer"
          >
            <div className="w-9 h-9 rounded-md overflow-hidden shadow-xs border border-slate-200 flex items-center justify-center bg-emerald-50 text-emerald-800 font-bold text-lg shrink-0">
              {tenant.faviconUrl}
            </div>
            <div>
              <h1 className={`font-bold text-slate-900 text-sm sm:text-base leading-tight font-display ${isAr ? 'font-arabic text-lg' : ''}`}>
                {isAr ? tenant.nameAr : tenant.name}
              </h1>
              <p className="text-[11px] text-emerald-700 font-mono hidden sm:block">{tenant.subdomain}.hifz.app</p>
            </div>
          </button>
        </div>

        {/* Desktop Center Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button onClick={() => router.push(`/${tenant.subdomain}`)} className="hover:text-slate-900 transition-colors cursor-pointer">
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <a href="#courses" className="hover:text-slate-900 transition-colors">
            {isAr ? 'المناهج والدورات' : 'Programs'}
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            {isAr ? 'الرسوم والاشتراك' : 'Tuition Plans'}
          </a>
          <a href="#admissions" className="hover:text-slate-900 transition-colors">
            {isAr ? 'القبول والتسجيل' : 'Admissions'}
          </a>
        </nav>

        {/* Right Actions: Language, Auth & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'EN' : 'العربية'}</span>
          </button>

          {/* Desktop Auth Controls */}
          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  if (user.role === 'admin') router.push(`/${tenant.subdomain}/admin`);
                  else router.push(`/${tenant.subdomain}/lms`);
                }}
                className="px-3 py-1.5 rounded-md bg-emerald-800 text-white text-xs font-bold shadow-sm hover:bg-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
                <span>{user.role === 'admin' ? 'Admin Portal' : 'Student LMS'}</span>
              </button>

              <button
                onClick={logout}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => router.push(`/${tenant.subdomain}/login`)}
                className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isAr ? 'بوابة الطلاب' : 'Student Portal'}
              </button>

              <a
                href="#admissions"
                className="px-3.5 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-all bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
              >
                {isAr ? 'قدم الان' : 'Apply Now'}
              </a>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-md">
          <nav className="flex flex-col space-y-2 text-xs font-bold font-display text-slate-700">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push(`/${tenant.subdomain}`);
              }}
              className="text-start py-1.5 hover:text-emerald-700"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <a
              href="#courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-emerald-700"
            >
              {isAr ? 'المناهج والدورات' : 'Programs'}
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-emerald-700"
            >
              {isAr ? 'الرسوم والاشتراك' : 'Tuition Plans'}
            </a>
            <a
              href="#admissions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 hover:text-emerald-700"
            >
              {isAr ? 'القبول والتسجيل' : 'Admissions'}
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (user.role === 'admin') router.push(`/${tenant.subdomain}/admin`);
                    else router.push(`/${tenant.subdomain}/lms`);
                  }}
                  className="w-full py-2 px-3 rounded-md bg-emerald-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-300" />
                  <span>{user.role === 'admin' ? 'Open Admin CRM' : 'Open Student LMS'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push(`/${tenant.subdomain}/login`);
                  }}
                  className="w-full py-2 px-3 rounded-md border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>{isAr ? 'تسجيل دخول الطلاب' : 'Student Portal Login'}</span>
                </button>
                <a
                  href="#admissions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 px-3 rounded-md bg-emerald-700 text-white text-xs font-bold text-center shadow-sm"
                >
                  {isAr ? 'تقديم طلب القبول' : 'Apply for Admission'}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
