import React from 'react';

/**
 * Modern 2D Vector Illustrations & Visual Assets for TechMadrasah
 * Razor-sharp SVG components with Islamic geometric aesthetic & modern SaaS minimalism
 * Illustrates TechMadrasah powering Hifz Academy, Code Academy, and other institutions.
 */

export const HeroDashboardIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 800 480" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background Soft Backdrop */}
    <rect width="800" height="480" rx="16" fill="#F8FAFC" />
    <rect x="0.5" y="0.5" width="799" height="479" rx="15.5" stroke="#E2E8F0" />

    {/* Top Window Bar */}
    <path d="M0 16C0 7.16344 7.16344 0 16 0H784C792.837 0 800 7.16344 800 16V44H0V16Z" fill="#FFFFFF" />
    <line x1="0" y1="44" x2="800" y2="44" stroke="#E2E8F0" />
    <circle cx="24" cy="22" r="5" fill="#EF4444" />
    <circle cx="40" cy="22" r="5" fill="#F59E0B" />
    <circle cx="56" cy="22" r="5" fill="#10B981" />
    <rect x="220" y="12" width="360" height="20" rx="6" fill="#F1F5F9" />
    <text x="270" y="26" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="600">hifz-academy.techmadrasah.app</text>

    {/* Left Sidebar */}
    <rect x="0" y="44" width="180" height="436" fill="#0F172A" />
    <rect x="20" y="68" width="140" height="32" rx="8" fill="#1E293B" />
    <circle cx="36" cy="84" r="8" fill="#10B981" />
    <text x="52" y="88" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="700">Hifz Academy</text>

    {/* Sidebar Nav Items */}
    <rect x="20" y="120" width="140" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
    <rect x="28" y="130" width="8" height="8" rx="2" fill="#10B981" />
    <text x="44" y="138" fill="#10B981" fontSize="11" fontFamily="sans-serif" fontWeight="600">Quran Classroom</text>

    <rect x="20" y="156" width="140" height="28" rx="6" fill="transparent" />
    <rect x="28" y="166" width="8" height="8" rx="2" fill="#64748B" />
    <text x="44" y="174" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="500">Live Video Studio</text>

    <rect x="20" y="192" width="140" height="28" rx="6" fill="transparent" />
    <rect x="28" y="202" width="8" height="8" rx="2" fill="#64748B" />
    <text x="44" y="210" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="500">Coding Sandbox</text>

    <rect x="20" y="228" width="140" height="28" rx="6" fill="transparent" />
    <rect x="28" y="238" width="8" height="8" rx="2" fill="#64748B" />
    <text x="44" y="246" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="500">Tuition & Invoices</text>

    {/* Custom Branded Footer in Sidebar */}
    <rect x="20" y="430" width="140" height="24" rx="4" fill="#1E293B" />
    <text x="32" y="446" fill="#64748B" fontSize="8" fontFamily="sans-serif" fontWeight="700">POWERED BY TECHMADRASAH</text>

    {/* Main Viewport Content */}
    <rect x="204" y="68" width="572" height="180" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
    
    {/* Quran Reader Surah Banner */}
    <path d="M204 80C204 73.3726 209.373 68 216 68H764C770.627 68 776 73.3726 776 80V120H204V80Z" fill="#047857" />
    <text x="228" y="98" fill="#A7F3D0" fontSize="11" fontFamily="sans-serif" fontWeight="700">SURAH AL-FATIHAT (THE OPENING) • AYAH 1 - 7</text>
    <text x="680" y="100" fill="#FFFFFF" fontSize="18" fontFamily="serif" fontWeight="700">سُورَةُ ٱلْفَاتِحَةِ</text>

    {/* Calligraphy Ayah Line 1 */}
    <rect x="228" y="136" width="524" height="42" rx="8" fill="#F8FAFC" />
    <circle cx="248" cy="157" r="12" fill="#E2E8F0" />
    <text x="245" y="161" fill="#0F172A" fontSize="11" fontFamily="sans-serif" fontWeight="700">1</text>
    <text x="420" y="162" fill="#0F172A" fontSize="18" fontFamily="serif" fontWeight="700">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</text>

    {/* Calligraphy Ayah Line 2 */}
    <rect x="228" y="188" width="524" height="42" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
    <circle cx="248" cy="209" r="12" fill="#10B981" />
    <text x="245" y="213" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="700">2</text>
    <text x="380" y="214" fill="#065F46" fontSize="18" fontFamily="serif" fontWeight="700">ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</text>

    {/* Bottom Dual Cards */}
    {/* Audio Looper Studio */}
    <rect x="204" y="264" width="276" height="196" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
    <rect x="224" y="284" width="32" height="32" rx="8" fill="#0F172A" />
    <path d="M236 295L246 300L236 305V295Z" fill="#FFFFFF" />
    <text x="266" y="296" fill="#0F172A" fontSize="12" fontFamily="sans-serif" fontWeight="700">Live Reciter Looper</text>
    <text x="266" y="310" fill="#64748B" fontSize="10" fontFamily="sans-serif">Mishary Rashid Alafasy • 128kbps</text>
    
    {/* Sound Wave Visualization */}
    <rect x="224" y="332" width="6" height="24" rx="3" fill="#10B981" />
    <rect x="234" y="324" width="6" height="40" rx="3" fill="#10B981" />
    <rect x="244" y="320" width="6" height="48" rx="3" fill="#047857" />
    <rect x="254" y="328" width="6" height="32" rx="3" fill="#10B981" />
    <rect x="264" y="336" width="6" height="16" rx="3" fill="#10B981" />
    <rect x="274" y="322" width="6" height="44" rx="3" fill="#047857" />
    <rect x="284" y="316" width="6" height="56" rx="3" fill="#047857" />
    <rect x="294" y="326" width="6" height="36" rx="3" fill="#10B981" />
    <rect x="304" y="334" width="6" height="20" rx="3" fill="#10B981" />
    <rect x="314" y="320" width="6" height="48" rx="3" fill="#047857" />
    <rect x="324" y="328" width="6" height="32" rx="3" fill="#10B981" />

    {/* Metric Badge */}
    <rect x="224" y="396" width="236" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="240" y="416" fill="#0F172A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Tajweed Accuracy</text>
    <text x="240" y="430" fill="#10B981" fontSize="10" fontFamily="sans-serif" fontWeight="600">98.4% • Ghunnah & Madd Verified</text>

    {/* Right Live Video Session Card */}
    <rect x="500" y="264" width="276" height="196" rx="12" fill="#0F172A" />
    <rect x="516" y="280" width="116" height="76" rx="8" fill="#1E293B" stroke="#334155" />
    <circle cx="574" cy="312" r="14" fill="#3B82F6" />
    <text x="526" y="348" fill="#FFFFFF" fontSize="9" fontFamily="sans-serif" fontWeight="600">Ustadh Dr. Abdul</text>

    <rect x="644" y="280" width="116" height="76" rx="8" fill="#1E293B" stroke="#334155" />
    <circle cx="702" cy="312" r="14" fill="#10B981" />
    <text x="654" y="348" fill="#FFFFFF" fontSize="9" fontFamily="sans-serif" fontWeight="600">Zayd (Student)</text>

    {/* LiveKit Cloud WebRTC SFU Status */}
    <rect x="516" y="372" width="244" height="32" rx="8" fill="#1E293B" />
    <circle cx="532" cy="388" r="4" fill="#10B981" />
    <text x="544" y="392" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif" fontWeight="600">LiveKit SFU 1080p • 18ms Latency</text>

    <rect x="516" y="414" width="116" height="28" rx="6" fill="#047857" />
    <text x="546" y="432" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif" fontWeight="700">Whiteboard</text>
    <rect x="644" y="414" width="116" height="28" rx="6" fill="#334155" />
    <text x="676" y="432" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif" fontWeight="700">Mute All</text>
  </svg>
);

