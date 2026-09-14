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
  ArrowRight,
  Sparkles,
  Code2,
  BookOpen,
  School as SchoolIcon,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Badge } from '../../components/ui';
import { AnkabitLogo, AnkabitSpiderIcon } from '../../components/brand/AnkabitLogo';
import {
  MadrasatArtIllustration,
  CodeAcademyArtIllustration,
  SchoolSisArtIllustration,
} from '../../components/illustrations/Illustrations2D';
import { TenantNiche } from '../../types';

interface CreateAcademyPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (subdomain?: string) => void;
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
  const [isSubdomainCustomized, setIsSubdomainCustomized] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const institutionConfigs = {
    madrasat: {
      title: 'Madrasat',
      subtitle: 'Quranic & Islamic Institute',
      desc: '114 Surahs Medina Mushaf reader, audio recitation looper, live halaqahs, and Sanad Ijazah verification studio.',
      brandColor: '#059669',
      badge: 'Quran & Tajweed Track',
      icon: BookOpen,
      placeholderName: 'Dar Al-Quran Madrasat',
      placeholderSubdomain: 'dar-alquran',
      glowColor: 'bg-emerald-500/20',
      Illustration: MadrasatArtIllustration,
    },
    code_academy: {
      title: 'Code Academy',
      subtitle: 'Coding Bootcamp & Tech Lab',
      desc: 'In-browser Monaco code sandbox, live JS/Python execution, automated unit test grading, and Git PR reviews.',
      brandColor: '#2563eb',
      badge: 'Software Engineering Track',
      icon: Code2,
      placeholderName: 'NextGen Code Academy',
      placeholderSubdomain: 'nextgen-code',
      glowColor: 'bg-blue-500/20',
      Illustration: CodeAcademyArtIllustration,
    },
    school: {
      title: 'School',
      subtitle: 'K-12, Higher Ed & Languages',
      desc: 'Multi-subject gradebook, attendance roster, term GPA report cards, and parent-teacher conference portal.',
      brandColor: '#7c3aed',
      badge: 'Academic SIS Track',
      icon: SchoolIcon,
      placeholderName: 'Horizon International School',
      placeholderSubdomain: 'horizon-school',
      glowColor: 'bg-purple-500/20',
      Illustration: SchoolSisArtIllustration,
    },
  };

  const currentConfig = institutionConfigs[institutionType];
  const CurrentIllustration = currentConfig.Illustration;

  const handleTypeSelect = (type: 'madrasat' | 'code_academy' | 'school') => {
    setInstitutionType(type);
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubdomainCustomized(true);
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
    setSubdomain(val);
  };

  // Real-time Subdomain Availability Check
  const subdomainCheck = React.useMemo(() => {
    const trimmed = subdomain.toLowerCase().trim();
    if (!trimmed) return { status: 'empty', message: '' };
    if (trimmed.length < 3) return { status: 'invalid', message: 'Subdomain must be at least 3 characters.' };

    const reservedSubdomains = [
      'al-furqan',
      'hifz-academy',
      'code-academy',
      'school-demo',
      'super-admin',
      'platform',
      'demo',
      'api',
      'admin',
      'mail',
      'auth',
      'login',
      'register',
      'root',
    ];

    if (reservedSubdomains.includes(trimmed)) {
      return { status: 'taken', message: `"${trimmed}" is a reserved platform name. Please choose another.` };
    }

    if (typeof window !== 'undefined') {
      const exists = localStorage.getItem(`tenant_config_${trimmed}`);
      if (exists) {
        return { status: 'taken', message: `Subdomain "${trimmed}" is already registered.` };
      }
    }

    return { status: 'available', message: `${trimmed}.ankabit.app is available!` };
  }, [subdomain]);

  // Real-time Email Availability Check
  const emailCheck = React.useMemo(() => {
    const trimmed = email.toLowerCase().trim();
    if (!trimmed || !trimmed.includes('@')) return { status: 'empty', message: '' };

    if (typeof window !== 'undefined') {
      const existingSubdomain = localStorage.getItem(`tenant_admin_email_${trimmed}`);
      if (existingSubdomain) {
        return {
          status: 'taken',
          message: `An academy is already registered with ${trimmed}. Please sign in instead.`,
        };
      }
    }
    return { status: 'available', message: '' };
  }, [email]);

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

    if (subdomainCheck.status === 'taken') {
      onAddToast({
        type: 'error',
        title: 'Subdomain Already Taken',
        message: `The subdomain "${subdomain}" is already in use. Please choose a unique subdomain.`,
      });
      return;
    }

    if (emailCheck.status === 'taken') {
      onAddToast({
        type: 'warning',
        title: 'Account Already Exists',
        message: `An account with email "${email}" is already registered. Please sign in to your existing academy.`,
        action: {
          label: 'Sign In to Dashboard',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    setIsSubmitting(true);
    const selectedConfig = institutionConfigs[institutionType];

    try {
      // 1. Create Tenant Record in Backend/DB with conflict check
      const tenantRes = await fetch('/api/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: academyName,
          subdomain,
          niche: institutionType,
          brandColor: selectedConfig.brandColor,
        }),
      });

      if (tenantRes.status === 409) {
        setIsSubmitting(false);
        onAddToast({
          type: 'error',
          title: 'Subdomain Conflict',
          message: `The subdomain "${subdomain}" is already taken in the database. Please select another.`,
        });
        return;
      }

      // 2. Create Admin Account in Backend/DB with user check
      const authRes = await fetch('/api/auth', {
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

      if (authRes.status === 409) {
        setIsSubmitting(false);
        onAddToast({
          type: 'warning',
          title: 'User Email Already Exists',
          message: `An account with email "${email}" already exists. Please sign in.`,
          action: {
            label: 'Go to Sign In',
            onClick: () => router.push('/login'),
          },
        });
        return;
      }

      // Save clean tenant configuration locally for immediate isolated multi-tenant session
      if (typeof window !== 'undefined') {
        try {
          const cleanTenant = {
            id: `tenant-${subdomain}`,
            name: academyName,
            subdomain,
            niche: institutionType,
            theme: {
              primaryColor: selectedConfig.brandColor,
              primaryHover: selectedConfig.brandColor,
              secondaryColor: '#0f172a',
              accentColor: '#10b981',
              backgroundColor: '#ffffff',
              surfaceColor: '#f8fafc',
              textColor: '#0f172a',
              borderRadius: 'rounded-xl',
              fontFamily: 'Inter',
            },
            subscriptionPlan: 'free',
            pageBlocks: [],
            pricingPlans: [],
            paymentGateways: [],
            forms: [],
            customFormFields: [],
            contactEmail: email,
            contactPhone: '',
            defaultDirection: 'ltr',
          };
          localStorage.setItem(`tenant_config_${subdomain}`, JSON.stringify(cleanTenant));
          localStorage.setItem(`tenant_admin_email_${email.toLowerCase().trim()}`, subdomain);
        } catch (e) {}
      }

      // 3. Update Client Session State
      register(adminName, email, 'admin', subdomain);

      onAddToast({
        type: 'success',
        title: 'Academy Provisioned 🎉',
        message: `Welcome to ${academyName}! Your ${selectedConfig.title} portal is live.`,
      });

      setIsSubmitting(false);
      if (onSuccess) onSuccess(subdomain);
      else router.push(`/${subdomain}/admin`);
    } catch (err: any) {
      console.warn('Academy setup network error, using client fallback:', err);
      register(adminName, email, 'admin', subdomain);
      setIsSubmitting(false);
      if (onSuccess) onSuccess(subdomain);
      else router.push(`/${subdomain}/admin`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between p-3 sm:p-6 sm:py-8 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl mx-auto mb-3 flex items-center justify-between px-2">
        <div className="cursor-pointer" onClick={() => router.push('/')}>
          <AnkabitLogo size="md" />
        </div>

        <button
          onClick={() => router.push('/')}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer transition-all hover:border-slate-300"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Platform Home</span>
        </button>
      </div>

      {/* Main Container - High Capacity Screen-Filling 6XL Card */}
      <div className="flex-1 flex items-center justify-center my-2">
        <div className="w-full max-w-6xl min-h-[84vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
          {/* Left Hero Dynamic Niche Card (5 Columns) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
            {/* Dynamic Glow based on Niche */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${currentConfig.glowColor} rounded-full blur-3xl pointer-events-none transition-all duration-300`} />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <AnkabitLogo size="md" textColor="text-white" />
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                  {currentConfig.badge}
                </span>
              </div>

              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Launch Your Branded {currentConfig.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {currentConfig.desc}
                </p>
              </div>
            </div>

            {/* Dynamic Niche Vector Illustration */}
            <div className="my-6 max-w-[320px] mx-auto transition-all duration-300">
              <CurrentIllustration className="w-full h-auto drop-shadow-2xl" />
            </div>

            {/* Dynamic Feature Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 relative z-10 shadow-inner">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentConfig.subtitle}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Subdomain, live virtual rooms, course builder, and payments included.
              </p>
            </div>
          </div>

          {/* Right Form Container (7 Columns) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-700">
                    Academy Setup
                  </span>
                  <span className="text-xs text-slate-400">&lt; 30 seconds</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create Your Academy
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your track and enter your academy credentials to get started.
                </p>
              </div>

              {/* Institution Track Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer select-none flex flex-col justify-between min-h-[110px] ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-lg ring-2 ring-slate-900/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                              style={{ backgroundColor: config.brandColor }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-emerald-400 font-bold" />}
                          </div>
                          <div className={`font-black text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {config.title}
                          </div>
                          <div className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {config.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Academy Details Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Academy Name"
                    type="text"
                    required
                    value={academyName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAcademyName(val);
                      if (!isSubdomainCustomized) {
                        const slug = val
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .trim()
                          .replace(/[\s_]+/g, '-')
                          .replace(/-+/g, '-')
                          .slice(0, 24);
                        setSubdomain(slug);
                      }
                    }}
                    placeholder={currentConfig.placeholderName}
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />

                  <div className="w-full space-y-1.5 font-sans">
                    <label htmlFor="subdomain-input" className="block text-sm text-slate-700">
                      Subdomain
                    </label>
                    <div
                      className={`relative flex items-center rounded-xl border bg-white overflow-hidden transition-colors ${
                        subdomainCheck.status === 'taken' || subdomainCheck.status === 'invalid'
                          ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                          : subdomainCheck.status === 'available'
                          ? 'border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20'
                          : 'border-slate-300 hover:border-slate-400 focus-within:border-emerald-600'
                      }`}
                    >
                      <div className="pl-3.5 pr-1 flex items-center pointer-events-none text-slate-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <input
                        id="subdomain-input"
                        type="text"
                        required
                        value={subdomain}
                        onChange={handleSubdomainChange}
                        placeholder={currentConfig.placeholderSubdomain}
                        className="w-full px-2 py-2.5 text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-mono"
                      />
                      <span className="px-3 py-2.5 bg-slate-50 border-l border-slate-200 text-slate-500 text-xs sm:text-sm font-mono font-medium select-none shrink-0">
                        .ankabit.app
                      </span>
                    </div>

                    {/* Subdomain Status Hint */}
                    {subdomainCheck.status !== 'empty' && (
                      <p
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          subdomainCheck.status === 'taken' || subdomainCheck.status === 'invalid'
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        <span>{subdomainCheck.status === 'available' ? '✓' : '⚠️'}</span>
                        <span>{subdomainCheck.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Tariq Mansoor"
                    leftIcon={<User className="w-4 h-4" />}
                  />

                  <div className="space-y-1">
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@academy.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                    />
                    {emailCheck.status === 'taken' && (
                      <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{emailCheck.message}</span>
                      </p>
                    )}
                  </div>

                  <Input
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto font-bold shadow-md px-6"
                  >
                    {isSubmitting ? 'Creating Academy...' : 'Launch Academy'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Bottom Sign In Link */}
            <div className="pt-4 border-t border-slate-200/80 text-center text-xs text-slate-500">
              Already have an academy?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Sign in to your dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 Ankabit LMS • Autonomous Multi-Tenant Educational Operating System</p>
      </footer>
    </div>
  );
};
