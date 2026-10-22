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
      <text x="270" y="26" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="600">hifz-academy.liwanlms.com</text>

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
      <text x="78" y="74" fill="#047857" fontSize="9" fontFamily="sans-serif">hifz-academy.liwanlms.com</text>
    <text x="78" y="88" fill="#64748B" fontSize="9" fontFamily="sans-serif">114 Surahs • 520 Students</text>

    {/* Tenant 2: Code Academy */}
    <rect x="370" y="32" width="200" height="76" rx="10" fill="#EFF6FF" stroke="#93C5FD" />
    <circle cx="396" cy="70" r="14" fill="#2563EB" />
    <text x="418" y="60" fill="#1E3A8A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Code Academy</text>
      <text x="418" y="74" fill="#2563EB" fontSize="9" fontFamily="sans-serif">code-academy.liwanlms.com</text>
    <text x="418" y="88" fill="#64748B" fontSize="9" fontFamily="sans-serif">Web Dev Sandbox • 640 Students</text>

    {/* Tenant 3: Al-Furqan Islamic School */}
    <rect x="30" y="252" width="200" height="76" rx="10" fill="#F8FAFC" stroke="#CBD5E1" />
    <circle cx="56" cy="290" r="14" fill="#0D9488" />
    <text x="78" y="280" fill="#0F172A" fontSize="11" fontFamily="sans-serif" fontWeight="700">Al-Furqan Academy</text>
      <text x="78" y="294" fill="#64748B" fontSize="9" fontFamily="sans-serif">al-furqan.liwanlms.com</text>
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
    <text x="435" y="250" textAnchor="middle" fill="#065F46" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Makharij 5/5 Rating</text>
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
    <text x="60" y="200" fill="#10B981" fontSize="9" fontFamily="monospace">Test Suite Passed: 14/14 unit test assertions</text>
    <text x="60" y="218" fill="#38BDF8" fontSize="9" fontFamily="monospace">→ Runtime: 24ms • Memory Allocation: 12.4 MB</text>
    <text x="60" y="236" fill="#FBBF24" fontSize="9" fontFamily="monospace">Instructor Evaluation: Clean Modular Architecture (Score: 100/100)</text>
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
    <text x="320" y="252" fill="#6D28D9" fontSize="10" fontFamily="sans-serif">PDF Download & WhatsApp Sent (Verified)</text>
  </svg>
);

/**
 * Image 3 Vector Asset: Student standing beside a laptop with floating lock/security badge
 */
