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
    <text x="270" y="26" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="600">hifz-academy.ankabit.app</text>

    {/* Left Sidebar */}
    <rect x="0" y="44" width="180" height="436" fill="#0F172A" />
    <rect x="20" y="68" width="140" height="32" rx="8" fill="#1E293B" />
    <circle cx="36" cy="84" r="8" fill="#10B981" />
    <text x="52" y="88" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="700">Hifz Academy</text>

    {/* Sidebar Nav Items */}
    <rect x="20" y="120" width="140" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
    <rect x="28" y="130" width="8" height="8" rx="2" fill="#10B981" />
    <text x="44" y="138" fill="#10B981" fontSize="11" fontFamily="sans-serif" fontWeight="600">Quran Classroom</text>

    {/* Custom Branded Footer in Sidebar */}
    <rect x="20" y="430" width="140" height="24" rx="4" fill="#1E293B" />
    <text x="32" y="446" fill="#64748B" fontSize="8" fontFamily="sans-serif" fontWeight="700">POWERED BY ANKABIT LMS</text>

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
    {/* Central Cloud Node: Ankabit LMS */}
    <rect width="600" height="360" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
    
    <circle cx="300" cy="180" r="58" fill="#0F172A" />
    <circle cx="300" cy="180" r="46" fill="#1E293B" />
    <text x="252" y="174" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="800">ANKABIT LMS</text>
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
    <text x="78" y="74" fill="#047857" fontSize="9" fontFamily="sans-serif">hifz-academy.ankabit.app</text>
    <text x="78" y="88" fill="#64748B" fontSize="9" fontFamily="sans-serif">114 Surahs • 520 Students</text>

    {/* Tenant 2: Code Academy */}
    <rect x="370" y="32" width="200" height="76" rx="10" fill="#EFF6FF" stroke="#93C5FD" />
    <circle cx="396" cy="70" r="14" fill="#2563EB" />
    <text x="418" y="60" fill="#1E3A8A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Code Academy</text>
    <text x="418" y="74" fill="#2563EB" fontSize="9" fontFamily="sans-serif">code-academy.ankabit.app</text>
    <text x="418" y="88" fill="#64748B" fontSize="9" fontFamily="sans-serif">Web Dev Sandbox • 640 Students</text>

    {/* Tenant 3: Al-Furqan Islamic School */}
    <rect x="30" y="252" width="200" height="76" rx="10" fill="#F8FAFC" stroke="#CBD5E1" />
    <circle cx="56" cy="290" r="14" fill="#0D9488" />
    <text x="78" y="280" fill="#0F172A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Al-Furqan Academy</text>
    <text x="78" y="294" fill="#64748B" fontSize="9" fontFamily="sans-serif">al-furqan.ankabit.app</text>
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
    <text x="126" y="154" fill="#059669" fontSize="10" fontFamily="sans-serif" fontWeight="600">Ankabit LMS Platform</text>
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

/**
 * Madrasat Islamic Art Vector Illustration (Quran Rehal, Audio Looper & Wax Stamp)
 */
