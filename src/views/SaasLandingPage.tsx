import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  Layers,
  Palette,
  CreditCard,
  Mic,
  Globe,
  Video,
  ChevronDown,
  Menu,
  X,
  Code2,
  Sparkles,
  Zap,
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../components/ui';
import {
  HeroDashboardIllustration,
  MultiTenantNetworkIllustration
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
  const [selectedSpecialty, setSelectedSpecialty] = useState<'quran' | 'coding' | 'general'>('quran');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const faqs = [
    {
      q: 'How does the multi-tenant architecture work?',
      a: 'Every registered academy receives full data isolation, dedicated subdomains (e.g. your-academy.hifz.app), custom domain support, and private student and instructor databases.',
    },
    {
      q: 'Can students access live video classrooms directly in the browser?',
      a: 'Yes! Powered by LiveKit Cloud WebRTC SFU, students and teachers join HD video sessions and collaborative whiteboards directly in their web or mobile browser with 0 installations.',
    },
    {
      q: 'Which learning specialties and plugins are supported?',
      a: 'The platform features modular workspaces for Quran & Tajweed studies (all 114 Surahs with authentic audio streaming), Coding & Tech sandboxes (interactive browser code execution), and General LMS tracks.',
    },
    {
      q: 'How are tuition payments collected?',
      a: 'Academies connect their own merchant gateways (Flutterwave, Paystack, Stripe, Moyasar, or Direct Bank Wire) to receive 100% of student tuition payments directly into their own bank accounts.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header Navigation (Ultra-Responsive & Aesthetic) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ring-1 ring-slate-800">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  Hifz OS
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Cloud
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
                Multi-Tenant Academy Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 text-xs font-semibold text-slate-600">
            <a href="#features" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Features</a>
            <a href="#modules" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Specialties</a>
            <a href="#network" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Architecture</a>
            <a href="#pricing" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Pricing</a>
            <a href="#faq" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Button variant="ghost" size="sm" onClick={() => onNavigateToAuth('login')}>
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigateToAuth('create-academy')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Academy
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-5 py-5 space-y-4 text-xs font-semibold shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 text-center font-medium"
              >
                Features
              </a>
              <a
                href="#modules"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 text-center font-medium"
              >
                Specialties
              </a>
              <a
                href="#network"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 text-center font-medium"
              >
                Architecture
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 text-center font-medium"
              >
                Pricing
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToAuth('login');
                }}
              >
                Sign In to Account
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToAuth('create-academy');
                }}
              >
                Launch Your Academy Free
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section with 2D Dashboard Illustration */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-100/40 via-sky-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-900">v2.4 Live</span>
            <span className="text-slate-300">•</span>
            <span>Complete Multi-Tenant Educational Operating System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Launch and scale your online madrasah with complete autonomy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Multi-tenant routing with custom domains, authentic 114 Surah Quran API with live reciter looper, WebRTC video classrooms, collaborative whiteboards, and autonomous tuition processing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigateToAuth('create-academy')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
            >
              Launch Your Academy Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigateToDemo('dar-alquran')}
              leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
              className="w-full sm:w-auto bg-white"
            >
              Explore Live Demo Academy
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Data Isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>LiveKit Cloud SFU Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No Platform Commission on Tuition</span>
            </div>
          </div>
        </div>

        {/* 2D Vector Dashboard Graphic */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative">
          <div className="rounded-2xl p-2 sm:p-3 bg-white/70 backdrop-blur-md border border-slate-200 shadow-2xl shadow-slate-200/50">
            <HeroDashboardIllustration className="w-full h-auto rounded-xl shadow-xs" />
          </div>

          {/* Floating Metric Pill 1 */}
          <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-xl shadow-xl">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">Live Reciter Looper</p>
              <p className="text-[10px] text-slate-500">Mishary • Husary • Minshawi • Basit</p>
            </div>
          </div>

          {/* Floating Metric Pill 2 */}
          <div className="hidden lg:flex items-center gap-3 absolute -top-6 -right-6 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-xl shadow-xl">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">LiveKit Cloud WebRTC</p>
              <p className="text-[10px] text-emerald-600 font-semibold">1080p HD SFU Video Stream</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Multi-Niche Visual Specialties */}
      <section id="modules" className="py-20 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="default">Specialized LMS Workspaces</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Built for Quranic, Tech, and Multidisciplinary Academies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each institution configures its niche workspace with tailored tools, student dashboards, and evaluation engines.
            </p>
          </div>

          {/* Specialty Selector Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold gap-1">
              <button
                onClick={() => setSelectedSpecialty('quran')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSpecialty === 'quran'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quran & Tajweed Madrasah</span>
              </button>
              <button
                onClick={() => setSelectedSpecialty('coding')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSpecialty === 'coding'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Coding & Tech Academy</span>
              </button>
              <button
                onClick={() => setSelectedSpecialty('general')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  selectedSpecialty === 'general'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>General Language School</span>
              </button>
            </div>
          </div>

          {/* Specialty Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {selectedSpecialty === 'quran' && (
              <>
                <Card className="space-y-3 border-emerald-200 bg-emerald-50/20">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Live 114 Surah Reader</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full Uthmani script calligraphy with Sahih English translations dynamically loaded from AlQuran API.
                  </p>
                </Card>
                <Card className="space-y-3 border-emerald-200 bg-emerald-50/20">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Mic className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Verse Audio Looper</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Continuous recitation player supporting Alafasy, Husary, Minshawi, and Abdul Basit with auto-progression.
                  </p>
                </Card>
                <Card className="space-y-3 border-emerald-200 bg-emerald-50/20">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Sanad Ijazah Tracking</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Track student Hifz revision loops, Juz milestones, and verified Sanad chain certifications.
                  </p>
                </Card>
              </>
            )}

            {selectedSpecialty === 'coding' && (
              <>
                <Card className="space-y-3 border-blue-200 bg-blue-50/20">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Browser Code Sandbox</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Interactive in-browser code editor with instant JavaScript, Python, and HTML/CSS execution.
                  </p>
                </Card>
                <Card className="space-y-3 border-blue-200 bg-blue-50/20">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Automated Unit Test Grading</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instant feedback on coding homework submissions with automated test assert evaluation.
                  </p>
                </Card>
                <Card className="space-y-3 border-blue-200 bg-blue-50/20">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Pair-Programming Classroom</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Live collaborative editor alongside video chat and real-time screen sharing for mentors.
                  </p>
                </Card>
              </>
            )}

            {selectedSpecialty === 'general' && (
              <>
                <Card className="space-y-3 border-purple-200 bg-purple-50/20">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Multilingual LMS Tracks</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Arabic, English, French, and Urdu curriculum modules with RTL and LTR layout toggles.
                  </p>
                </Card>
                <Card className="space-y-3 border-purple-200 bg-purple-50/20">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">GrapesJS Page Builder</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Visual drag-and-drop page builder with ready-to-use landing page templates for student admissions.
                  </p>
                </Card>
                <Card className="space-y-3 border-purple-200 bg-purple-50/20">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Direct Merchant Gateways</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connect Flutterwave, Paystack, Stripe, and Moyasar to accept payments in any local currency.
                  </p>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. Multi-Tenant Architecture Section */}
      <section id="network" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="default">Enterprise Cloud Infrastructure</Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Independent Multitenancy with Complete Isolation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Each academy functions as an autonomous, self-contained educational portal with dedicated domain middleware.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <MultiTenantNetworkIllustration className="w-full h-auto" />
        </div>
      </section>

      {/* 5. 4-Tier SaaS Pricing Grid */}
      <section id="pricing" className="py-20 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="success">Transparent SaaS Pricing</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Simple, Predictable Plans for Every Academy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Zero commission on your student tuition. Billed securely via Stripe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <Badge variant="default">Free Tier</Badge>
                <h3 className="font-bold text-base text-slate-900">Free Starter</h3>
                <p className="text-xs text-slate-500">Perfect for initial trials and getting started.</p>
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-3xl font-bold font-mono text-slate-900">$0</span>
                  <span className="text-xs text-slate-500 ml-1">/ forever</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Up to 15 Active Students</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>1 Teacher Seat</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Subdomain (*.hifz.app)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Basic Overview Numbers</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Start Free
                </Button>
              </div>
            </Card>

            {/* Qari */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <Badge variant="default">Qari Solo</Badge>
                <h3 className="font-bold text-base text-slate-900">Independent Qari</h3>
                <p className="text-xs text-slate-500">For private tutors and solo Quran instructors.</p>
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-3xl font-bold font-mono text-slate-900">$29</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Up to 50 Active Students</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>1 Teacher Seat</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Audio Looper & Homework</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Custom Merchant Gateways</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Get Qari Tier
                </Button>
              </div>
            </Card>

            {/* Growth */}
            <Card className="flex flex-col justify-between border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 shadow-md relative">
              <div className="space-y-4">
                <Badge variant="success">Most Popular</Badge>
                <h3 className="font-bold text-base text-slate-900">Madrasah Growth</h3>
                <p className="text-xs text-slate-500">For established academies needing custom domains.</p>
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-3xl font-bold font-mono text-slate-900">$79</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Up to 350 Active Students</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>10 Teacher Seats</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Custom Domain (*.academy.com)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Interactive Growth Charts</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>LiveKit WebRTC Classroom</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Launch Growth Plan
                </Button>
              </div>
            </Card>

            {/* Enterprise */}
            <Card className="flex flex-col justify-between border-slate-900 bg-slate-900 text-white shadow-xl">
              <div className="space-y-4">
                <Badge variant="default" className="bg-slate-800 text-emerald-400 border-slate-700">
                  Enterprise VIP
                </Badge>
                <h3 className="font-bold text-base text-white">Global Enterprise</h3>
                <p className="text-xs text-slate-400">For multi-branch networks & institutions.</p>
                <div className="pb-3 border-b border-slate-800">
                  <span className="text-3xl font-bold font-mono text-white">$199</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">Unlimited Students & Teachers</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Multi-Branch Campuses</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sanad Certificate Builder</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dedicated SFU Bandwidth</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Get Enterprise Plan
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="default">Frequently Asked Questions</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Got Questions? We Have Answers</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="cursor-pointer hover:border-slate-300 transition-all p-5"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{faq.q}</h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-slate-900' : ''
                  }`}
                />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-8 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-white text-sm">Hifz OS</span>
            <span className="text-slate-600">|</span>
            <span>Educational Multitenancy Infrastructure</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button onClick={() => onNavigateToAuth('login')} className="hover:text-white transition-colors cursor-pointer">Sign In</button>
            <button onClick={() => onNavigateToAuth('create-academy')} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">Launch Academy</button>
          </div>

          <p className="text-[11px] text-slate-500">© 2026 Hifz LMS Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