export const MultiTenantNetworkIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 600 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Central Cloud Node: TechMadrasah */}
    <rect width="600" height="360" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
    
    <circle cx="300" cy="180" r="58" fill="#0F172A" />
    <circle cx="300" cy="180" r="46" fill="#1E293B" />
    <text x="248" y="174" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="800">TECHMADRASAH</text>
    <text x="256" y="190" fill="#10B981" fontSize="9" fontFamily="sans-serif" fontWeight="700">ACADEMY OS</text>

    {/* Connecting Curved Lines */}
    <path d="M300 122V60H140" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M300 122V60H460" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M300 238V300H140" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M300 238V300H460" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />

    {/* Tenant 1: Hifz Quran Academy */}
    <rect x="30" y="32" width="200" height="76" rx="10" fill="#F0FDF4" stroke="#86EFAC" />
    <circle cx="56" cy="70" r="14" fill="#10B981" />
    <text x="78" y="60" fill="#065F46" fontSize="11" fontFamily="sans-serif" fontWeight="700">Hifz Quran Academy</text>
    <text x="78" y="74" fill="#047857" fontSize="9" fontFamily="sans-serif">hifz-academy.techmadrasah.app</text>
    <text x="78" y="88" fill="#64748B" fontSize="9" fontFamily="sans-serif">114 Surahs • 520 Students</text>

    {/* Tenant 2: Code Academy */}
    <rect x="370" y="32" width="200" height="76" rx="10" fill="#EFF6FF" stroke="#93C5FD" />
    <circle cx="396" cy="70" r="14" fill="#2563EB" />
    <text x="418" y="60" fill="#1E3A8A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Code Academy</text>
    <text x="418" y="74" fill="#2563EB" fontSize="9" fontFamily="sans-serif">code-academy.techmadrasah.app</text>
    <text x="418" y="88" fill="#64748B" fontSize="9" fontFamily="sans-serif">Web Dev Sandbox • 640 Students</text>

    {/* Tenant 3: Al-Furqan Islamic School */}
    <rect x="30" y="252" width="200" height="76" rx="10" fill="#F8FAFC" stroke="#CBD5E1" />
    <circle cx="56" cy="290" r="14" fill="#0D9488" />
    <text x="78" y="280" fill="#0F172A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Al-Furqan Academy</text>
    <text x="78" y="294" fill="#64748B" fontSize="9" fontFamily="sans-serif">al-furqan.techmadrasah.app</text>
    <text x="78" y="308" fill="#10B981" fontSize="9" fontFamily="sans-serif">Sanad Ijazah Verified</text>

    {/* Tenant 4: Bayyinah Arabic Institute */}
    <rect x="370" y="252" width="200" height="76" rx="10" fill="#FAF5FF" stroke="#D8B4FE" />
    <circle cx="396" cy="290" r="14" fill="#A855F7" />
    <text x="418" y="280" fill="#581C87" fontSize="11" fontFamily="sans-serif" fontWeight="700">Bayyinah Institute</text>
    <text x="418" y="294" fill="#9333EA" fontSize="9" fontFamily="sans-serif">arabic.bayyinah.com</text>
    <text x="418" y="308" fill="#64748B" fontSize="9" fontFamily="sans-serif">Custom Domain • 890 Students</text>
  </svg>
);

