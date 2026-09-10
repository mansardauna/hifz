'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { AnkabitSpiderIcon } from '../brand/AnkabitLogo';

export const PWAInstallToast: React.FC = () => {
  const pathname = usePathname();
  const { tenant } = useTenant();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);

  // Check if current page is platform-level or a specific academy subdomain
  const isPlatform =
    !pathname ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/create-academy' ||
    pathname === '/super-admin';

  const appName = isPlatform ? 'Ankabit LMS' : (tenant?.name || 'Academy App');
  const appBadge = isPlatform ? 'Ankabit Platform' : (tenant?.tagline || 'Mobile Academy Portal');
  const brandColor = isPlatform ? '#059669' : (tenant?.theme?.primaryColor || '#059669');

  useEffect(() => {
    // Check if user already dismissed install toast recently
    const dismissedTime = localStorage.getItem('ankabit_pwa_install_dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) {
        return; // Don't prompt if dismissed less than 3 days ago
      }
    }

    // Check if app is already running in standalone display mode (installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      return;
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect mobile viewport or mobile user agent
    const isMobile = window.innerWidth < 768 || /android|iphone|ipad|ipod|mobile/i.test(userAgent);

    if (isIosDevice && isMobile) {
      // Delay prompt slightly for mobile iOS
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }

    // Capture Chrome / Android / Edge native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isMobile) {
        setTimeout(() => setIsVisible(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('ankabit_pwa_install_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 md:left-auto md:right-6 md:max-w-md z-50 font-sans animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/60 relative overflow-hidden ring-1 ring-white/10">
        {/* Ambient Subtle Glow */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: brandColor }}
        />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Dismiss installation prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 relative z-10">
          {/* App Logo / Icon Preview */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg border border-white/15 shrink-0 overflow-hidden"
            style={{ backgroundColor: brandColor }}
          >
            {isPlatform ? (
              <AnkabitSpiderIcon size={24} color="#FFFFFF" />
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
              <span className="text-white font-extrabold">{tenant?.name?.charAt(0) || 'A'}</span>
            )}
          </div>

          <div className="space-y-1 pr-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span className="truncate">{appBadge}</span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-white leading-tight">
              Add {appName} to Home Screen
            </h4>
            <p className="text-xs text-slate-300 leading-normal line-clamp-2">
              {isPlatform
                ? 'Quick 1-tap mobile access to your academies, builder tools & analytics.'
                : 'Fast 1-tap access to live WebRTC classrooms, courses, assignments & notifications.'}
            </p>
          </div>
        </div>

        {/* iOS Manual Instructions Modal / Drawer */}
        {showIOSInstructions ? (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2.5 text-slate-200 animate-in fade-in">
            <p className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Share className="w-4 h-4" /> iOS Installation Steps:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
              <li>
                Tap the <span className="font-bold text-white">Share button</span>{' '}
                <Share className="w-3.5 h-3.5 inline text-emerald-400" /> in Safari's bottom toolbar.
              </li>
              <li>
                Scroll down and select <span className="font-bold text-white">Add to Home Screen</span>{' '}
                <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400" />.
              </li>
              <li>
                Tap <span className="font-bold text-emerald-400">Add</span> in the top-right corner.
              </li>
            </ol>
            <button
              onClick={handleDismiss}
              className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Got It!</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              onClick={handleDismiss}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1.5 cursor-pointer transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={handleInstallClick}
              style={{ backgroundColor: brandColor }}
              className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer border border-white/20 uppercase tracking-wider active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>{isIOS ? 'Instructions' : 'Install App'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

