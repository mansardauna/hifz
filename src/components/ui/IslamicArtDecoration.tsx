import React from 'react';

// SVG 8-Point Islamic Geometric Star Pattern (Khatam An-Nabuwwah)
export const IslamicStarPattern: React.FC<{ className?: string }> = ({ className = 'w-full h-full text-emerald-500/10' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <pattern id="islamic-star-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="currentColor" />
      <rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 1" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#islamic-star-grid)" />
  </svg>
);

// SVG 2D Art Illustration: Arabesque Mihrab Archway Frame
export const IslamicArchVector: React.FC<{ className?: string }> = ({ className = 'w-24 h-24 text-amber-500/80' }) => (
  <svg className={className} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Arch */}
    <path
      d="M10 150 V60 C10 30 35 10 60 10 C85 10 110 30 110 60 V150"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Inner Pointed Arch Ornament */}
    <path
      d="M20 150 V65 C20 40 40 22 60 18 C80 22 100 40 100 65 V150"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 2"
    />
    {/* Keystar Pinnacle */}
    <circle cx="60" cy="18" r="6" fill="currentColor" />
    <path d="M60 4 L63 12 L71 15 L63 18 L60 26 L57 18 L49 15 L57 12 Z" fill="currentColor" />
  </svg>
);

// SVG 2D Art Illustration: Quran Rahl Wooden Bookstand
export const QuranRahlVector: React.FC<{ className?: string }> = ({ className = 'w-20 h-20 text-emerald-600' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Open Book Pages */}
    <path d="M15 35 C30 25 45 35 50 40 C55 35 70 25 85 35 V60 C70 50 55 60 50 65 C45 60 30 50 15 60 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 40 V65" stroke="currentColor" strokeWidth="2" />
    {/* Page Lines */}
    <line x1="22" y1="42" x2="43" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="48" x2="43" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="57" y1="38" x2="78" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="57" y1="44" x2="78" y2="48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Crossed Wooden Rahl Legs */}
    <path d="M25 60 L75 90 M75 60 L25 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="75" r="4" fill="currentColor" />
  </svg>
);

// SVG 2D Art Illustration: Golden Crescent & Stars
export const CrescentVector: React.FC<{ className?: string }> = ({ className = 'w-12 h-12 text-amber-400' }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 10 C30 10 15 25 15 45 C15 65 30 75 50 75 C35 70 28 58 28 42 C28 26 38 15 50 10 Z"
      fill="currentColor"
    />
    <path d="M60 20 L62 26 L68 28 L62 30 L60 36 L58 30 L52 28 L58 26 Z" fill="currentColor" />
    <path d="M42 58 L43.5 62 L48 63.5 L43.5 65 L42 69 L40.5 65 L36 63.5 L40.5 62 Z" fill="currentColor" fillOpacity="0.8" />
  </svg>
);

// SVG 2D Art Illustration: Sanad Ijazah Scroll & Gold Seal
export const SanadScrollVector: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 text-emerald-500' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Parchment Diploma Scroll */}
    <rect x="20" y="15" width="60" height="70" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.5" />
    <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="30" y1="48" x2="60" y2="48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Golden Wax Seal with Ribbons */}
    <circle cx="65" cy="65" r="12" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    <path d="M60 75 L56 90 L65 85 L74 90 L70 75" fill="#D97706" />
    <path d="M65 58 L67 63 L72 65 L67 67 L65 72 L63 67 L58 65 L63 63 Z" fill="white" />
  </svg>
);