export const AuthHeroIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Geometric Aesthetic Backdrop */}
    <circle cx="250" cy="250" r="220" fill="#0F172A" />
    <circle cx="250" cy="250" r="180" fill="#1E293B" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />
    
    {/* Geometric 8-Pointed Star Accent */}
    <g transform="translate(250 250) scale(0.6) translate(-100 -100)">
      <rect x="20" y="20" width="160" height="160" rx="12" fill="#047857" fillOpacity="0.4" stroke="#10B981" strokeWidth="2" />
      <rect x="20" y="20" width="160" height="160" rx="12" fill="#047857" fillOpacity="0.4" stroke="#10B981" strokeWidth="2" transform="rotate(45 100 100)" />
    </g>

    {/* Floating Card: Multi-Tenant Status */}
    <rect x="70" y="110" width="220" height="90" rx="12" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="100" cy="145" r="16" fill="#10B981" />
    <path d="M94 145L98 149L106 141" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="126" y="140" fill="#0F172A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Dedicated Isolation</text>
    <text x="126" y="154" fill="#059669" fontSize="10" fontFamily="sans-serif" fontWeight="600">TechMadrasah Platform</text>
    <rect x="126" y="164" width="144" height="6" rx="3" fill="#E2E8F0" />
    <rect x="126" y="164" width="138" height="6" rx="3" fill="#10B981" />

    {/* Floating Card: Live WebRTC Classroom */}
    <rect x="210" y="290" width="230" height="100" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
    <circle cx="240" cy="325" r="16" fill="#3B82F6" />
    <text x="266" y="322" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="700">Live Classroom Studio</text>
    <text x="266" y="336" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">LiveKit WebRTC Cloud SFU</text>
    <rect x="230" y="356" width="190" height="22" rx="6" fill="#1E293B" />
    <circle cx="242" cy="367" r="3" fill="#10B981" />
    <text x="252" y="371" fill="#E2E8F0" fontSize="9" fontFamily="sans-serif" fontWeight="600">100% Client Data Privacy</text>
  </svg>
);
