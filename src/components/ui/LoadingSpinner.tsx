import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading Hifz Portal...',
  size = 'full',
}) => {
  const isFull = size === 'full';

  return (
    <div
      className={`flex flex-col items-center justify-center font-sans ${
        isFull
          ? 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm text-white'
          : 'p-12 w-full text-slate-800'
      }`}
    >
      {/* Animated Islamic Emblem & Spinning Glow Ring */}
      <div className="relative flex items-center justify-center mb-5">
        {/* Pulsing Outer Glow */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 animate-ping absolute" />

        {/* Rotating Emerald Arc Ring */}
        <div className="w-16 h-16 rounded-full border-3 border-emerald-500/30 border-t-amber-400 border-r-emerald-400 animate-spin" />

        {/* Inner Calligraphic Emblem */}
        <div className="absolute w-10 h-10 rounded-full bg-emerald-900 border border-emerald-600 flex items-center justify-center text-amber-300 font-bold font-display text-lg shadow-lg">
          ح
        </div>
      </div>

      {/* Label and Arabic Subtitle */}
      <p
        className={`font-bold font-display tracking-wide ${
          isFull ? 'text-white text-sm' : 'text-slate-900 text-sm'
        }`}
      >
        {label}
      </p>
      <p
        className={`text-xs mt-1 ${
          isFull ? 'text-emerald-400' : 'text-emerald-700 font-semibold'
        }`}
        style={{ fontFamily: "'Amiri', serif" }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
    </div>
  );
};
