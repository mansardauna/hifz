import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  Send,
  Sparkles,
  Star,
  Layers,
  Palette,
  CreditCard,
  Mic,
  Globe,
  Sliders,
  CheckCircle2,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface SaasLandingPageProps {
  onNavigateToAuth: (route: string) => void;
  onNavigateToDemo: (tenantId: string) => void;
}

export const SaasLandingPage: React.FC<SaasLandingPageProps> = ({
  onNavigateToAuth,
  onNavigateToDemo,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    institute: '',
    message: '',
  });

  const carouselItems = [
    {
      title: 'Al-Furqan Quran Academy',
      titleAr: 'أكاديمية الفرقان للقرآن الكريم',
      subdomain: 'al-furqan.hifz.app',
      qari: 'Shaykh Ahmad Al-Mansoor (10 Qira\'at Ijazah)',
      students: '1,420 Students Active',
      quote: '“Hifz gave our Madrasah a complete branded web presence with GrapesJS in 10 minutes. The audio homework recorder and Tajweed viewer transformed student retention by 85%.”',
      badge: 'Certified Madrasah',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Bayyinah Arabic & Tajweed Institute',
      titleAr: 'معهد بينة للغة العربية والتجويد',
      subdomain: 'bayyinah-arabic.hifz.app',
      qari: 'Ustadh Tariq Al-Hashimi (Senior Linguist)',
      students: '890 Students Active',
      quote: '“Managing student intake forms and live tuition subscriptions through Moyasar has saved our administrative board over 20 hours every week.”',
      badge: 'Classical Arabic',
      image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Dar Al-Quran Global Academy',
      titleAr: 'دار القرآن الكريم العالمية',
      subdomain: 'dar-alquran.hifz.app',
      qari: 'Shaykh Mahmoud Al-Banna (Ijazah Advisor)',
      students: '3,100 Students Active',
      quote: '“The multi-tenant architecture lets us isolate our branch campuses while providing verified Sanad chains directly on student completion certificates.”',
      badge: 'Global Network',
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does Hifz empower dedicated multi-tenant Quran academy infrastructure for our Madrasah?',
      a: 'Each registered academy receives complete data isolation, its own custom subdomain (e.g. al-furqan.localhost:3000 or yourmadrasah.hifz.app) or custom domain, dedicated GrapesJS visual page builder with Template Bank, and direct payment gateway credentials.',
    },
    {
      q: 'Can our students log in directly to our school portal without confusion?',
      a: 'Yes! Students either visit your direct school URL (e.g. al-furqan.hifz.app/login) where only your school branding appears, or enter their email address on the main sign in page which automatically detects their enrolled academy.',
    },
    {
      q: 'How does the interactive Uthmani Quran viewer and recitation looper work?',
      a: 'Hifz renders authentic Uthmani script typography with live color-coded Tajweed rules (Ghunnah, Qalqalah, Madd, Ikhfa, Idgham), verse-by-verse looping (1x, 3x, 5x), and an in-browser audio recorder allowing students to record oral homework directly from their mic with the HTML5 MediaRecorder API.',
    },
    {
      q: 'Can we collect student tuition directly into our bank account or Stripe?',
      a: 'Absolutely. Inside the Admin Dashboard under "Payment Gateways", you can configure your own Stripe Connect keys, Moyasar (for Mada and Apple Pay in Saudi Arabia and GCC), or direct Bank Wire instructions. 100% of student tuition goes directly to your institution.',
    },
    {
      q: 'How does the GrapesJS visual builder work with the Template Bank?',
      a: 'Inside the Admin Dashboard, click "Template Bank" to 1-click load full responsive Islamic Center layouts into the GrapesJS canvas. Customize any text, layout, or admissions form block, and click "Publish to Live Site" to immediately update your public academy page.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. Main Header Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md border border-emerald-800 shrink-0">
              🕌
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 tracking-tight leading-none block">
                Hifz
              </span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase block mt-0.5">
                SANAD-VERIFIED QURAN & ARABIC PLATFORM
              </span>
            </div>
          </div>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold font-display text-slate-700 uppercase tracking-wider">
            <a href="#about" className="hover:text-emerald-700 transition-colors">
              About
            </a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">
              Pricing Plans
            </a>
            <a href="#contact" className="hover:text-emerald-700 transition-colors">
              Contact Us
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigateToAuth('login')}
              className="px-4 py-2 text-xs font-bold font-display text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigateToAuth('create-academy')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Launch Academy
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-700 hover:text-emerald-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3 font-display text-sm font-semibold">
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-emerald-700 border-b border-slate-100"
            >
              About
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-emerald-700 border-b border-slate-100"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-emerald-700 border-b border-slate-100"
            >
              Pricing Plans
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-emerald-700 border-b border-slate-100"
            >
              Contact Us
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToAuth('login');
                }}
                className="w-full py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-md text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToAuth('create-academy');
                }}
                className="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-md text-center shadow-sm"
              >
                Launch Academy
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-8 bg-slate-950 text-white text-center font-sans overflow-hidden">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        <div className="relative max-w-5xl mx-auto space-y-6">
          <p
            className="text-xl sm:text-3xl text-amber-400 font-bold"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
          </p>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold font-display text-white uppercase tracking-tight leading-[1.15]">
            THE SACRED LMS & INFRASTRUCTURE <br />
            FOR <span className="text-emerald-400">QURAN ACADEMIES</span> &{' '}
            <span className="text-amber-400">MADRASAHS</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Launch your own branded Quran academy in minutes with custom subdomains, real GrapesJS visual website builder, interactive Uthmani Tajweed LMS, and automated tuition billing.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={() => onNavigateToAuth('create-academy')}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-display text-sm rounded-md shadow-md transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Your Madrasah</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateToDemo('al-furqan')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold font-display text-sm rounded-md shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              Explore Live Academy
            </button>
          </div>
        </div>
      </section>

      {/* 3. Split Quick Callout Banner */}
      <div className="max-w-6xl mx-auto -mt-8 sm:-mt-12 relative z-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 shadow-md rounded-md overflow-hidden border border-slate-200">
          {/* Left Summary */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 border-l-4 border-emerald-600 flex flex-col justify-center">
            <span className="text-emerald-700 font-bold font-display text-xs uppercase tracking-wider">
              POWERING OVER 1,400+ QURAN INSTITUTES WORLDWIDE
            </span>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Equip your faculty with real-time Tajweed color coding, audio recitation looper, automated oral homework grading, and direct Stripe & Moyasar tuition collections.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-2 font-semibold">
              Instant Setup • No Coding Required • Custom Domain & Sanad Ready
            </p>
          </div>

          {/* Right Green Box */}
          <div className="bg-emerald-700 text-white p-6 sm:p-8 flex flex-col justify-center items-center text-center">
            <span className="text-xs text-emerald-100 font-semibold font-display uppercase tracking-wider">
              TALK TO AN ADVISOR
            </span>
            <div className="w-8 h-0.5 bg-emerald-400 my-2 rounded-md" />
            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">+1 800 123 4567</p>
            <a
              href="#contact"
              className="mt-4 px-6 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold font-display rounded-md shadow-md transition-colors uppercase tracking-wider"
            >
              CONTACT ADVISOR
            </a>
          </div>
        </div>
      </div>

      {/* 4. Platform Capabilities Grid */}
      <section id="about" className="py-20 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-emerald-700 font-extrabold font-display text-xs uppercase tracking-widest block mb-2">
            COMPLETE OPERATING SYSTEM FOR QURAN INSTITUTES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Built ground-up for Quran memorization, Tajweed pedagogy, and multi-tenant Madrasah operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="p-6 sm:p-7 rounded-md border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              GrapesJS Visual Canvas & Template Bank
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Design beautiful landing pages using a real drag-and-drop canvas with Tailwind CSS, custom Quran blocks, and 1-click curated Islamic templates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-7 rounded-md border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center mb-5 border border-amber-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              Interactive Tajweed & Uthmani Script
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Render authentic Medina Mushaf typography with color-coded Tajweed rules for Ghunnah, Qalqalah, Madd, Ikhfa, and Idgham in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-7 rounded-md border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center mb-5 border border-sky-100">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              Audio Looper & Homework Recorder
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Students repeat ayahs with 1x, 3x, 5x loop counts, listen to world-renowned Qaris, and submit oral recitation recordings for teacher grading.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 sm:p-7 rounded-md border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center mb-5 border border-purple-100">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              Direct Tuition Gateways
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Collect student tuition directly into your account using Stripe Connect, Moyasar (Mada/Apple Pay for GCC), or custom Bank Wire transfers.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 sm:p-7 rounded-md border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              Custom Subdomains & Multi-Tenancy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Each academy operates on its own dedicated subdomain ([name].hifz.app) or custom domain with isolated database records and branding.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 sm:p-7 rounded-md border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center mb-5 border border-rose-100">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              Admissions Form Builder & CRM
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Custom intake forms, student lead pipeline, enrollment statuses, and tuition payment tracking in a unified administrative dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Metrics Banner */}
      <section className="bg-emerald-900 text-white py-14 px-4 sm:px-8 border-y border-emerald-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center font-sans">
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">1,475+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-widest mt-1">
              ACTIVE MADRASAHS & TUTORS
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">85,000+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-widest mt-1">
              ACTIVE QURAN STUDENTS
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">2.4M+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-widest mt-1">
              AYAH RECITATIONS GRADED
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">$2.4M+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-widest mt-1">
              TUITION PROCESSED DIRECTLY
            </p>
          </div>
        </div>
      </section>

      {/* 6. Showcase Carousel */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-emerald-700 font-extrabold font-display text-xs uppercase tracking-widest block mb-1">
                ACADEMY SHOWCASE
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-900">
                Trusted by leading institutes worldwide
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-9 h-9 rounded-md bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-9 h-9 rounded-md bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 shadow-md p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold font-display">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{carouselItems[currentSlide].badge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                {carouselItems[currentSlide].title}
              </h3>
              <p className="text-sm font-semibold text-emerald-700 font-mono">
                {carouselItems[currentSlide].subdomain}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                {carouselItems[currentSlide].quote}
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">{carouselItems[currentSlide].qari}</p>
                <p className="text-xs text-slate-500">{carouselItems[currentSlide].students}</p>
              </div>
            </div>

            <div className="relative rounded-md overflow-hidden shadow-md border border-slate-200 h-64 sm:h-72">
              <img
                src={carouselItems[currentSlide].image}
                alt={carouselItems[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. SaaS Subscription Pricing */}
      <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-emerald-700 font-extrabold font-display text-xs uppercase tracking-widest block mb-2">
            FLEXIBLE PLATFORM SUBSCRIPTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Start Your Academy On Your Terms
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
            All plans include complete custom academy branding, custom subdomains, and GrapesJS editor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* Plan 1: Independent Qari */}
          <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold font-display uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                🌱 Independent Qari
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-slate-900">$49</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Perfect for private Quran tutors and small circles
              </p>

              <div className="my-6 border-t border-slate-100" />

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to <strong>50 active students</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Branded Subdomain (<strong>[name].hifz.app</strong>)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GrapesJS Visual Canvas Builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Tajweed Quran Viewer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Stripe Connect Direct Payouts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToAuth('create-academy')}
              className="mt-8 w-full py-2.5 rounded-md border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold font-display text-xs transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Plan 2: Madrasah Growth (Popular) */}
          <div className="bg-white p-6 sm:p-8 rounded-md border-2 border-emerald-600 shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-extrabold font-display uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              MOST POPULAR
            </div>

            <div>
              <span className="text-xs font-bold font-display uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                ⭐ Madrasah Growth
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-slate-900">$149</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                For established Madrasahs & Quran institutes
              </p>

              <div className="my-6 border-t border-slate-100" />

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to <strong>350 active students</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Domain (<strong>learn.yourmadrasah.com</strong>)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Template Bank Access (3 Islamic Layouts)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Student Audio Homework Looper & Recorder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Moyasar (Mada/Apple Pay) & Stripe</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-Teacher Grading CRM</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToAuth('create-academy')}
              className="mt-8 w-full py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs shadow-md transition-colors cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Plan 3: Global Network */}
          <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold font-display uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                👑 Global Enterprise
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-slate-900">$399</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                For multi-branch Quran institutes and universities
              </p>

              <div className="my-6 border-t border-slate-100" />

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Unlimited students & teachers</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-branch campus management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Sanad Ijazah certificate builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated account manager & SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom backend REST API integration</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToAuth('create-academy')}
              className="mt-8 w-full py-2.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold font-display text-xs transition-colors cursor-pointer"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-700 font-extrabold font-display text-xs uppercase tracking-widest block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900">
              Everything you need to know about setting up your dedicated Quran academy
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 text-start font-bold font-display text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      activeFaq === index ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact / Consultation Form Section */}
      <section id="contact" className="py-20 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-emerald-700 font-extrabold font-display text-xs uppercase tracking-widest block">
              GET IN TOUCH
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Schedule a Platform Consultation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Need guidance on onboarding teachers, migrating existing student databases, or connecting your local bank account? Our solutions engineers are here to assist.
            </p>

            <div className="space-y-4 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Direct Support Line</p>
                  <p className="text-slate-500 font-mono">+1 800 123 4567 / +966 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Admissions & Migration Email</p>
                  <p className="text-slate-500 font-mono">admissions@hifz.app / support@hifz.app</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Global Headquarters</p>
                  <p className="text-slate-500">King Fahd Road, Riyadh, Kingdom of Saudi Arabia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md">
            {contactSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Consultation Request Received
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong>{contactForm.name}</strong>. A dedicated onboarding engineer will reach out to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Shaykh Ahmad Al-Mansoor"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@madrasah.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Madrasah or Academy Name</label>
                  <input
                    type="text"
                    value={contactForm.institute}
                    onChange={(e) => setContactForm({ ...contactForm, institute: e.target.value })}
                    placeholder="e.g. Al-Furqan Quran Institute"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">How can we assist you?</label>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your current student count, curriculum goals, or migration needs..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs rounded-md shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Consultation Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-slate-950 text-white py-12 px-4 sm:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕌</span>
            <span className="font-extrabold font-display text-white text-base">Hifz</span>
            <span className="text-slate-500">— Dedicated Quran & Arabic LMS</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            © 2026 Hifz Inc. All rights reserved. Powering authentic Islamic education globally.
          </p>
        </div>
      </footer>
    </div>
  );
};
