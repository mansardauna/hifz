import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../modules/i18n';
import { Globe, LogOut, LayoutDashboard, Menu, X, GraduationCap, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  const { tenant } = useTenant();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, supportedLanguages, currentLanguageOption, isRtl, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  const isAr = language === 'ar' || isRtl;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Academy Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/${tenant.subdomain}`)}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity text-start cursor-pointer"
          >
            {tenant.logoUrl || (tenant.faviconUrl && (tenant.faviconUrl.startsWith('http') || tenant.faviconUrl.startsWith('/'))) ? (
              <img
                src={tenant.logoUrl || tenant.faviconUrl}
                alt={tenant.name}
                className="w-9 h-9 rounded-xl object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-200 flex items-center justify-center bg-[var(--color-primary,#047857)] text-white font-black text-sm shrink-0">
                {tenant.name ? tenant.name.charAt(0) : 'A'}
              </div>
            )}
            <div>
              <h1 className={`font-bold text-slate-900 text-sm sm:text-base leading-tight font-display ${isAr ? 'font-arabic text-lg' : ''}`}>
                {isAr ? (tenant.nameAr || tenant.name) : tenant.name}
              </h1>
              <p className="text-[11px] text-emerald-700 font-mono hidden sm:block">{tenant.customDomain || `${tenant.subdomain}.edu`}</p>
            </div>
          </button>
        </div>

        {/* Desktop Center Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button onClick={() => router.push(`/${tenant.subdomain}`)} className="hover:text-slate-900 transition-colors cursor-pointer">
            {t('nav.overview')}
          </button>
          <a href="#courses" className="hover:text-slate-900 transition-colors">
            {t('nav.curriculum')}
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#admissions" className="hover:text-slate-900 transition-colors">
            {t('nav.crm')}
          </a>
        </nav>

        {/* Right Actions: Multi-Language, Auth & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Multi-Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Change Language"
            >
              <span>{currentLanguageOption.flag}</span>
              <span className="font-semibold">{currentLanguageOption.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div
                className="absolute right-0 rtl:left-0 rtl:right-auto mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1"
                onClick={() => setIsLangMenuOpen(false)}
              >
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      language === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Auth Controls */}
          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  if (user.role === 'admin') router.push(`/${tenant.subdomain}/admin`);
                  else router.push(`/${tenant.subdomain}/lms`);
                }}
                className="px-3 py-1.5 rounded-md bg-emerald-800 text-white text-sm font-medium shadow-sm hover:bg-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer"
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
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isAr ? 'بوابة الطلاب' : 'Student Portal'}
              </button>

              <a
                href="#admissions"
                className="px-3.5 py-1.5 rounded-md text-sm font-medium text-white shadow-sm transition-all bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
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
          <nav className="flex flex-col space-y-2 text-sm font-medium font-display text-slate-700">
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
                  className="w-full py-2 px-3 rounded-md bg-emerald-800 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-300" />
                  <span>{user.role === 'admin' ? 'Open Admin CRM' : 'Open Student LMS'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
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
                  className="w-full py-2 px-3 rounded-md border border-slate-300 text-slate-800 text-sm font-medium flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>{isAr ? 'تسجيل دخول الطلاب' : 'Student Portal Login'}</span>
                </button>
                <a
                  href="#admissions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 px-3 rounded-md bg-emerald-700 text-white text-sm font-medium text-center shadow-sm"
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