export const MadrasatArtIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 540 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="540" height="320" rx="16" fill="#064E3B" />
    {/* Geometric decorative background */}
    <g opacity="0.12" stroke="#A7F3D0" strokeWidth="1.5">
      <circle cx="270" cy="160" r="120" />
      <circle cx="270" cy="160" r="80" />
      <rect x="210" y="100" width="120" height="120" rx="10" transform="rotate(45 270 160)" />
      <rect x="210" y="100" width="120" height="120" rx="10" />
    </g>

    {/* Center Rehal Stand & Open Mushaf */}
    <rect x="120" y="50" width="300" height="170" rx="12" fill="#FFFFFF" stroke="#D1FAE5" strokeWidth="2" />
    {/* Mushaf Header */}
    <path d="M120 62C120 55.3726 125.373 50 132 50H408C414.627 50 420 55.3726 420 62V82H120V62Z" fill="#047857" />
    <text x="270" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily="serif" fontWeight="bold">سُورَةُ المُلْكِ • تَبَارَكَ ٱلَّذِي بِيَدِهِ ٱلْمُلْكُ</text>

    {/* Ayah Lines */}
    <line x1="140" y1="105" x2="400" y2="105" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" />
    <text x="270" y="125" textAnchor="middle" fill="#065F46" fontSize="15" fontFamily="serif" fontWeight="bold">ٱلَّذِي خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا</text>
    <line x1="140" y1="145" x2="400" y2="145" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" />

    {/* Audio Waveform Bar */}
    <rect x="140" y="165" width="260" height="38" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
    <circle cx="160" cy="184" r="10" fill="#059669" />
    <path d="M158 179L164 184L158 189V179Z" fill="#FFFFFF" />
    {/* Sound waves */}
    <rect x="182" y="176" width="3" height="16" rx="1.5" fill="#059669" />
    <rect x="190" y="172" width="3" height="24" rx="1.5" fill="#059669" />
    <rect x="198" y="178" width="3" height="12" rx="1.5" fill="#059669" />
    <rect x="206" y="170" width="3" height="28" rx="1.5" fill="#059669" />
    <rect x="214" y="175" width="3" height="18" rx="1.5" fill="#059669" />
    <rect x="222" y="173" width="3" height="22" rx="1.5" fill="#059669" />
    <rect x="230" y="180" width="3" height="8" rx="1.5" fill="#059669" />
    <text x="310" y="188" fill="#047857" fontSize="10" fontFamily="monospace" fontWeight="bold">02:14 / 04:30 • Looper 3x</text>

    {/* Left Floating Badge: Sheikh Sanad Stamp */}
    <rect x="40" y="180" width="130" height="90" rx="10" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="2" />
    <circle cx="65" cy="210" r="14" fill="#D97706" />
    <path d="M60 210L64 214L71 206" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <text x="86" y="206" fill="#92400E" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Sanad Verified</text>
    <text x="86" y="220" fill="#B45309" fontSize="8" fontFamily="sans-serif">Hafs &apos;an &apos;Asim</text>
    <rect x="52" y="238" width="106" height="18" rx="4" fill="#FEF3C7" />
    <text x="105" y="250" textAnchor="middle" fill="#92400E" fontSize="8" fontFamily="sans-serif" fontWeight="bold">AUTHENTIC IJAZAH</text>

    {/* Right Floating Badge: Student Recitation Evaluation */}
    <rect x="370" y="180" width="130" height="90" rx="10" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
    <circle cx="395" cy="210" r="14" fill="#059669" />
    <text x="395" y="214" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">98</text>
    <text x="416" y="206" fill="#065F46" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Oral Score</text>
    <text x="416" y="220" fill="#047857" fontSize="8" fontFamily="sans-serif">Mumtaz (Excellent)</text>
    <rect x="382" y="238" width="106" height="18" rx="4" fill="#ECFDF5" />
    <text x="435" y="250" textAnchor="middle" fill="#065F46" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Makharij 5/5 ★</text>
  </svg>
);

/**
 * Code Academy Art Vector Illustration (Monaco Editor, Live Terminal & Compiler)
 */
export const CodeAcademyArtIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 540 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="540" height="320" rx="16" fill="#0F172A" />
    
    {/* Editor Window */}
    <rect x="30" y="25" width="480" height="270" rx="12" fill="#1E293B" stroke="#334155" />
    {/* Window Titlebar */}
    <path d="M30 37C30 30.3726 35.3726 25 42 25H498C504.627 25 510 30.3726 510 37V55H30V37Z" fill="#0F172A" />
    <circle cx="50" cy="40" r="4" fill="#EF4444" />
    <circle cx="62" cy="40" r="4" fill="#F59E0B" />
    <circle cx="74" cy="40" r="4" fill="#10B981" />
    <rect x="180" y="32" width="180" height="16" rx="4" fill="#1E293B" />
    <text x="270" y="44" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">algorithm.ts — Monaco Sandbox</text>

    {/* Code Area */}
    <text x="50" y="80" fill="#64748B" fontSize="10" fontFamily="monospace">01</text>
    <text x="75" y="80" fill="#F43F5E" fontSize="10" fontFamily="monospace">import</text>
    <text x="120" y="80" fill="#38BDF8" fontSize="10" fontFamily="monospace">&#123; createOptimistic &#125;</text>
    <text x="270" y="80" fill="#F43F5E" fontSize="10" fontFamily="monospace">from</text>
    <text x="305" y="80" fill="#34D399" fontSize="10" fontFamily="monospace">&apos;react&apos;</text>

    <text x="50" y="100" fill="#64748B" fontSize="10" fontFamily="monospace">02</text>
    <text x="75" y="100" fill="#818CF8" fontSize="10" fontFamily="monospace">export function</text>
    <text x="180" y="100" fill="#FBBF24" fontSize="10" fontFamily="monospace">evaluateStudentSubmission</text>
    <text x="350" y="100" fill="#94A3B8" fontSize="10" fontFamily="monospace">(code: string) &#123;</text>

    <text x="50" y="120" fill="#64748B" fontSize="10" fontFamily="monospace">03</text>
    <text x="95" y="120" fill="#818CF8" fontSize="10" fontFamily="monospace">const</text>
    <text x="135" y="120" fill="#38BDF8" fontSize="10" fontFamily="monospace">testResults</text>
    <text x="215" y="120" fill="#F43F5E" fontSize="10" fontFamily="monospace">=</text>
    <text x="230" y="120" fill="#FBBF24" fontSize="10" fontFamily="monospace">runAutomatedAssertions</text>
    <text x="390" y="120" fill="#94A3B8" fontSize="10" fontFamily="monospace">(code);</text>

    <text x="50" y="140" fill="#64748B" fontSize="10" fontFamily="monospace">04</text>
    <text x="95" y="140" fill="#F43F5E" fontSize="10" fontFamily="monospace">return</text>
    <text x="145" y="140" fill="#34D399" fontSize="10" fontFamily="monospace">&#123; passed: true, score: 100 &#125;;</text>

    <text x="50" y="160" fill="#64748B" fontSize="10" fontFamily="monospace">05</text>
    <text x="75" y="160" fill="#94A3B8" fontSize="10" fontFamily="monospace">&#125;</text>

    {/* Integrated Terminal Panel */}
    <rect x="45" y="180" width="450" height="95" rx="8" fill="#020617" stroke="#1E293B" />
    <text x="60" y="200" fill="#10B981" fontSize="9" fontFamily="monospace">✓ Test Suite Passed: 14/14 unit test assertions</text>
    <text x="60" y="218" fill="#38BDF8" fontSize="9" fontFamily="monospace">→ Runtime: 24ms • Memory Allocation: 12.4 MB</text>
    <text x="60" y="236" fill="#FBBF24" fontSize="9" fontFamily="monospace">★ Instructor Evaluation: Clean Modular Architecture (Score: 100/100)</text>
    <text x="60" y="254" fill="#94A3B8" fontSize="9" fontFamily="monospace">sandbox@ankabit-compiler:~$ _</text>
  </svg>
);

