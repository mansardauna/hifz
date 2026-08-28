import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, Sparkles } from 'lucide-react';
import { CrescentVector } from './IslamicArtDecoration';

export const PWAInstallToast: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);

  useEffect(() => {
    // Check if user already dismissed install toast recently
    const dismissedTime = localStorage.getItem('hifz_pwa_install_dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) {
        return; // Don't prompt if dismissed less than 3 days ago
      }
    }

    // Check if app is already running in standalone display mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
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
    localStorage.setItem('hifz_pwa_install_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 md:left-auto md:right-6 md:max-w-sm z-50 font-sans animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 relative overflow-hidden">
        {/* Islamic Star Accent Overlay */}
        <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
          <CrescentVector className="w-16 h-16 text-amber-400" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Dismiss installation prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 relative z-10">
          {/* App Icon Preview */}
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-xl shadow-lg border border-emerald-500 shrink-0 mt-0.5">
            ح
          </div>

          <div className="space-y-1 pr-4 min-w-0">
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest font-display">
              <Sparkles className="w-3 h-3" />
              <span>Install Hifz Mobile App</span>
            </div>
            <h4 className="font-extrabold text-sm text-white leading-tight font-display">
              Add Hifz to Home Screen
            </h4>
            <p className="text-xs text-emerald-200/90 leading-normal">
              Quick 1-tap access to Tajweed reader, audio looper & homework recorder!
            </p>
          </div>
        </div>

        {/* iOS Manual Instructions Modal / Drawer */}
        {showIOSInstructions ? (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 text-emerald-100 animate-in fade-in">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Share className="w-4 h-4" /> iOS Installation Instructions:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
              <li>Tap the <span className="font-bold text-white">Share button</span> <Share className="w-3 h-3 inline text-emerald-400" /> at the bottom of Safari.</li>
              <li>Scroll down and select <span className="font-bold text-white">Add to Home Screen</span> <PlusSquare className="w-3 h-3 inline text-amber-400" />.</li>
              <li>Tap <span className="font-bold text-emerald-400">Add</span> in top right.</li>
            </ol>
            <button
              onClick={handleDismiss}
              className="w-full mt-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
            >
              Got It!
            </button>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              onClick={handleDismiss}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1.5 cursor-pointer"
            >
              Not Now
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/40 uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>{isIOS ? 'Instructions' : 'Install App'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
