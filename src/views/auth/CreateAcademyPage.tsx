import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { ToastMessage } from '../../components/ui/Toast';
import {
  Building2,
  Globe,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Code2,
  Terminal,
  BookOpen,
  GraduationCap,
  School as SchoolIcon,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Badge } from '../../components/ui';
import { AuthHeroIllustration } from '../../components/illustrations/Illustrations2D';
import { TenantNiche } from '../../types';

interface CreateAcademyPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess: () => void;
}

export const CreateAcademyPage: React.FC<CreateAcademyPageProps> = ({
  onAddToast,
  onSuccess,
}) => {
  const router = useRouter();
  const { register } = useAuth();
  const { language } = useTenant();

  const [institutionType, setInstitutionType] = useState<'madrasat' | 'code_academy' | 'school'>('madrasat');
  const [academyName, setAcademyName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [adminName, setAdminName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const institutionConfigs = {
    madrasat: {
      title: 'Madrasat',
      subtitle: 'Quranic & Islamic Institute',
      desc: '114 Surahs Uthmani reader, audio recitation looper, live halaqahs, Sanad & Ijazah studio.',
      brandColor: '#059669',
      badge: 'Quran & Tajweed',
      icon: BookOpen,
      placeholderName: 'e.g. Dar Al-Quran Madrasat',
      placeholderSubdomain: 'dar-alquran',
    },
    code_academy: {
      title: 'Code Academy',
      subtitle: 'Coding Bootcamp & Tech Lab',
      desc: 'In-browser code sandbox, JS/Python runner, problem sets, and developer community.',
      brandColor: '#2563eb',
      badge: 'Coding Sandbox',
      icon: Code2,
      placeholderName: 'e.g. NextGen Tech Academy',
      placeholderSubdomain: 'nextgen-code',
    },
    school: {
      title: 'School',
      subtitle: 'K-12, Higher Ed & Languages',
      desc: 'Multi-subject gradebook, attendance roster, term report cards, and parent-teacher portal.',
      brandColor: '#7c3aed',
      badge: 'Academic SIS',
      icon: SchoolIcon,
      placeholderName: 'e.g. Horizon International School',
      placeholderSubdomain: 'horizon-school',
    },
  };

  const handleTypeSelect = (type: 'madrasat' | 'code_academy' | 'school') => {
    setInstitutionType(type);
    if (!academyName) {
      setSubdomain(institutionConfigs[type].placeholderSubdomain);
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academyName || !subdomain || !adminName || !email || !password) {
      onAddToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please complete all fields to register your academy.',
      });
      return;
    }

    setIsSubmitting(true);
    const selectedConfig = institutionConfigs[institutionType];

    try {
      // 1. Create Tenant Record in Backend/DB
      await fetch('/api/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: academyName,
          subdomain,
          niche: institutionType,
          brandColor: selectedConfig.brandColor,
        }),
      });

      // 2. Create Admin Account in Backend/DB
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          name: adminName,
          role: 'admin',
          subdomain,
        }),
      });

      // 3. Update Client Session State
      register(adminName, email, 'admin', subdomain);

      onAddToast({
        type: 'success',
        title: 'Academy Setup Completed',
        message: `Welcome to ${academyName}! Your ${selectedConfig.title} dashboard is ready.`,
      });

      setIsSubmitting(false);
      onSuccess();
      router.push(`/${subdomain}/admin`);
    } catch (err: any) {
      console.warn('Academy setup network error, using client fallback:', err);
      register(adminName, email, 'admin', subdomain);
      setIsSubmitting(false);
      onSuccess();
      router.push(`/${subdomain}/admin`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-center items-center p-3 sm:p-6 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
        {/* Left Hero Visual Card */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-black text-white text-base block leading-none">Ankabit LMS</span>
                <span className="text-[10px] text-emerald-400 font-mono">Multi-Tenant Learning Engine</span>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Launch Your Custom-Branded Academy
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Choose your institution specialty to auto-configure your custom domain, tailored student classroom workspaces, and merchant payment gateways.
              </p>
            </div>
          </div>

          {/* 2D Vector Graphic */}
          <div className="my-6 max-w-[260px] mx-auto">
            <AuthHeroIllustration className="w-full h-auto" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1 relative z-10 shadow-inner">
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              {institutionConfigs[institutionType].subtitle}
            </p>
            <p className="text-[11px] text-slate-300">
              {institutionConfigs[institutionType].desc}
            </p>
          </div>
        </div>

        {/* Right Form Wizard */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-extrabold text-slate-900 text-sm">Ankabit LMS</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors cursor-pointer"
              >
                Platform Home
              </button>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Your Institution
            </h1>
            <p className="text-xs text-slate-500">
              Select your institution type and enter credentials to provision your dedicated portal.
            </p>
          </div>

          {/* STEP 1: Institution Type Selection Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Step 1: Choose Institution Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'madrasat', config: institutionConfigs.madrasat },
                { id: 'code_academy', config: institutionConfigs.code_academy },
                { id: 'school', config: institutionConfigs.school },
              ].map(({ id, config }) => {
                const Icon = config.icon;
                const isSelected = institutionType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleTypeSelect(id as any)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer select-none flex flex-col justify-between min-h-[110px] ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: config.brandColor }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                      </div>
                      <div className="font-black text-xs text-slate-900">{config.title}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{config.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Institution Setup Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Institution Name"
                type="text"
                required
                value={academyName}
                onChange={(e) => {
                  setAcademyName(e.target.value);
                  if (!subdomain) {
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20));
                  }
                }}
                placeholder={institutionConfigs[institutionType].placeholderName}
                leftIcon={<Building2 className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dedicated Subdomain
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 shadow-xs">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    placeholder={institutionConfigs[institutionType].placeholderSubdomain}
                    className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 font-mono"
                  />
                  <span className="px-2.5 py-2 bg-slate-100 border-l border-slate-200 text-slate-500 text-xs font-mono select-none shrink-0">
                    .ankabit.app
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Administrator Name"
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Prof. Tariq Al-Mansoor"
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Admin Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@academy.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Admin Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center shadow-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Provisioning Academy...' : `Launch ${institutionConfigs[institutionType].title} & Enter Dashboard`}
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an academy account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-bold text-slate-900 hover:underline cursor-pointer"
            >
              Sign In &rarr;
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-400">
        © 2026 Ankabit LMS Cloud Platform • Multi-Tenant Education Infrastructure
      </footer>
    </div>
  );
};

