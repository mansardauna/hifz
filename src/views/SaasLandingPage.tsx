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
  Building,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Clock,
  MapPin,
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../components/ui';
import { AnkabitLogo, AnkabitSpiderIcon } from '../components/brand/AnkabitLogo';
import {
  HeroDashboardIllustration,
  MultiTenantNetworkIllustration,
  MadrasatArtIllustration,
  CodeAcademyArtIllustration,
  SchoolSisArtIllustration,
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
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<'madrasat' | 'code_academy' | 'school'>('madrasat');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    institution: '',
    specialty: 'madrasat',
    message: '',
  });

  const demoOptions = [
    {
      id: 'hifz-academy',
      title: 'Madrasat LMS',
      subtitle: 'Dar Al-Quran Academy',
      desc: '114 Surahs Medina Mushaf, audio reciter looper, Tajweed grading & live halaqahs.',
      badge: 'Quran & Tajweed',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: BookOpen,
      iconColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'code-academy',
      title: 'Code Academy LMS',
      subtitle: 'NextGen Tech Academy',
      desc: 'In-browser Monaco code sandbox, JS/Python runner, problem sets & PR reviews.',
      badge: 'Coding Sandbox',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Code2,
      iconColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'al-furqan',
      title: 'School SIS LMS',
      subtitle: 'Horizon International School',
      desc: 'Multi-subject gradebook, attendance roster, term GPA reports & parent portal.',
      badge: 'Academic SIS',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Award,
      iconColor: 'bg-purple-100 text-purple-700',
    },
  ];

  const liveAcademies = [
    {
      id: 'hifz-academy',
      name: 'Dar Al-Quran Madrasat',
      subdomain: 'dar-alquran.ankabit.app',
      specialty: 'Madrasat',
      desc: '114 Surahs Uthmani reader, authentic audio looper, live halaqahs, and Sanad studio.',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'code-academy',
      name: 'NextGen Code Academy',
      subdomain: 'code-academy.ankabit.app',
      specialty: 'Code Academy',
      desc: 'In-browser coding sandbox with live JavaScript & Python execution and developer forum.',
      icon: <Code2 className="w-5 h-5 text-blue-600" />,
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'al-furqan',
      name: 'Horizon International School',
      subdomain: 'horizon-school.ankabit.app',
      specialty: 'School',
      desc: 'Multi-subject curriculum, gradebook, attendance roster, and parent-teacher portal.',
      icon: <Award className="w-5 h-5 text-purple-600" />,
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'bayyinah-arabic',
      name: 'Bayyinah Classical Academy',
      subdomain: 'arabic.bayyinah.com',
      specialty: 'Language School',
      desc: 'Custom domain academy portal with classical grammar drills and interactive assignments.',
      icon: <Globe className="w-5 h-5 text-teal-600" />,
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  const faqs = [
    {
      q: 'How does Ankabit LMS power custom-branded academies?',
      a: 'Ankabit LMS provides complete turn-key infrastructure. Your academy runs under your own custom domain (e.g. learn.youracademy.com) or subdomain (*.ankabit.app) with your brand colors, custom logos, isolated student databases, and dedicated merchant gateways.',
    },
    {
      q: 'Can students access real live WebRTC video classrooms in the browser?',
      a: 'Yes! Powered by LiveKit Cloud WebRTC SFU, teachers and students connect with real camera, microphone, screen sharing, and interactive whiteboards with zero software installation required.',
    },
    {
      q: 'Which learning plugins and tracks are available?',
      a: 'Ankabit LMS includes modular workspaces for Madrasats (all 114 Surahs with Mishary/Husary/Minshawi audio looper and Sanad Ijazah studio), Code Academies (interactive in-browser compiler labs), and Schools (gradebooks, attendance, and parent portals).',
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
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <AnkabitLogo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 text-xs font-semibold text-slate-600">
            <a href="#demos" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Live Academies</a>
            <a href="#specialties" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Specialties</a>
            <a href="#architecture" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Platform Engine</a>
            <a href="#pricing" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Pricing</a>
            <a href="#contact" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-white transition-all">Contact</a>
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            The Autonomous Educational Operating System for Modern Academies
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ankabit LMS powers Madrasahs, coding bootcamps, and modern schools with dedicated custom domains, real WebRTC video classrooms, browser coding sandboxes, and autonomous tuition billing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigateToAuth('create-academy')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
            >
              Launch Your Branded Academy
            </Button>

            {/* Interactive Demo Selector Dropdown */}
            <div className="relative w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
                rightIcon={<ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDemoDropdownOpen ? 'rotate-180' : ''}`} />}
                className="w-full sm:w-auto bg-white justify-between sm:justify-center border-slate-300 hover:border-slate-400 font-bold"
              >
                Explore Live LMS Demos
              </Button>

              {/* Dropdown Menu */}
              {isDemoDropdownOpen && (
                <div className="absolute top-full sm:left-1/2 sm:-translate-x-1/2 mt-2 w-full sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Select Academy LMS Experience
                  </div>
                  <div className="space-y-1">
                    {demoOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setIsDemoDropdownOpen(false);
                            onNavigateToDemo(opt.id);
                          }}
                          className="w-full p-3 rounded-xl hover:bg-slate-50 text-left transition-colors flex items-start gap-3 cursor-pointer group border border-transparent hover:border-slate-200"
                        >
                          <div className={`w-9 h-9 rounded-xl ${opt.iconColor} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {opt.title}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>
                                {opt.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{opt.subtitle}</p>
                            <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>⚡ Instant switch to student/teacher/admin</span>
                  </div>
                </div>
              )}
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

      {/* 3. Live Sample Academies Powered by Ankabit LMS */}
      <section id="demos" className="py-20 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="success">Client Showcase</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Live Academies Powered by Ankabit LMS
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
            Tailored Engines for Every Educational Institution
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Each academy provisions specialized plugin modules tailored to their curriculum, pedagogy, and student demographic.
          </p>
        </div>

        {/* Specialty Selector Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold gap-1">
            <button
              onClick={() => setSelectedSpecialty('madrasat')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                selectedSpecialty === 'madrasat'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Madrasat Suite</span>
            </button>
            <button
              onClick={() => setSelectedSpecialty('code_academy')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                selectedSpecialty === 'code_academy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Code Academy Suite</span>
            </button>
            <button
              onClick={() => setSelectedSpecialty('school')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                selectedSpecialty === 'school'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>School SIS Suite</span>
            </button>
          </div>
        </div>

        {/* Specialty Preview Showcase */}
        <div className="max-w-5xl mx-auto space-y-6">
          {selectedSpecialty === 'madrasat' && (
            <>
              <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                      Madrasat Quranic Suite
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Complete Quranic Memory & Tajweed Operating System
                    </h3>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      Equipped with all 114 Surahs Uthmani calligraphy reader, multi-reciter looping player, teacher audio grading studio, and tamper-proof Sheikh Sanad certificates.
                    </p>
                  </div>
                  <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30">
                    <MadrasatArtIllustration className="w-full h-auto" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="space-y-3 border-emerald-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">114 Surah Uthmani Reader</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Real-time Uthmani script calligraphy and English translations dynamically streamed from AlQuran Cloud API.
                  </p>
                </Card>
                <Card className="space-y-3 border-emerald-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Mic className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Reciter Audio Looper & Homework</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Multi-reciter streaming player (Alafasy, Husary, Minshawi, Abdul Basit) with verse repetition, oral recorder, and auto-progression.
                  </p>
                </Card>
                <Card className="space-y-3 border-emerald-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Sanad & Ijazah Studio</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Authentic Islamic Khatam certificates with Sheikh signature seals and public tamper-proof QR code verifier.
                  </p>
                </Card>
              </div>
            </>
          )}

          {selectedSpecialty === 'code_academy' && (
            <>
              <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-500/30">
                      Developer Code Academy Suite
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Zero-Setup In-Browser Monaco Code Labs & Automated Grading
                    </h3>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      Instant JavaScript, TypeScript, and Python runtime execution, automated unit test test suites, and developer community forums.
                    </p>
                  </div>
                  <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30">
                    <CodeAcademyArtIllustration className="w-full h-auto" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="space-y-3 border-blue-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">In-Browser Code Sandbox Lab</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Integrated Monaco code editor supporting instant JavaScript, Python, and HTML/CSS runtime execution without setup.
                  </p>
                </Card>
                <Card className="space-y-3 border-blue-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Automated Code Test Grading</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instant feedback on programming problem sets with automated unit test verification and assertions.
                  </p>
                </Card>
                <Card className="space-y-3 border-blue-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Live Pair-Programming Huddles</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Collaborative code editing alongside live WebRTC video calling and multi-track screen sharing.
                  </p>
                </Card>
              </div>
            </>
          )}

          {selectedSpecialty === 'school' && (
            <>
              <div className="rounded-3xl border border-purple-200/80 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
                      Academic School SIS Suite
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Comprehensive School Information & Gradebook System
                    </h3>
                    <p className="text-xs text-purple-100/80 leading-relaxed">
                      Multi-term GPA calculations, period attendance rosters, automated parent WhatsApp alerts, and merchant fee collection.
                    </p>
                  </div>
                  <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30">
                    <SchoolSisArtIllustration className="w-full h-auto" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="space-y-3 border-purple-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Multi-Subject Gradebook & Reports</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Comprehensive academic GPA calculations, weighted test scoring, term report cards, and progress charts.
                  </p>
                </Card>
                <Card className="space-y-3 border-purple-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Attendance Roster & Timetable</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Daily period attendance registers, absence tracking, automated parent SMS/WhatsApp notices, and schedules.
                  </p>
                </Card>
                <Card className="space-y-3 border-purple-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Tuition & Fee Collection Gateways</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct connection to Stripe, Moyasar, and Flutterwave to collect term school fees and issue instant receipts.
                  </p>
                </Card>
              </div>
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
              Ankabit LMS Multi-Tenant Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Ankabit LMS operates behind the scenes as your cloud engine, while your students and teachers see only your academy brand.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col justify-between border-slate-200 hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <Badge variant="default">Free Starter</Badge>
                <h3 className="font-bold text-base text-slate-900">Community Free</h3>
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
                    <span>Subdomain (*.ankabit.app)</span>
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
                  className="w-full"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Start Free
                </Button>
              </div>
            </Card>

            {/* Solo */}
            <Card className="flex flex-col justify-between border-slate-200 shadow-sm">
              <div className="space-y-4">
                <Badge variant="default">Starter Plan</Badge>
                <h3 className="font-bold text-base text-slate-900">Academy Solo</h3>
                <p className="text-xs text-slate-500">For independent tutors and single instructors.</p>
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
                    <span>2 Teacher Seats</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Subdomain Hosted (academy.ankabit.app)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Curriculum & Lead Capture</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Independent Merchant Setup</span>
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
                  Get Solo Plan
                </Button>
              </div>
            </Card>

            {/* Growth */}
            <Card className="flex flex-col justify-between border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 shadow-md relative">
              <div className="space-y-4">
                <Badge variant="success">Most Popular</Badge>
                <h3 className="font-bold text-base text-slate-900">Institution Growth</h3>
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
                  className="w-full"
                  onClick={() => onNavigateToAuth('create-academy')}
                >
                  Launch Growth Plan
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
          <Badge variant="default">Get in Touch</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect with the Ankabit LMS Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Have questions about white-label provisioning, custom domains, or enterprise SLAs? Reach out to our solution architects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information & Channels */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <AnkabitSpiderIcon size={22} color="#34d399" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Ankabit Headquarters</h3>
                    <p className="text-xs text-slate-400">Global SaaS & Education Infrastructure</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <a
                    href="mailto:support@ankabit.app"
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Direct Support Email</div>
                      <div className="text-slate-400">support@ankabit.app</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Avg response time: &lt; 2 hours</div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/447000000000?text=Hello%20Ankabit%20Team%2C%20I%20would%20like%20to%20inquire%20about%20the%20LMS%20platform."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/30"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        WhatsApp Instant Advisory
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 font-mono">Live</span>
                      </div>
                      <div className="text-slate-400">Chat with a solutions engineer on WhatsApp</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Consultation Hours</div>
                      <div className="text-slate-400">Monday - Saturday (24/6 SLA Coverage)</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Guaranteed 99.98% Uptime SLA</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Systems Operational
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Inquiry Received Successfully!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Ankabit LMS. Our onboarding team has received your message and will email you with your institution demo access within 2 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', email: '', institution: '', specialty: 'madrasat', message: '' });
                    }}
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Dr. Tariq Mansoor"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Work / Academy Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="tariq@youracademy.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Academy / Institution Name
                      </label>
                      <Input
                        placeholder="e.g. Al-Bayan Quran Academy"
                        value={contactForm.institution}
                        onChange={(e) => setContactForm({ ...contactForm, institution: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Primary Specialty
                      </label>
                      <select
                        className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-400 transition-colors"
                        value={contactForm.specialty}
                        onChange={(e) => setContactForm({ ...contactForm, specialty: e.target.value })}
                      >
                        <option value="madrasat">Madrasat (Quran & Islamic Studies)</option>
                        <option value="code_academy">Code Academy (Software Engineering)</option>
                        <option value="school">School / Academic SIS</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      How can we help your institution? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-400 transition-colors resize-none"
                      placeholder="Tell us about your student volume, custom domain requirements, payment gateway needs, or migration plans..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-500">
                      🔒 No spam. We reply directly via email or WhatsApp within hours.
                    </p>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      rightIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Send Inquiry
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
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

      {/* 9. Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-8 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AnkabitLogo size="sm" textColor="text-white" />
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Autonomous Education OS</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#demos" className="hover:text-white transition-colors">Live Academies</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <button onClick={() => onNavigateToAuth('login')} className="hover:text-white transition-colors cursor-pointer">Sign In</button>
            <button onClick={() => onNavigateToAuth('create-academy')} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">Launch Academy</button>
          </div>

          <p className="text-[11px] text-slate-500">© 2026 Ankabit LMS Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