export const AuthLaptopSecurityIllustration: React.FC<{ className?: string }> = ({ className = "w-full max-w-md h-auto" }) => (
  <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Decorative Background Waves & Shapes */}
    <ellipse cx="240" cy="350" rx="200" ry="24" fill="#F3F4F6" />
    <path d="M40 180 C80 120, 160 140, 200 80 C240 20, 360 40, 420 120 C460 180, 440 260, 380 320 C320 360, 160 380, 80 320 Z" fill="#F8FAFC" opacity="0.8" />
    <circle cx="80" cy="90" r="14" fill="#E2E8F0" opacity="0.6" />
    <circle cx="410" cy="180" r="8" fill="#CBD5E1" opacity="0.5" />

    {/* Laptop Computer */}
    <g transform="translate(140, 140)">
      {/* Laptop Screen Body */}
      <rect x="30" y="30" width="220" height="140" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
      <rect x="40" y="40" width="200" height="120" rx="6" fill="#F8FAFC" />
      
      {/* Screen Content / Dashboard preview */}
      <rect x="50" y="50" width="50" height="10" rx="3" fill="#E2E8F0" />
      <rect x="50" y="66" width="180" height="1" fill="#E2E8F0" />
      <rect x="50" y="74" width="70" height="30" rx="4" fill="#EEF2F6" />
      <rect x="58" y="82" width="40" height="6" rx="2" fill="#94A3B8" />
      <rect x="130" y="74" width="90" height="30" rx="4" fill="#EEF2F6" />
      <rect x="138" y="82" width="60" height="6" rx="2" fill="#94A3B8" />
      <path d="M50 140 C80 120, 120 135, 160 115 C190 100, 210 110, 225 95" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Laptop Base / Keyboard */}
      <path d="M10 170 H270 L285 186 C286 188 284 190 282 190 H-2 C-4 190 -6 188 -5 186 L10 170 Z" fill="#334155" />
      <rect x="110" y="172" width="60" height="4" rx="2" fill="#64748B" />
      <ellipse cx="140" cy="184" rx="25" ry="3" fill="#1E293B" />
    </g>

    {/* Floating Golden/Accent Security Lock Badge */}
    <g transform="translate(300, 110)">
      <circle cx="36" cy="36" r="36" fill="#F59E0B" fillOpacity="0.15" />
      <circle cx="36" cy="36" r="30" fill="#F59E0B" />
      {/* Lock Shackle */}
      <path d="M28 34 V26 C28 21.58 31.58 18 36 18 C40.42 18 44 21.58 44 26 V34" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lock Body */}
      <rect x="24" y="32" width="24" height="20" rx="4" fill="#FFFFFF" />
      <circle cx="36" cy="41" r="2.5" fill="#D97706" />
      <path d="M36 43.5 V46" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Student Vector Figure Standing on the Left */}
    <g transform="translate(60, 120)">
      {/* Legs */}
      <path d="M52 170 L48 240 L38 240" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 170 L72 240 L82 240" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Torso & Clothes (Ankabit Emerald Brand) */}
      <path d="M42 100 C42 85, 78 85, 78 100 L76 170 H44 Z" fill="#059669" />
      
      {/* Left Arm (Relaxed) */}
      <path d="M42 102 C32 118, 28 140, 34 156" stroke="#059669" strokeWidth="7" strokeLinecap="round" />

      {/* Right Arm (Pointing / Gesturing towards Laptop) */}
      <path d="M78 102 C90 120, 105 130, 122 135" stroke="#059669" strokeWidth="7" strokeLinecap="round" />
      <circle cx="123" cy="135" r="4.5" fill="#FDE68A" />

      {/* Head & Hair */}
      <circle cx="60" cy="62" r="16" fill="#FDE68A" />
      <path d="M44 60 C44 45, 76 45, 76 60 C76 64, 74 72, 70 76 C65 72, 60 72, 54 74 C48 72, 44 68, 44 60 Z" fill="#1E293B" />
    </g>
  </svg>
);

/**
 * Image 1 Vector Asset: 3D Laptop Mockup with Overlapping Floating Growth Card
 */
