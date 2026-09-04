import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  tenantName?: string;
  brandColor?: string;
  showProgressBar?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading Ankabit LMS Workspace...',
  sublabel = 'Provisioning isolated cloud classroom & database...',
  size = 'full',
  tenantName = 'Ankabit LMS',
  brandColor = '#059669',
  showProgressBar = true,
}) => {
  const isFull = size === 'full';

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
        <div className="w-4 h-4 rounded-full border-2 border-emerald-600/30 border-t-emerald-600 animate-spin shrink-0" />
        {label && <span>{label}</span>}
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-600 border-r-emerald-500 animate-spin" />
          <div className="absolute w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
            {tenantName.charAt(0) || 'A'}
          </div>
        </div>
        <p className="text-xs font-bold text-slate-700">{label}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center font-sans select-none transition-all duration-300 ${
        isFull
          ? 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md text-white'
          : 'p-12 w-full text-slate-800'
      }`}
    >
      {/* Central Animated Orb & Geometry */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulsing Outer Glow Aura */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 animate-ping absolute duration-1000" />
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 blur-xl absolute" />

        {/* Counter-rotating Outer Dash Ring */}
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-400/40 animate-[spin_6s_linear_infinite]" />

        {/* High-speed Inner Gradient Orbit */}
        <div className="w-16 h-16 rounded-full border-3 border-transparent border-t-emerald-400 border-r-teal-300 border-b-emerald-500 animate-spin absolute" />

        {/* Inner Brand Emblem */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-400/50 flex items-center justify-center text-white font-black text-base shadow-xl shadow-emerald-950/40 relative z-10">
          {tenantName.charAt(0) || 'A'}
        </div>
      </div>

      {/* Brand & Loading Status Text */}
      <div className="text-center space-y-1.5 max-w-sm px-4">
        <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{tenantName}</span>
        </div>

        <h3
          className={`font-black tracking-tight ${
            isFull ? 'text-white text-base' : 'text-slate-900 text-sm'
          }`}
        >
          {label}
        </h3>

        {sublabel && (
          <p
            className={`text-xs ${
              isFull ? 'text-slate-400' : 'text-slate-500'
            } leading-relaxed`}
          >
            {sublabel}
          </p>
        )}
      </div>

      {/* Shimmer Progress Indicator Bar */}
      {showProgressBar && (
        <div className="mt-5 w-48 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 relative">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full w-2/3 animate-[indeterminate_1.5s_infinite_ease-in-out]" />
        </div>
      )}

      {/* Islamic Calligraphy Accent */}
      <div className="mt-4 text-[11px] text-emerald-500/80 font-serif" dir="rtl">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>
    </div>
  );
};