/**
 * School SIS Art Vector Illustration (Gradebook, Attendance & GPA Matrix)
 */
export const SchoolSisArtIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 540 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="540" height="320" rx="16" fill="#4C1D95" />
    
    {/* Decorative Soft Backdrop */}
    <g opacity="0.15" stroke="#C4B5FD" strokeWidth="1.5">
      <circle cx="270" cy="160" r="140" />
      <rect x="190" y="80" width="160" height="160" rx="20" />
    </g>

    {/* Main SIS Card */}
    <rect x="40" y="30" width="460" height="260" rx="14" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="2" />
    
    {/* Card Header */}
    <rect x="40" y="30" width="460" height="46" rx="14" fill="#6D28D9" />
    <text x="65" y="58" fill="#FFFFFF" fontSize="12" fontFamily="sans-serif" fontWeight="bold">School Academic SIS • Term 1 Performance Roster</text>
    <rect x="410" y="42" width="75" height="22" rx="6" fill="#8B5CF6" />
    <text x="447" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="sans-serif" fontWeight="bold">GPA 3.96 / 4.0</text>

    {/* Roster Table */}
    {/* Row 1 */}
    <rect x="60" y="90" width="420" height="36" rx="6" fill="#F5F3FF" />
    <text x="75" y="112" fill="#5B21B6" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Zayd Al-Mansoor</text>
    <text x="210" y="112" fill="#6D28D9" fontSize="10" fontFamily="sans-serif">Mathematics: A+ (98%)</text>
    <text x="340" y="112" fill="#047857" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Attendance: 99%</text>
    <rect x="440" y="98" width="30" height="18" rx="4" fill="#EDE9FE" />
    <text x="455" y="111" textAnchor="middle" fill="#6D28D9" fontSize="9" fontWeight="bold">Rank 1</text>

    {/* Row 2 */}
    <rect x="60" y="134" width="420" height="36" rx="6" fill="#FFFFFF" stroke="#EDE9FE" />
    <text x="75" y="156" fill="#1E293B" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Fatima Al-Zahra</text>
    <text x="210" y="156" fill="#6D28D9" fontSize="10" fontFamily="sans-serif">Arabic Grammar: A (95%)</text>
    <text x="340" y="156" fill="#047857" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Attendance: 97%</text>
    <rect x="440" y="142" width="30" height="18" rx="4" fill="#EDE9FE" />
    <text x="455" y="155" textAnchor="middle" fill="#6D28D9" fontSize="9" fontWeight="bold">Rank 2</text>

    {/* Row 3 */}
    <rect x="60" y="178" width="420" height="36" rx="6" fill="#F5F3FF" />
    <text x="75" y="200" fill="#5B21B6" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Tariq Ibn Ziyad</text>
    <text x="210" y="200" fill="#6D28D9" fontSize="10" fontFamily="sans-serif">Computer Science: A+ (100%)</text>
    <text x="340" y="200" fill="#047857" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Attendance: 100%</text>
    <rect x="440" y="186" width="30" height="18" rx="4" fill="#EDE9FE" />
    <text x="455" y="199" textAnchor="middle" fill="#6D28D9" fontSize="9" fontWeight="bold">Rank 1</text>

    {/* Bottom Summary Bar */}
    <rect x="60" y="226" width="420" height="46" rx="8" fill="#EDE9FE" />
    <text x="80" y="252" fill="#5B21B6" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Automated Report Cards Ready</text>
    <text x="320" y="252" fill="#6D28D9" fontSize="10" fontFamily="sans-serif">PDF Download & WhatsApp Sent ✓</text>
  </svg>
);