export const LaptopHeroMockupIllustration: React.FC<{ className?: string }> = ({ className = "w-full max-w-4xl h-auto" }) => (
  <div className={`relative mx-auto ${className}`}>
    {/* Floating "Monthly Growth" Metric Card on Top Left */}
    <div className="absolute -top-6 -left-4 sm:-top-8 sm:-left-8 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 dark:border-slate-800 transition-transform duration-300 hover:scale-105">
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-xs font-semibold capitalize tracking-wider text-slate-500 dark:text-slate-400">Monthly Growth</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
          +18.4% ↗
        </span>
      </div>
      {/* Sparkline Waves */}
      <svg width="140" height="42" viewBox="0 0 140 42" fill="none" className="overflow-visible">
        <path d="M0 32 C20 32, 35 15, 55 22 C75 28, 90 8, 110 16 C125 22, 132 5, 140 2" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M0 38 C20 38, 40 25, 60 30 C80 34, 100 18, 120 22 C130 24, 136 12, 140 10" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>Active Learners</span>
        <span className="font-semibold text-slate-900 dark:text-white">12,480</span>
      </div>
    </div>

    {/* Laptop Device Frame */}
    <div className="relative mx-auto rounded-t-3xl bg-slate-900 p-3 sm:p-4 shadow-2xl ring-1 ring-slate-800 border-t border-x border-slate-700">
      {/* Screen Bezel & Camera */}
      <div className="relative rounded-2xl bg-slate-950 overflow-hidden ring-1 ring-slate-800">
        {/* Screen Top Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="bg-slate-800/80 text-slate-400 text-[10px] font-mono px-6 py-1 rounded-full border border-slate-700/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            portal.liwanlms.com/dashboard
          </div>
          <div className="w-10" />
        </div>

        {/* Dashboard Preview Inside Screen */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white min-h-[260px] sm:min-h-[380px] grid grid-cols-12 gap-4 select-none">
          {/* Mini Left Sidebar */}
          <div className="col-span-3 sm:col-span-2 space-y-2 hidden sm:block">
            <div className="h-6 w-20 bg-blue-600 rounded-md" />
            <div className="space-y-1.5 pt-3">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-blue-600/30 text-blue-400 rounded w-full flex items-center px-2 text-[9px] font-semibold">Overview</div>
              <div className="h-4 bg-slate-800/60 rounded w-full" />
              <div className="h-4 bg-slate-800/60 rounded w-full" />
              <div className="h-4 bg-slate-800/60 rounded w-full" />
            </div>
          </div>

          {/* Center Analytics */}
          <div className="col-span-12 sm:col-span-10 space-y-4">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 sm:p-3">
                <div className="text-[10px] text-slate-400 font-medium">Students</div>
                <div className="text-base sm:text-xl font-semibold text-white mt-1">2,840</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 sm:p-3">
                <div className="text-[10px] text-slate-400 font-medium">Live Halaqahs</div>
                <div className="text-base sm:text-xl font-semibold text-emerald-400 mt-1">18 Active</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 sm:p-3">
                <div className="text-[10px] text-slate-400 font-medium">Tuition Yield</div>
                <div className="text-base sm:text-xl font-semibold text-blue-400 mt-1">$48,290</div>
              </div>
            </div>

            {/* Central Chart Mockup */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-slate-200">Academy Engagement & Recitations</div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">Real-time</div>
              </div>
              {/* Bars */}
              <div className="h-28 sm:h-40 flex items-end justify-between gap-1 sm:gap-2 pt-2 border-b border-slate-700/60">
                {[45, 60, 35, 78, 92, 65, 84, 52, 95, 88, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${i === 8 ? 'bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`} 
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1.5">
                <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Laptop Base Lip / Keyboard Bottom */}
    <div className="relative mx-auto w-full h-4 sm:h-5 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-xl shadow-xl flex items-center justify-center">
      <div className="w-16 sm:w-24 h-1.5 bg-slate-600 rounded-full" />
    </div>
  </div>
);

/**
 * Image 2 Vector Asset: 3D Student Character Avatar with Cap and Floating Achievement Badges
 */
export const Student3DAvatarIllustration: React.FC<{ className?: string }> = ({ className = "w-36 h-36" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Glowing Soft Backdrop */}
      <circle cx="100" cy="100" r="70" fill="#D1FAE5" fillOpacity="0.5" />

      {/* Student Character Base */}
      {/* Body / Shoulders */}
      <path d="M45 185 C45 140, 155 140, 155 185 Z" fill="#047857" />
      <path d="M75 145 L100 170 L125 145 Z" fill="#ECFDF5" />

      {/* Head */}
      <ellipse cx="100" cy="105" rx="36" ry="42" fill="#FDE68A" />
      
      {/* Eyes & Friendly Smile */}
      <circle cx="88" cy="102" r="4.5" fill="#1E293B" />
      <circle cx="112" cy="102" r="4.5" fill="#1E293B" />
      <path d="M92 120 Q100 128 108 120" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Cap / Beanie */}
      <path d="M60 88 C60 62, 140 62, 140 88 Z" fill="#059669" />
      <path d="M54 88 H146" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
      
      {/* Floating Graduation Cap Badge on Left */}
      <g transform="translate(18, 55)">
        <circle cx="20" cy="20" r="18" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
        <path d="M10 20 L20 15 L30 20 L20 25 Z" fill="#10B981" />
        <path d="M14 22 V27 C14 29, 26 29, 26 27 V22" fill="#059669" />
      </g>

      {/* Floating Trophy / Star Badge on Right */}
      <g transform="translate(145, 65)">
        <circle cx="18" cy="18" r="16" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
        <path d="M18 10 L20.5 15 L26 15.8 L22 19.7 L23 25 L18 22.4 L13 25 L14 19.7 L10 15.8 L15.5 15 Z" fill="#F59E0B" />
      </g>
    </svg>
  </div>
);

/**
 * Madrasat & Quran Track Vector Illustration
 * Medina Mushaf on Rihal, Tajweed audio looper waves, and Sanad Ijazah badge
 */
export const MadrasatQuranTrackIllustration: React.FC<{ className?: string; isDark?: boolean }> = ({
  className = "w-full h-44",
  isDark = false
}) => (
  <div className={`relative w-full h-44 flex items-center justify-center rounded-2xl overflow-hidden p-3 ${isDark ? 'bg-slate-950/70 border border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-emerald-100/50 border border-emerald-200/80'} shadow-sm ${className}`}>
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-40">
      {/* Ambient background geometry */}
      <circle cx="160" cy="90" r="75" fill={isDark ? "#064E3B" : "#A7F3D0"} fillOpacity={isDark ? "0.35" : "0.45"} />
      <circle cx="160" cy="90" r="55" stroke={isDark ? "#10B981" : "#059669"} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

      {/* Medina Mushaf Open Book */}
      <g transform="translate(65, 30)">
        {/* Book shadow */}
        <ellipse cx="95" cy="115" rx="75" ry="10" fill="#0F172A" fillOpacity="0.15" />
        
        {/* Wooden Rihal (Book Stand) Base */}
        <path d="M45 110 L95 82 L145 110 L135 118 L95 94 L55 118 Z" fill="#92400E" />
        <path d="M95 82 L95 94 L145 118 L145 110 Z" fill="#78350F" />
        
        {/* Left Book Page */}
        <path d="M95 35 C65 30 30 36 20 44 L20 95 C30 87 65 81 95 86 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
        {/* Left Page Calligraphy Lines */}
        <line x1="32" y1="52" x2="85" y2="48" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="62" x2="85" y2="58" stroke="#B45309" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <line x1="32" y1="72" x2="85" y2="68" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="35" y1="82" x2="75" y2="78" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

        {/* Right Book Page */}
        <path d="M95 35 C125 30 160 36 170 44 L170 95 C160 87 125 81 95 86 Z" fill="#FFFDF5" stroke="#D97706" strokeWidth="1.5" />
        {/* Right Page Calligraphy Lines */}
        <line x1="105" y1="48" x2="158" y2="52" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="105" y1="58" x2="160" y2="62" stroke="#B45309" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <line x1="105" y1="68" x2="158" y2="72" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="115" y1="78" x2="155" y2="82" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

        {/* Center Spine Ribbon Marker */}
        <path d="M95 35 Q93 65 95 105 L98 108 L98 35 Z" fill="#DC2626" />
      </g>

      {/* Floating Audio Recitation Sound Wave Pill (Top Left) */}
      <g transform="translate(18, 16)">
        <rect width="84" height="26" rx="13" fill={isDark ? "#0F172A" : "#FFFFFF"} stroke="#10B981" strokeWidth="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
        <circle cx="13" cy="13" r="6" fill="#10B981" />
        <path d="M11 10 L16 13 L11 16 Z" fill="#FFFFFF" />
        {/* Audio Waveform Bars */}
        <rect x="25" y="10" width="2" height="6" rx="1" fill="#047857" />
        <rect x="30" y="7" width="2" height="12" rx="1" fill="#10B981" />
        <rect x="35" y="5" width="2" height="16" rx="1" fill="#047857" />
        <rect x="40" y="8" width="2" height="10" rx="1" fill="#10B981" />
        <rect x="45" y="6" width="2" height="14" rx="1" fill="#047857" />
        <rect x="50" y="10" width="2" height="6" rx="1" fill="#10B981" />
        <text x="58" y="16" fill={isDark ? "#6EE7B7" : "#047857"} fontSize="8" fontFamily="monospace" fontWeight="bold">114 S</text>
      </g>

      {/* Floating Sanad Ijazah Gold Seal (Top Right) */}
      <g transform="translate(222, 14)">
        <rect width="80" height="26" rx="13" fill={isDark ? "#0F172A" : "#FFFFFF"} stroke="#F59E0B" strokeWidth="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
        <circle cx="14" cy="13" r="7" fill="#F59E0B" />
        {/* Star Icon in Seal */}
        <path d="M14 8.5 L15.5 11.5 L18.5 12 L16 14.2 L16.8 17.5 L14 15.8 L11.2 17.5 L12 14.2 L9.5 12 L12.5 11.5 Z" fill="#FFFFFF" />
        <text x="26" y="17" fill={isDark ? "#FCD34D" : "#B45309"} fontSize="8" fontFamily="sans-serif" fontWeight="bold">Sanad Verified</text>
      </g>
    </svg>
  </div>
);

/**
 * Code Academy Track Vector Illustration
 * Monaco Editor, Unit Test Assertions Passed, and Compiler Terminal
 */
export const CodeAcademyTrackIllustration: React.FC<{ className?: string; isDark?: boolean }> = ({
  className = "w-full h-44",
  isDark = true
}) => (
  <div className={`relative w-full h-44 flex items-center justify-center rounded-2xl overflow-hidden p-3 ${isDark ? 'bg-slate-950/80 border border-blue-500/30' : 'bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800'} shadow-sm ${className}`}>
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-40">
      {/* Background Soft Glow */}
      <circle cx="160" cy="90" r="70" fill="#2563EB" fillOpacity="0.2" />

      {/* Code Editor Window */}
      <rect x="18" y="16" width="284" height="148" rx="10" fill="#0B132B" stroke="#1E293B" strokeWidth="1.5" />
      
      {/* Window Titlebar */}
      <path d="M18 26 C18 20.4772 22.4772 16 28 16 H292 C297.523 16 302 20.4772 302 26 V38 H18 V26 Z" fill="#0F172A" />
      <circle cx="32" cy="27" r="3.5" fill="#EF4444" />
      <circle cx="42" cy="27" r="3.5" fill="#F59E0B" />
      <circle cx="52" cy="27" r="3.5" fill="#10B981" />
      <rect x="105" y="21" width="110" height="12" rx="3" fill="#1E293B" />
      <text x="160" y="30" textAnchor="middle" fill="#94A3B8" fontSize="7.5" fontFamily="monospace">algorithm.ts • Sandbox</text>

      {/* Code Syntax Lines */}
      <g transform="translate(30, 48)">
        <text x="0" y="10" fill="#64748B" fontSize="8" fontFamily="monospace">01</text>
        <text x="18" y="10" fill="#F43F5E" fontSize="8" fontFamily="monospace">async function</text>
        <text x="94" y="10" fill="#38BDF8" fontSize="8" fontFamily="monospace">executeTestSuite()</text>
        <text x="195" y="10" fill="#94A3B8" fontSize="8" fontFamily="monospace">&#123;</text>

        <text x="0" y="24" fill="#64748B" fontSize="8" fontFamily="monospace">02</text>
        <text x="26" y="24" fill="#818CF8" fontSize="8" fontFamily="monospace">const</text>
        <text x="56" y="24" fill="#FBBF24" fontSize="8" fontFamily="monospace">result</text>
        <text x="92" y="24" fill="#F43F5E" fontSize="8" fontFamily="monospace">=</text>
        <text x="104" y="24" fill="#38BDF8" fontSize="8" fontFamily="monospace">await runAssertions();</text>

        <text x="0" y="38" fill="#64748B" fontSize="8" fontFamily="monospace">03</text>
        <text x="26" y="38" fill="#F43F5E" fontSize="8" fontFamily="monospace">return</text>
        <text x="64" y="38" fill="#34D399" fontSize="8" fontFamily="monospace">&#123; passed: true, score: 100 &#125;;</text>

        <text x="0" y="52" fill="#64748B" fontSize="8" fontFamily="monospace">04</text>
        <text x="18" y="52" fill="#94A3B8" fontSize="8" fontFamily="monospace">&#125;</text>
      </g>

      {/* Terminal / Assertion Test Runner Panel */}
      <rect x="28" y="108" width="264" height="46" rx="6" fill="#020617" stroke="#10B981" strokeWidth="1" strokeOpacity="0.6" />
      <g transform="translate(36, 118)">
        {/* Pass icon */}
        <circle cx="8" cy="8" r="6" fill="#10B981" />
        <path d="M5.5 8 L7.5 10 L10.5 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="20" y="11" fill="#10B981" fontSize="8.5" fontFamily="monospace" fontWeight="bold">14/14 Automated Assertions Passed</text>
        
        {/* Runtime info */}
        <text x="20" y="24" fill="#94A3B8" fontSize="7.5" fontFamily="monospace">Runtime: 18ms • Memory: 8.2MB • Level 4 Mastery</text>
      </g>
    </svg>
  </div>
);

/**
 * Vocational & SIS Track Vector Illustration
 * Gradebook Roster, Verified Practical Rubrics, and Automated Report Cards
 */
export const VocationalSisTrackIllustration: React.FC<{ className?: string; isDark?: boolean }> = ({
  className = "w-full h-44",
  isDark = false
}) => (
  <div className={`relative w-full h-44 flex items-center justify-center rounded-2xl overflow-hidden p-3 ${isDark ? 'bg-slate-950/70 border border-purple-500/30' : 'bg-gradient-to-br from-purple-50 via-indigo-50/60 to-purple-100/50 border border-purple-200/80'} shadow-sm ${className}`}>
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-40">
      {/* Background Soft Glow */}
      <circle cx="160" cy="90" r="70" fill={isDark ? "#581C87" : "#DDD6FE"} fillOpacity={isDark ? "0.3" : "0.5"} />

      {/* SIS Roster Card */}
      <rect x="20" y="16" width="280" height="148" rx="10" fill={isDark ? "#0F172A" : "#FFFFFF"} stroke={isDark ? "#334155" : "#E2E8F0"} strokeWidth="1.5" />
      
      {/* Header bar */}
      <path d="M20 26 C20 20.4772 24.4772 16 30 16 H290 C295.523 16 300 20.4772 300 26 V44 H20 V26 Z" fill="#6D28D9" />
      <text x="36" y="33" fill="#FFFFFF" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Vocational Trade SIS • Practical Milestone Roster</text>
      <rect x="228" y="23" width="62" height="15" rx="4" fill="#8B5CF6" />
      <text x="259" y="33" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold">GPA 3.96</text>

      {/* Row 1 - Workshop Assembly */}
      <g transform="translate(30, 52)">
        <rect width="260" height="26" rx="5" fill={isDark ? "#1E293B" : "#F5F3FF"} />
        <circle cx="13" cy="13" r="7" fill="#10B981" />
        <path d="M10.5 13 L12.5 15 L15.5 11" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="26" y="16" fill={isDark ? "#FFFFFF" : "#4C1D95"} fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">Workshop Assembly</text>
        <text x="145" y="16" fill="#059669" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Score: 98% (A+)</text>
        <rect x="210" y="5" width="42" height="16" rx="4" fill="#EDE9FE" />
        <text x="231" y="16" textAnchor="middle" fill="#6D28D9" fontSize="7" fontWeight="bold">Verified</text>
      </g>

      {/* Row 2 - Quality Assurance Practicum */}
      <g transform="translate(30, 84)">
        <rect width="260" height="26" rx="5" fill={isDark ? "#1E293B" : "#FFFFFF"} stroke={isDark ? "#334155" : "#EDE9FE"} />
        <circle cx="13" cy="13" r="7" fill="#10B981" />
        <path d="M10.5 13 L12.5 15 L15.5 11" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="26" y="16" fill={isDark ? "#FFFFFF" : "#1E293B"} fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">Safety & Practicum</text>
        <text x="145" y="16" fill="#059669" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Attendance: 100%</text>
        <rect x="210" y="5" width="42" height="16" rx="4" fill="#EDE9FE" />
        <text x="231" y="16" textAnchor="middle" fill="#6D28D9" fontSize="7" fontWeight="bold">Verified</text>
      </g>

      {/* Bottom Summary Banner */}
      <g transform="translate(30, 118)">
        <rect width="260" height="34" rx="6" fill="#EDE9FE" />
        <circle cx="16" cy="17" r="8" fill="#6D28D9" />
        {/* Certificate icon */}
        <path d="M12 14 H20 M12 17 H18 M12 20 H16" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <text x="32" y="16" fill="#5B21B6" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Automated Report Cards & Certificate Ready</text>
        <text x="32" y="27" fill="#6D28D9" fontSize="7.5" fontFamily="sans-serif">PDF Transcript & WhatsApp Delivery Active</text>
      </g>
    </svg>
  </div>
);
