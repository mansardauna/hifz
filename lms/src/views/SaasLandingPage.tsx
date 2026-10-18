import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  Code2,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Laptop,
  CheckCircle2,
  Twitter,
  Linkedin,
  Instagram,
  Share2,
  BarChart3,
  TrendingUp,
  Settings,
  Zap,
  Globe,
  Sliders,
  Play,
  Layers,
  ExternalLink
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { AnkabitLogo } from '../components/brand/AnkabitLogo';
import {
  LaptopHeroMockupIllustration,
  MadrasatQuranTrackIllustration,
  CodeAcademyTrackIllustration,
  VocationalSisTrackIllustration
} from '../components/illustrations/Illustrations2D';

interface SaasLandingPageProps {
  onNavigateToAuth: (route: string) => void;
  onNavigateToDemo: (tenantId: string) => void;
}

export const SaasLandingPage: React.FC<SaasLandingPageProps> = ({
  onNavigateToAuth,
  onNavigateToDemo,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Real Partner Academies on Ankabit LMS
  const partnerAcademies = [
    'Dar Al-Quran',
    'NextGen Tech',
    'Horizon Academy',
    'Bayyinah Institute',
    'Al-Furqan Madrasah',
  ];

  // 3-Column Specialized Tracks matching Image 1 layout with Ankabit LMS content
  const tracks = [
    {
      id: 'madrasat',
      title: 'Madrasat & Quran',
      specialty: 'Islamic & Hifz Institute',
      desc: '114 Surahs Medina Mushaf reader, audio recitation looper, live halaqahs, and Sanad Ijazah verification studio.',
      demoId: 'hifz-academy',
      featured: false,
    },
    {
      id: 'developer',
      title: 'Code Academy',
      specialty: 'Software & Bootcamps',
      desc: 'In-browser interactive coding sandbox, automated unit test assertions, problem sets, and developer community.',
      demoId: 'code-academy',
      featured: true, // Center raised card from Image 1
    },
    {
      id: 'school',
      title: 'Vocational & SIS',
      specialty: 'Trade & Universal Schools',
      desc: 'Workshop milestones, practical task submissions, proof-of-work grading rubrics, and automated report cards.',
      demoId: 'al-furqan',
      featured: false,
    },
  ];

  // Ankabit LMS Real Pricing Tiers
  const pricingTiers = [
    {
      name: 'QARI STARTER',
      price: '$29.00',
      period: 'Per Month',
      popular: false,
      features: [
        'Up to 100 Active Students',
        'Single Subdomain (*.ankabit.app)',
        'Medina Mushaf & Audio Looper',
        'Real-time LiveKit Classrooms',
        'Direct Gateway Payments (0% Fee)',
      ],
      ctaText: 'Start Free Trial',
    },
    {
      name: 'GROWTH ACADEMY',
      price: '$79.00',
      period: 'Per Month',
      popular: true, // Center raised card from Image 1
      features: [
        'Unlimited Active Students',
        'Custom Domain (learn.academy.com)',
        'Full Code Sandbox & Quiz Studio',
        'Automated WhatsApp & Email Hub',
        'Sanad & Ijazah Certificate Builder',
      ],
      ctaText: 'Start Free Trial',
    },
    {
      name: 'CAMPUS ENTERPRISE',
      price: '$199.00',
      period: 'Per Month',
      popular: false,
      features: [
        'Multi-Campus Franchise Network',
        'Dedicated Cloud WebRTC SFU',
        'Custom SSO & 2FA Enforcement',
        'SLA 99.9% Uptime Guarantee',
        '24/7 Priority Support & Onboarding',
      ],
      ctaText: 'Contact Sales',
    },
  ];

  // Ankabit LMS FAQs
  const faqs = [
    {
      q: 'How does Ankabit LMS power specialized academies?',
      a: 'Ankabit LMS provides turn-key infrastructure. Your academy runs on your custom domain (e.g. learn.youracademy.com) or subdomain (*.ankabit.app) with custom branding, isolated student databases, and tailored curricula (Quran, Coding, or Vocational).',
    },
    {
      q: 'Are live video halaqahs built-in or dependent on third parties?',
      a: 'Video halaqahs and live coding lectures run natively via LiveKit Cloud WebRTC SFU in your browser with screen sharing, interactive whiteboards, and recordings—requiring zero external Zoom licenses or software downloads.',
    },
    {
      q: 'How does student tuition collection work?',
      a: 'Academies connect their own merchant gateways (Flutterwave, Paystack, Stripe, Moyasar, or Direct Bank Wire). 100% of student tuition deposits directly into your account with 0% platform commission.',
    },
    {
      q: 'Can students access practical workshops and auto-graded exams?',
      a: 'Yes! For coding bootcamps, students run live JavaScript & Python unit tests in-browser. For vocational institutes, students submit practical photo/video proofs against teacher grading rubrics.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (Milk Color Background with Black Text)      */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] via-[#F6F3EC] to-[#F1ECE3] text-slate-900 pt-6 pb-24 sm:pb-36 overflow-hidden border-b border-stone-200/60">
        {/* Soft Ambient Warm Circular Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        
        {/* Dot Matrix Decoration on the right (From Image 1) */}
        <div className="absolute right-8 top-32 hidden lg:grid grid-cols-4 gap-2.5 opacity-30 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-600/40" />
          ))}
        </div>

        {/* Floating Social Icons on Right Margin (From Image 1) */}
        <div className="hidden xl:flex flex-col items-center gap-4 fixed right-6 top-1/3 z-40 bg-white/90 backdrop-blur-md p-2.5 rounded-full border border-slate-200/90 text-slate-600 shadow-lg shadow-slate-200/60">
          <a href="#" className="p-2 hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition-colors" title="Twitter">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition-colors" title="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition-colors" title="Instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </a>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* --- Navigation Bar --- */}
          <header className="flex items-center justify-between pb-12 sm:pb-16">
            {/* Real Brand Logo: Ankabit LMS */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <AnkabitLogo size="md" />
            </div>

            {/* Desktop Center Links (From Image 1) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
              <a href="#home" className="hover:text-emerald-700 transition-colors">Home</a>
              <a href="#about" className="hover:text-emerald-700 transition-colors">About</a>
              <a href="#pricing" className="hover:text-emerald-700 transition-colors">Pricing</a>
              <a href="#tracks" className="hover:text-emerald-700 transition-colors">Tracks</a>
              <a href="#features" className="hover:text-emerald-700 transition-colors">Showcase</a>
              <a href="/docs" className="hover:text-emerald-700 transition-colors text-emerald-800 font-semibold">Docs</a>
            </nav>

            {/* Right Action Button (From Image 1) */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => onNavigateToAuth('login')}
                className="px-5 py-2 rounded-full bg-white hover:bg-stone-100 text-slate-800 text-sm font-semibold border border-stone-200 transition-all cursor-pointer shadow-xs hover:border-stone-300"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigateToAuth('create-academy')}
                className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                Create Academy
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-800">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </header>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/98 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-slate-200 text-center space-y-4 shadow-xl">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-900 font-semibold">Home</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-900 font-semibold">About</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-900 font-semibold">Pricing</a>
              <a href="#tracks" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-900 font-semibold">Tracks</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-900 font-semibold">Features</a>
              <a href="/docs" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-emerald-800 font-semibold">Docs</a>
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateToAuth('login');
                  }}
                  className="w-full py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-sm border border-stone-200 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateToAuth('create-academy');
                  }}
                  className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Create Academy
                </button>
              </div>
            </div>
          )}

          {/* --- Hero Headline & Action Buttons (Milk Background with Black Text) --- */}
          <div className="text-center max-w-4xl mx-auto space-y-6 pt-4 pb-12 sm:pb-16" id="home">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black leading-tight">
              The All-in-One Operating System<br />
              for Specialized Academies
            </h1>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-normal">
              Empower your Quran Madrasah, Coding Bootcamp, or Vocational Trade Institute with custom domains, WebRTC live classrooms, and automated tuition management.
            </p>

            {/* Two Pill Action Buttons (From Image 1) */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigateToAuth('create-academy')}
                className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xl shadow-emerald-800/20 transition-all cursor-pointer"
              >
                Create Your Academy
              </button>
              <button
                onClick={() => onNavigateToDemo('hifz-academy')}
                className="px-8 py-3 rounded-full bg-white hover:bg-stone-50 text-slate-900 font-semibold text-sm border border-stone-300 shadow-sm transition-all cursor-pointer"
              >
                Explore Live Demo
              </button>
            </div>
          </div>

          {/* --- 3D Laptop Mockup with Overlapping Growth Card (From Image 1) --- */}
          <div className="relative mt-8 sm:mt-12 -mb-28 sm:-mb-44 z-30">
            <LaptopHeroMockupIllustration />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TRUST / ACADEMY LOGO BAR (Under the Laptop Mockup)        */}
      {/* ============================================================ */}
      <section className="pt-36 sm:pt-52 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold capitalize tracking-wider text-slate-400">
              Trusted by Leading Academies & Educational Institutes Worldwide
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-slate-500 font-semibold text-lg sm:text-xl tracking-tight">
            {partnerAcademies.map((logo, idx) => (
              <div key={idx} className="flex items-center gap-2 hover:text-emerald-700 transition-all opacity-80 hover:opacity-100">
                <span className="tracking-tight">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INTEGRATED LEARNING SOLUTIONS (3 Track Cards)             */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-slate-50/60" id="tracks">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Integrated solutions designed
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Purpose-built learning workspaces tailored specifically for distinct educational tracks and instructional workflows.
            </p>
          </div>

          {/* 3-Column Grid (Center Card Elevated with Emerald Theme from Image 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center transition-all duration-300 ${
                  track.featured
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/25 ring-2 ring-emerald-500/50 -translate-y-2'
                    : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Track Vector Illustration */}
                <div className="w-full mb-6">
                  {track.id === 'madrasat' && <MadrasatQuranTrackIllustration isDark={track.featured} />}
                  {track.id === 'developer' && <CodeAcademyTrackIllustration isDark={track.featured} />}
                  {track.id === 'school' && <VocationalSisTrackIllustration isDark={track.featured} />}
                </div>

                <h3 className={`text-xl font-semibold mb-1 ${track.featured ? 'text-white' : 'text-slate-900'}`}>
                  {track.title}
                </h3>
                <div className={`text-xs font-semibold mb-4 ${track.featured ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {track.specialty}
                </div>
                
                <p className={`text-xs sm:text-sm leading-relaxed mb-8 flex-1 ${track.featured ? 'text-slate-300' : 'text-slate-500'}`}>
                  {track.desc}
                </p>

                <button
                  onClick={() => onNavigateToDemo(track.demoId)}
                  className={`w-full py-3 rounded-full text-xs font-semibold capitalize tracking-wider transition-all ${
                    track.featured
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Explore Track
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHY CHOOSE ANKABIT FEATURES (Dashboard Mockup + List)     */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-white border-y border-slate-100" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Why Choose Ankabit LMS Features
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Enterprise scalability meets domain-specific precision for high-retention academies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Dashboard Preview Card with Donut Chart Badge */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">Academy Executive Dashboard</span>
                </div>

                {/* Bars & Graph */}
                <div className="py-6 space-y-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Recitations & Assessments Completed</span>
                    <span className="text-emerald-400 font-semibold">+94% Completion</span>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-2 pt-2">
                    {[35, 55, 75, 45, 90, 65, 80, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-slate-800 rounded-t h-full flex items-end">
                        <div
                          className={`w-full rounded-t ${i === 7 ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Circular Donut Badge (From Image 1) */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-amber-400 border-r-teal-400 flex items-center justify-center font-semibold text-xs text-emerald-600">
                    94%
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Retention Rate</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Academy Excellence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Numbered Features (01, 02, 03) */}
            <div className="lg:col-span-6 space-y-8">
              <div className="flex gap-6 items-start">
                <span className="text-2xl sm:text-3xl font-semibold text-emerald-600 font-mono">01</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Customize your workflow</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Personalize course modules, live recitation schedules, and grading rubrics that match your exact curriculum standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <span className="text-2xl sm:text-3xl font-semibold text-emerald-600 font-mono">02</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Easy onboarding, fast adoption</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Zero software installation required. Provision custom subdomain portals in 30 seconds for both students and instructors.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <span className="text-2xl sm:text-3xl font-semibold text-emerald-600 font-mono">03</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Improve student retention</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Automated attendance alerts, Sanad Ijazah verification badges, and direct parent notifications foster long-term student dedication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. REAL-TIME REPORTING & TEAM COLLABORATION                  */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-slate-50/60" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & Checklist */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
                Real-time reporting on your most important academy metrics.
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Stay updated on daily recitation targets, quiz completion velocity, and tuition cashflow in unified executive analytics.
              </p>

              {/* Two Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Best Performance</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Easy Settings</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual of Students Collaborating with Floating Badge */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-video relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating "Product Level" Badge (From Image 1) */}
              <div className="absolute -bottom-6 left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-amber-400 border-r-teal-500 flex items-center justify-center font-semibold text-[11px] text-slate-900">
                  98%
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Product Level</div>
                  <div className="text-[10px] text-slate-500">Verified Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. PRICING SECTION (3 Pricing Cards, Center Card Raised)    */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-100" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Pricing for every academy, at any stage
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Transparent, straightforward subscription plans with zero hidden fees and 0% cut of your student tuition.
            </p>
          </div>

          {/* 3 Pricing Cards (Center Card Raised & Highlighted) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col text-center transition-all ${
                  tier.popular
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/25 ring-2 ring-emerald-500/50 md:-translate-y-4 py-12'
                    : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
                }`}
              >
                <div className={`text-xs font-semibold capitalize tracking-wider mb-2 ${tier.popular ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {tier.name}
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className={`text-3xl sm:text-4xl font-semibold ${tier.popular ? 'text-white' : 'text-slate-900'}`}>
                    {tier.price}
                  </span>
                </div>
                <div className={`text-xs mb-8 ${tier.popular ? 'text-slate-300' : 'text-slate-400'}`}>
                  {tier.period}
                </div>

                {/* Features Checkmarks */}
                <div className="space-y-3 text-xs sm:text-sm text-left mb-8 flex-1">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5">
                      <Check className={`w-4 h-4 shrink-0 ${tier.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={tier.popular ? 'text-slate-200' : 'text-slate-600'}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigateToAuth('create-academy')}
                  className={`w-full py-3 rounded-full text-xs font-semibold capitalize tracking-wider transition-all mb-3 ${
                    tier.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {tier.ctaText}
                </button>
                <span className={`text-[11px] ${tier.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                  Get Your 30 Day Free Trial
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FAQ & SUPPORT SECTION                                     */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-slate-50/60 border-t border-slate-100" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Team Photo */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                  alt="Ankabit support team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">Ankabit Support Active</span>
              </div>
            </div>

            {/* Right Column: FAQ Accordion */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h3>
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 bg-white rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FOOTER                                                   */}
      {/* ============================================================ */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <AnkabitLogo size="sm" />
          </div>
          <p>© 2026 Ankabit LMS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="/docs" className="hover:text-emerald-400 font-semibold transition-colors">Docs</a>
            <button
              onClick={() => onNavigateToAuth('login')}
              className="text-slate-300 hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
