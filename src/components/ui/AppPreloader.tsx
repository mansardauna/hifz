'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTenant } from '../../context/TenantContext';
import { AnkabitSpiderIcon } from '../brand/AnkabitLogo';

interface AppPreloaderProps {
  forceShow?: boolean;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ forceShow }) => {
  const pathname = usePathname();
  const { tenant, language, isLoading: tenantLoading } = useTenant();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const isAr = language === 'ar';

  // Determine if this is a platform-level page or a tenant-level page
  const isPlatform =
    !pathname ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/create-academy' ||
    pathname === '/super-admin';

  // Extract tenant customization
  const customConfig = tenant?.preloaderCustomization;
  const brandColor = tenant?.theme?.primaryColor || '#059669';
  const customText = isAr
    ? customConfig?.customTextAr || tenant?.nameAr || tenant?.name
    : customConfig?.customText || tenant?.name || 'Loading';

  // Smooth route-change and initial mount transition
  useEffect(() => {
    setIsVisible(true);
    setIsFadingOut(false);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 280);
      return () => clearTimeout(hideTimer);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, tenant?.subdomain]);

  if (!isVisible && !forceShow && !tenantLoading) return null;

  return (
    <div
      role="status"
      aria-label="Loading page"
      className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none transition-all duration-300 ${
        isFadingOut ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.16)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
    >
      {/* Floating Branded Badge Card */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center min-w-[220px] max-w-[280px] text-center space-y-3 pointer-events-auto transform transition-transform duration-300">
        {/* Animated Brand Orb */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Pulse Glow */}
          <div
            className="w-14 h-14 rounded-2xl opacity-25 animate-ping absolute"
            style={{ backgroundColor: isPlatform ? '#059669' : brandColor }}
          />

          {/* Smooth Rotating Orbit Ring */}
          <div
            className="w-14 h-14 rounded-2xl border-2 border-transparent animate-spin absolute"
            style={{
              borderTopColor: isPlatform ? '#10b981' : brandColor,
              borderRightColor: isPlatform ? '#059669' : `${brandColor}88`,
            }}
          />

          {/* Central Logo / Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md relative z-10 overflow-hidden"
            style={{ backgroundColor: isPlatform ? '#047857' : brandColor }}
          >
            {isPlatform ? (
              <AnkabitSpiderIcon size={20} color="#FFFFFF" />
            ) : tenant?.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{tenant?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
        </div>

        {/* Brand Text & Status */}
        <div className="space-y-0.5 min-w-0 px-2">
          <h4 className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
            {isPlatform ? 'Ankabit LMS' : tenant?.name || 'Academy'}
          </h4>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
            {isPlatform
              ? 'Loading workspace...'
              : customText}
          </p>
        </div>

        {/* Minimal Gradient Progress Line */}
        <div className="w-28 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full animate-[indeterminate_1.2s_infinite_ease-in-out]"
            style={{
              backgroundColor: isPlatform ? '#059669' : brandColor,
              width: '60%',
            }}
          />
        </div>
      </div>
    </div>
  );
};
