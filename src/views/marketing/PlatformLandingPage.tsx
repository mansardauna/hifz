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
  CheckCircle2,
  Terminal,
  Building
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../../components/ui';
import {
  HeroDashboardIllustration,
  MultiTenantNetworkIllustration
} from '../../components/illustrations/Illustrations2D';

interface PlatformLandingPageProps {
  onNavigateToAuth: (route: string) => void;
  onNavigateToDemo: (tenantId: string) => void;
}

export const PlatformLandingPage: React.FC<PlatformLandingPageProps> = ({
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

  const liveAcademies = [
    {
      id: 'hifz-academy',
      name: 'Hifz Quran Academy',
      subdomain: 'hifz-academy.techmadrasah.app',
      specialty: 'Quran & Tajweed',
      desc: '114 Surahs Uthmani reader, authentic audio looper, and Sanad tracking.',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'code-academy',
      name: 'Code Academy Bootcamp',
      subdomain: 'code-academy.techmadrasah.app',
      specialty: 'Software & Tech',
      desc: 'In-browser coding sandbox with live JavaScript & Python execution.',
      icon: <Code2 className="w-5 h-5 text-blue-600" />,
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'al-furqan',
      name: 'Al-Furqan Islamic School',
      subdomain: 'al-furqan.techmadrasah.app',
      specialty: 'Madrasah & Sanad',
      desc: 'Structured Hifz revision halaqahs and certified oral evaluation.',
      icon: <Award className="w-5 h-5 text-teal-600" />,
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'bayyinah-arabic',
      name: 'Bayyinah Classical Arabic',
      subdomain: 'arabic.bayyinah.com',
      specialty: 'Arabic Language',
      desc: 'Custom domain academy portal with classical grammar & syntax drills.',
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const faqs = [
    {
      q: 'How does TechMadrasah power custom-branded academies?',
      a: 'TechMadrasah provides complete turn-key infrastructure. Your academy runs under your own custom domain (e.g. learn.youracademy.com) or subdomain (*.techmadrasah.app) with your brand colors, custom logos, isolated student databases, and dedicated merchant gateways.',
    },
    {
      q: 'Can students access real live WebRTC video classrooms in the browser?',
      a: 'Yes! Powered by LiveKit Cloud WebRTC SFU, teachers and students connect with real camera, microphone, screen sharing, and interactive whiteboards with zero software installation required.',
    },
    {
      q: 'Which learning plugins and tracks are available?',
      a: 'TechMadrasah includes modular workspaces for Quran & Tajweed academies (all 114 Surahs with Mishary/Husary/Minshawi audio looper), Coding & Tech bootcamps (interactive browser sandboxes), and General multidisciplinary schools.',
    },
    {
      q: 'How are student tuition fees collected?',
      a: 'Academies connect their own merchant gateways (Flutterwave, Paystack, Stripe, Moyasar, or Direct Bank Wire). 100% of student tuition deposits directly into your bank account with zero platform commission.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ring-1 ring-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  TechMadrasah
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Academy OS
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
                Multi-Tenant Academy Infrastructure
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 text-xs font-semibold text-slate-600">
            <a href="#demos" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Live Academies</a>
            <a href="#specialties" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Specialties</a>
            <a href="#architecture" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Platform Engine</a>
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
              Launch Your Academy
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
                href="#demos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 text-center font-medium"
              >
                Live Academies
              </a>
              <a
                href="#specialties"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 text-center font-medium"
              >
                Specialties
              </a>
              <a
                href="#architecture"
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
                Sign In to Portal
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
                Launch Academy
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-100/40 via-sky-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-900">TechMadrasah Engine</span>
            <span className="text-slate-300">•</span>
            <span>Custom-Branded Cloud Infrastructure for Online Academies</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            The Autonomous Educational Operating System for Modern Academies
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            TechMadrasah powers Quranic madrasahs, coding bootcamps, and language institutes with custom domains, real WebRTC video classrooms, browser coding sandboxes, and autonomous tuition billing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigateToAuth('create-academy')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
            >
              Launch Your Branded Academy
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigateToDemo('hifz-academy')}
              leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
              className="w-full sm:w-auto bg-white"
            >
              Explore Hifz Quran Academy Demo
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Multi-Tenant Isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>LiveKit Cloud SFU Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>0% Platform Commission on Tuition</span>
            </div>
          </div>
        </div>

        {/* 2D Vector Graphic */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative">
          <div className="rounded-2xl p-2 sm:p-3 bg-white/70 backdrop-blur-md border border-slate-200 shadow-2xl shadow-slate-200/50">
            <HeroDashboardIllustration className="w-full h-auto rounded-xl shadow-xs" />
          </div>

          <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-xl shadow-xl">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">Live Quran Audio Looper</p>
              <p className="text-[10px] text-slate-500">Mishary • Husary • Minshawi • Basit</p>
            </div>
          </div>

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

      {/* 3. Live Sample Academies Powered by TechMadrasah */}
      <section id="demos" className="py-20 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="success">Client Showcase</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Live Academies Powered by TechMadrasah
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any live academy below to preview their isolated custom portal, courses, and interactive tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {liveAcademies.map((academy) => (
              <Card
                key={academy.id}
                className="flex flex-col justify-between hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer p-5 space-y-4"
                onClick={() => onNavigateToDemo(academy.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {academy.icon}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${academy.tagColor}`}>
                      {academy.specialty}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{academy.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{academy.subdomain}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {academy.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Enter Academy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Multi-Niche Visual Specialties */}
      <section id="specialties" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="default">Modular LMS Workspaces</Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Tailored Engines for Every Educational Specialty
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Each academy enables specialized plugin modules tailored to their curriculum and student demographic.
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
              <span>Hifz Quran Madrasah</span>
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
              <span>Code Academy Tech</span>
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
              <span>Language & Islamic Schools</span>
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
                <h3 className="font-bold text-sm text-slate-900">114 Surah Uthmani Reader</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time Uthmani script calligraphy and English translations dynamically streamed from AlQuran Cloud API.
                </p>
              </Card>
              <Card className="space-y-3 border-emerald-200 bg-emerald-50/20">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Reciter Audio Looper</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-reciter streaming player (Alafasy, Husary, Minshawi, Abdul Basit) with verse repetition and auto-progression.
                </p>
              </Card>
              <Card className="space-y-3 border-emerald-200 bg-emerald-50/20">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Sanad Ijazah Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Systematic revision halaqah tracking, Juz completion milestones, and verified Sanad chain certificates.
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
                <h3 className="font-bold text-sm text-slate-900">In-Browser Code Sandbox</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Integrated code editor supporting instant JavaScript, Python, and HTML/CSS runtime execution without setups.
                </p>
              </Card>
              <Card className="space-y-3 border-blue-200 bg-blue-50/20">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Laptop className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Automated Test Grading</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant feedback on coding homework assignments with automated assert test evaluation.
                </p>
              </Card>
              <Card className="space-y-3 border-blue-200 bg-blue-50/20">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Live Pair-Programming</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Collaborative code editing alongside live WebRTC video calling and screen sharing for mentors.
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
                <h3 className="font-bold text-sm text-slate-900">Multilingual Arabic & English</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Classical grammar curriculum with dynamic RTL and LTR layout toggles for Arabic language students.
                </p>
              </Card>
              <Card className="space-y-3 border-purple-200 bg-purple-50/20">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Visual Page Builder</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visual drag-and-drop page builder with pre-built admissions templates for prospective student enrollment.
                </p>
              </Card>
              <Card className="space-y-3 border-purple-200 bg-purple-50/20">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Independent Merchant Setup</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct connection to Flutterwave, Paystack, Stripe, and Moyasar to collect tuition in any local currency.
                </p>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* 5. Academy Architecture Section */}
      <section id="architecture" className="py-20 px-4 sm:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="default" className="bg-slate-800 text-emerald-400 border-slate-700">
              Autonomous Cloud Platform
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              TechMadrasah Multi-Tenant Academy Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              TechMadrasah operates behind the scenes as your cloud engine, while your students and teachers see only your academy brand.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <MultiTenantNetworkIllustration className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* 6. Pricing Grid */}
      <section id="pricing" className="py-20 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="success">Platform Subscription Plans</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Predictable SaaS Pricing for Your Academy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Zero commission on your student tuition. Billed securely via Stripe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <Badge variant="default">Starter Tier</Badge>
                <h3 className="font-bold text-base text-slate-900">Community Starter</h3>
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
                    <span>Subdomain (*.techmadrasah.app)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Basic Overview Statistics</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-bold"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Start Plan
                </Button>
              </div>
            </Card>

            {/* Qari */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <Badge variant="default">Solo Tutor</Badge>
                <h3 className="font-bold text-base text-slate-900">Independent Qari / Tutor</h3>
                <p className="text-xs text-slate-500">For private instructors and solo mentors.</p>
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
                    <span>Audio Looper & Coding Sandbox</span>
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
                  className="w-full font-bold"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Get Solo Plan
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
                    <span className="font-semibold text-slate-900">Custom Domain (*.youracademy.com)</span>
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
                  className="w-full font-bold"
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
                    <span>Custom Enterprise Branding</span>
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

      {/* 7. FAQ Section */}
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

      {/* 8. Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-8 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-white text-sm">TechMadrasah</span>
            <span className="text-slate-600">|</span>
            <span>Educational SaaS Infrastructure</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#demos" className="hover:text-white transition-colors">Live Academies</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button onClick={() => onNavigateToAuth('login')} className="hover:text-white transition-colors cursor-pointer">Sign In</button>
            <button onClick={() => onNavigateToAuth('create-academy')} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">Launch Academy</button>
          </div>

          <p className="text-[11px] text-slate-500">© 2026 TechMadrasah Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export const SaasLandingPage = PlatformLandingPage;
