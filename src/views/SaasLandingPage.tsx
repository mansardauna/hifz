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
  Code2
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../components/ui';

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
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const faqs = [
    {
      q: 'How does the multi-tenant architecture work?',
      a: 'Every registered institution receives complete data isolation, dedicated subdomains (e.g. academy.hifz.app), custom domain support, and isolated student records.',
    },
    {
      q: 'Can students access live video classrooms directly in the browser?',
      a: 'Yes. Built-in WebRTC video conferencing and collaborative whiteboards allow instructors to host live sessions with no external software required.',
    },
    {
      q: 'Which subject tracks are supported?',
      a: 'The platform features modular workspaces for Quran & Tajweed studies (with Uthmani script and audio looper), Coding & Tech academies (with browser sandboxes), and Language schools.',
    },
    {
      q: 'How are tuition payments processed?',
      a: 'Administrators can connect their own Stripe Connect accounts or Moyasar (for Mada/Apple Pay) to collect 100% of student tuition directly into their bank accounts.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. Header Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight leading-none block">
                Hifz Platform
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
                Multi-Tenant Academy Infrastructure
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#modules" className="hover:text-slate-900 transition-colors">Specialties</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </div>

          <div className="hidden sm:flex items-center gap-2.5">
            <Button variant="ghost" size="sm" onClick={() => onNavigateToAuth('login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => onNavigateToAuth('create-academy')}>
              Launch Academy
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-xs font-semibold">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Features</a>
            <a href="#modules" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Specialties</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700">FAQ</a>
            <div className="pt-2 flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => { setIsMobileMenuOpen(false); onNavigateToAuth('login'); }}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => { setIsMobileMenuOpen(false); onNavigateToAuth('create-academy'); }}>
                Launch Academy
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <Badge variant="success">Next-Gen LMS</Badge>
          <span>Modern Educational Operating System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
          Launch and scale your online academy with complete autonomy
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Custom domain multitenancy, visual page builder, real-time video classrooms, collaborative whiteboards, and automated tuition processing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigateToAuth('create-academy')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Your Academy
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigateToDemo('al-furqan')}
          >
            Explore Live Academy Demo
          </Button>
        </div>
      </section>

      {/* 3. Core Platform Capabilities */}
      <section id="features" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Everything required to operate an online academy</h2>
          <p className="text-xs text-slate-500 mt-1">Modular tools designed for instructors, administrators, and students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Live Video Classrooms</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              In-browser video conferencing, active speaker detection, screen sharing, and integrated live discussion.
            </p>
          </Card>

          <Card>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Visual Page Builder</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Design high-converting landing pages with pre-built multi-niche templates and responsive visual blocks.
            </p>
          </Card>

          <Card>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Direct Tuition Billing</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Accept credit cards, Apple Pay, and regional payments with Stripe Connect and Moyasar integration.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Modular Specialties Grid */}
      <section id="modules" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dedicated Specialized Workspaces</h2>
          <p className="text-xs text-slate-500 mt-1">Pluggable learning environments tailored to your institution type.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-200 bg-emerald-50/30">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Quran & Islamic Studies</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Medina Mushaf reader, color-coded Tajweed rules, audio verse looper, and oral homework recording engine.
            </p>
          </Card>

          <Card className="border-blue-200 bg-blue-50/30">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-4 font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Coding & Tech Bootcamps</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              In-browser code editor, interactive coding challenges, live HTML/JS sandbox runner, and automated test validation.
            </p>
          </Card>

          <Card className="border-purple-200 bg-purple-50/30">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-4 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Languages & Academic School</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Structured curriculum hierarchies, video lessons, downloadable study materials, and interactive quizzes.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Pricing Plans */}
      <section id="pricing" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Predictable Pricing for Institutions</h2>
          <p className="text-xs text-slate-500 mt-1">Select the tier that matches your academy student capacity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <h3 className="text-sm font-bold text-slate-900">Starter</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ideal for independent tutors and small classes</p>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold font-mono text-slate-900">$49</span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Up to 50 active students</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Custom academy subdomain</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Real-time video & whiteboard</li>
            </ul>
            <Button variant="outline" className="w-full" onClick={() => onNavigateToAuth('create-academy')}>
              Get Started
            </Button>
          </Card>

          <Card className="border-slate-900 ring-1 ring-slate-900 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Growth</h3>
              <Badge variant="success">Most Popular</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">For growing madrasahs and tech bootcamps</p>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold font-mono text-slate-900">$149</span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Up to 250 active students</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Custom domain with SSL</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> GrapesJS visual page builder</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited recorded classes</li>
            </ul>
            <Button variant="primary" className="w-full" onClick={() => onNavigateToAuth('create-academy')}>
              Launch Growth Plan
            </Button>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-slate-900">Enterprise</h3>
            <p className="text-xs text-slate-500 mt-0.5">For global institutions & multi-branch schools</p>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold font-mono text-slate-900">$299</span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited active students</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Multi-branch isolation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated database & SLA</li>
            </ul>
            <Button variant="outline" className="w-full" onClick={() => onNavigateToAuth('create-academy')}>
              Contact Enterprise
            </Button>
          </Card>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section id="faq" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto border-t border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-slate-800' : ''
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

      {/* 7. Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-800">Hifz Educational Operating System</span>
          </div>
          <p>© {new Date().getFullYear()} Hifz Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
