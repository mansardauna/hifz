import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input } from '../ui';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Shield,
  Layout,
  Check,
  Award,
  Globe,
  Code2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnkabitLogo, AnkabitSpiderIcon } from '../brand/AnkabitLogo';
import {
  MadrasatArtIllustration,
  CodeAcademyArtIllustration,
  SchoolSisArtIllustration,
  MultiTenantNetworkIllustration,
  HeroDashboardIllustration,
} from '../illustrations/Illustrations2D';

interface SignInPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
  isPlatformLevel?: boolean;
}

type LayoutType = 'split' | 'centered_glass' | 'minimal_card' | 'heritage_frame';

interface DemoPersona {
  role: 'student' | 'teacher' | 'admin';
  name: string;
  email: string;
  badge: string;
  icon: any;
  avatarBg: string;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onAddToast,
  onSuccess,
  isPlatformLevel = false
}) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { login } = useAuth();

  const isPlatformLogin = isPlatformLevel || !tenant?.subdomain || tenant?.subdomain === 'platform' || tenant?.subdomain === 'demo';

  // Subdomain search & custom white-label selector
  const [customSubdomainInput, setCustomSubdomainInput] = useState<string>('');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(tenant?.subdomain || 'hifz-academy');

  // Discover any custom user-created academies from localStorage
  const discoveredAcademies = useMemo(() => {
    const list: { subdomain: string; name: string; niche: string }[] = [];
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('tenant_config_')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.subdomain && !list.find(item => item.subdomain === parsed.subdomain)) {
                list.push({
                  subdomain: parsed.subdomain,
                  name: parsed.name || parsed.subdomain,
                  niche: parsed.niche || 'general'
                });
              }
            }
          }
        }
      } catch (e) {}
    }
    return list;
  }, []);

  const isCodingNiche = tenant?.niche === 'coding' || tenant?.niche === 'code_academy' || tenant?.subdomain?.includes('code');
  const isSchoolNiche = (tenant?.niche === 'school' || tenant?.subdomain?.includes('horizon') || tenant?.subdomain?.includes('oxford')) && !isCodingNiche && tenant?.niche !== 'quran' && tenant?.niche !== 'madrasat';
  const isMadrasatNiche = (tenant?.niche === 'madrasat' || tenant?.niche === 'quran' || tenant?.subdomain?.includes('hifz') || tenant?.subdomain?.includes('quran') || tenant?.subdomain?.includes('al-furqan') || tenant?.subdomain?.includes('dar-al') || tenant?.subdomain?.includes('bayyinah')) && !isCodingNiche && !isSchoolNiche;
  const isDemoAcademy = ['hifz-academy', 'al-furqan', 'code-academy', 'school-demo'].includes(tenant?.subdomain || '');

  const activeLayout: LayoutType =
    (tenant?.authCustomization?.layout as LayoutType) || 'split';

  const defaultEmail = isDemoAcademy
    ? isCodingNiche
      ? 'mentee@code-academy.com'
      : isSchoolNiche
      ? 'student@horizon-school.com'
      : 'student@hifz-academy.com'
    : '';

  const [email, setEmail] = useState<string>(defaultEmail);
  const [password, setPassword] = useState<string>(isDemoAcademy ? 'password123' : '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authConfig = tenant?.authCustomization;
  const primaryColor = tenant.theme?.primaryColor || '#059669';

  // Handle instant switching of academy from platform login
  const handleSelectAcademy = (sub: string) => {
    setSelectedSubdomain(sub);
    setTenantBySubdomain(sub);
    if (sub === 'code-academy') {
      setEmail('mentee@code-academy.com');
      setPassword('password123');
    } else if (sub === 'school-demo' || sub === 'horizon-school') {
      setEmail('student@horizon-school.com');
      setPassword('password123');
    } else if (sub === 'hifz-academy' || sub === 'al-furqan') {
      setEmail('student@hifz-academy.com');
      setPassword('password123');
    }
  };

  // Demo Personas
  const demoPersonas: DemoPersona[] = useMemo(() => {
    if (isCodingNiche) {
      return [
        {
          role: 'student',
          name: 'Zaid Al-Mansoor',
          email: 'mentee@code-academy.com',
          badge: 'Junior Dev',
          icon: Code2,
          avatarBg: 'bg-blue-600',
        },
        {
          role: 'teacher',
          name: 'Alex Chen (Staff)',
          email: 'mentor@code-academy.com',
          badge: 'Lead Mentor',
          icon: Terminal,
          avatarBg: 'bg-indigo-600',
        },
        {
          role: 'admin',
          name: 'Bootcamp Director',
          email: 'admin@code-academy.com',
          badge: 'Academy Admin',
          icon: Shield,
          avatarBg: 'bg-slate-800',
        },
      ];
    } else if (isSchoolNiche) {
      return [
        {
          role: 'student',
          name: 'Sara Ibrahim',
          email: 'student@horizon-school.com',
          badge: 'Grade 11 Student',
          icon: GraduationCap,
          avatarBg: 'bg-purple-600',
        },
        {
          role: 'teacher',
          name: 'Dr. Robert Jenkins',
          email: 'teacher@horizon-school.com',
          badge: 'Faculty Member',
          icon: BookOpen,
          avatarBg: 'bg-amber-600',
        },
        {
          role: 'admin',
          name: 'Principal Reynolds',
          email: 'admin@horizon-school.com',
          badge: 'School Admin',
          icon: Shield,
          avatarBg: 'bg-slate-800',
        },
      ];
    }

    return [
      {
        role: 'student',
        name: 'Zaid Al-Mansoor',
        email: 'student@hifz-academy.com',
        badge: 'Hifz Student',
        icon: GraduationCap,
        avatarBg: 'bg-emerald-600',
      },
      {
        role: 'teacher',
        name: 'Ustadh Bilal Hashmi',
        email: 'teacher@hifz-academy.com',
        badge: 'Sanad Teacher',
        icon: BookOpen,
        avatarBg: 'bg-teal-600',
      },
      {
        role: 'admin',
        name: 'Sheikh Tariq Al-Mansoor',
        email: 'admin@hifz-academy.com',
        badge: 'Academy Dean',
        icon: Shield,
        avatarBg: 'bg-slate-800',
      },
    ];
  }, [isCodingNiche, isSchoolNiche]);

  const selectPersona = (p: DemoPersona) => {
    setEmail(p.email);
    setPassword('password123');
    onAddToast({
      type: 'info',
      title: `Selected ${p.badge}`,
      message: `Loaded credentials for ${p.name}.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onAddToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide both email and password.',
      });
      return;
    }

    setIsSubmitting(true);

    const lowerEmail = email.toLowerCase().trim();
    let detectedRole: UserRole = 'student';

    // Derive name gracefully
    const namePart = lowerEmail.split('@')[0].replace(/[._-]/g, ' ');
    let detectedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    if (
      lowerEmail.startsWith('superadmin') ||
      lowerEmail.includes('superadmin') ||
      lowerEmail === 'superadmin@ankabit.app' ||
      lowerEmail === 'superadmin@techmadrasah.com'
    ) {
      detectedRole = 'superadmin';
      detectedName = 'Platform SuperAdmin';
    } else if (
      lowerEmail.startsWith('admin') ||
      lowerEmail.includes('admin') ||
      lowerEmail.includes('director') ||
      lowerEmail.includes('principal') ||
      lowerEmail.includes('dean')
    ) {
      detectedRole = 'admin';
      if (lowerEmail.includes('tariq')) detectedName = 'Sheikh Tariq Al-Mansoor';
      else if (lowerEmail.includes('reynolds')) detectedName = 'Principal Reynolds';
      else if (lowerEmail.includes('bootcamp')) detectedName = 'Bootcamp Director';
      else detectedName = `${tenant?.name || 'Academy'} Administrator`;
    } else if (
      lowerEmail.startsWith('teacher') ||
      lowerEmail.includes('teacher') ||
      lowerEmail.includes('ustadh') ||
      lowerEmail.includes('instructor') ||
      lowerEmail.includes('mentor') ||
      lowerEmail.includes('faculty')
    ) {
      detectedRole = 'teacher';
      if (lowerEmail.includes('bilal')) detectedName = 'Ustadh Bilal Hashmi';
      else if (lowerEmail.includes('chen') || lowerEmail.includes('mentor')) detectedName = 'Alex Chen';
      else if (lowerEmail.includes('jenkins')) detectedName = 'Dr. Robert Jenkins';
      else detectedName = 'Faculty Instructor';
    } else {
      detectedRole = 'student';
      if (lowerEmail.includes('zaid')) detectedName = 'Zaid Al-Mansoor';
      else if (lowerEmail.includes('sara')) detectedName = 'Sara Ibrahim';
    }

    setTimeout(() => {
      login(email, detectedRole, detectedName);

      onAddToast({
        type: 'success',
        title: 'Signed In Successfully',
        message: `Welcome back, ${detectedName}!`,
      });

      setIsSubmitting(false);

      const targetSubdomain = tenant?.subdomain || 'hifz-academy';
      if (onSuccess) {
        onSuccess(detectedRole, targetSubdomain);
      } else {
        if (detectedRole === 'admin' || detectedRole === 'superadmin') {
          router.push(`/${targetSubdomain}/admin`);
        } else {
          router.push(`/${targetSubdomain}/lms`);
        }
      }
    }, 450);
  };

  // Reusable Academy Switcher for central platform login
  const renderAcademySelector = () => {
    if (!isPlatformLogin) return null;

    const standardAcademies = [
      {
        subdomain: 'hifz-academy',
        name: 'Hifz Quran Academy',
        niche: 'Madrasat & Quran',
        icon: '📖',
        color: 'emerald',
      },
      {
        subdomain: 'code-academy',
        name: 'NextGen Code Bootcamp',
        niche: 'Software Engineering',
        icon: '💻',
        color: 'blue',
      },
      {
        subdomain: 'school-demo',
        name: 'Horizon International School',
        niche: 'K-12 School SIS',
        icon: '🎓',
        color: 'purple',
      },
    ];

    return (
      <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Academy or White-Label Portal</span>
          </label>
          <span className="text-[10px] text-slate-500 font-mono">Multi-Tenant</span>
        </div>

        {/* Standard Verticals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {standardAcademies.map((ac) => {
            const isSelected = (tenant?.subdomain || selectedSubdomain) === ac.subdomain;
            return (
              <button
                key={ac.subdomain}
                type="button"
                onClick={() => handleSelectAcademy(ac.subdomain)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{ac.icon}</span>
                  <span className={`text-[11px] font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {ac.name.split(' ')[0]}
                  </span>
                </div>
                <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {ac.niche}
                </p>
              </button>
            );
          })}
        </div>

        {/* User-Created Custom White-Label Academies from localStorage (if any) */}
        {discoveredAcademies.length > 0 && (
          <div className="pt-2 border-t border-slate-200/80">
            <p className="text-[10px] font-bold text-slate-500 mb-1.5">Your Custom Created Academies:</p>
            <div className="flex flex-wrap gap-1.5">
              {discoveredAcademies.map((ac) => {
                const isSelected = (tenant?.subdomain || selectedSubdomain) === ac.subdomain;
                return (
                  <button
                    key={ac.subdomain}
                    type="button"
                    onClick={() => handleSelectAcademy(ac.subdomain)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🏢 {ac.name} <span className="text-[10px] opacity-70">({ac.subdomain})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Subdomain Direct Finder */}
        <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter custom subdomain (e.g. my-academy)"
              value={customSubdomainInput}
              onChange={(e) => setCustomSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>
          <button
            type="button"
            disabled={!customSubdomainInput}
            onClick={() => {
              if (customSubdomainInput) {
                router.push(`/${customSubdomainInput}/login`);
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>Open Portal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // Reusable Form Inputs
  const renderFormFields = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderAcademySelector()}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        required
      />

      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-emerald-600 rounded" />
          <span>Remember session</span>
        </label>
        <span className="hover:text-emerald-700 cursor-pointer font-medium">Forgot password?</span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full mt-2 font-black shadow-md bg-emerald-700 hover:bg-emerald-800 text-white"
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Sign In to Portal
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Need a student account?{' '}
          <button
            type="button"
            onClick={() => router.push(isPlatformLogin ? '/signup' : `/${tenant?.subdomain}/signup`)}
            className="text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            Register here
          </button>
        </p>
      </div>
    </form>
  );

  // Demo Persona Switcher (only shown for demo instances)
  const renderPersonaSwitcher = () => {
    if (!isDemoAcademy) return null;
    return (
      <div className="pt-4 border-t border-slate-200/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Instant Demo Accounts</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">1-Click Auto-Fill</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {demoPersonas.map((p) => {
            const Icon = p.icon;
            const isSelected = email === p.email;
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => selectPersona(p)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-5 h-5 rounded-md ${isSelected ? 'bg-white/20' : p.avatarBg} text-white flex items-center justify-center shrink-0`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className={`text-[10px] font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{p.badge}</span>
                </div>
                <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{p.name.split(' ')[0]}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between p-3 sm:p-6 sm:py-8 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl mx-auto mb-3 flex items-center justify-between px-2">
        <div
          className="cursor-pointer flex items-center gap-2.5"
          onClick={() => router.push(isPlatformLogin ? '/' : `/${tenant?.subdomain}`)}
        >
          {isPlatformLogin ? (
            <AnkabitLogo size="md" />
          ) : tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-8 w-auto object-contain rounded" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
                {tenant?.name?.charAt(0) || 'A'}
              </div>
              <span className="font-extrabold text-slate-900 text-base">{tenant?.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(isPlatformLogin ? '/' : `/${tenant?.subdomain}`)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer transition-all hover:border-slate-300"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{isPlatformLogin ? 'Platform Home' : 'Academy Home'}</span>
        </button>
      </div>

      {/* Main Container - Split View or Glass layouts */}
      <div className="flex-1 flex items-center justify-center my-2">
        {/* LAYOUT 1: SPLIT MODERN */}
        {activeLayout === 'split' && (
          <div className="w-full max-w-6xl min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
            {/* Left Hero (5 Columns) */}
            <div
              className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white relative overflow-hidden"
              style={
                authConfig?.backgroundImageUrl
                  ? {
                      backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url(${authConfig.backgroundImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary,#047857)]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary,#047857)] text-white flex items-center justify-center font-bold text-base shadow-md">
                      {isPlatformLogin ? <AnkabitSpiderIcon size={20} color="#FFFFFF" /> : (tenant?.name?.charAt(0) || 'A')}
                    </div>
                    <div>
                      <span className="font-black text-white text-base block leading-tight">
                        {isPlatformLogin ? 'Ankabit LMS' : tenant?.name}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono">
                        {tenant?.customDomain || (isPlatformLogin ? 'cloud.ankabit.app' : `${tenant?.subdomain}.edu`)}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15 uppercase">
                    {isCodingNiche ? 'Code Lab' : isSchoolNiche ? 'School SIS' : isMadrasatNiche ? 'Madrasat' : 'Learning Portal'}
                  </span>
                </div>

                <div className="pt-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    {authConfig?.welcomeHeading ||
                      (isCodingNiche
                        ? 'NextGen Code Bootcamp Portal'
                        : isSchoolNiche
                        ? 'Academic Faculty & Student SIS'
                        : isMadrasatNiche
                        ? 'Dar Al-Quran Academy Portal'
                        : `${tenant?.name || 'Academy'} Portal`)}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {authConfig?.welcomeSubtitle ||
                      (isCodingNiche
                        ? 'Access browser code sandboxes, algorithm test assertions, and live peer programming huddles.'
                        : isSchoolNiche
                        ? 'View term GPA gradebooks, standardized exam results, and schedule parent-teacher meetings.'
                        : isMadrasatNiche
                        ? 'Enter your credentials to access live halaqahs, recitation records, and student portals.'
                        : 'Sign in to access your enrolled courses, collaborative virtual classrooms, and academic transcripts.')}
                  </p>
                </div>
              </div>

              {/* Dynamic 2D Vector Illustration per Niche (only if no background image) */}
              {!authConfig?.backgroundImageUrl && (
                <div className="my-4 max-w-[290px] mx-auto">
                  {isCodingNiche ? (
                    <CodeAcademyArtIllustration className="w-full h-auto drop-shadow-xl" />
                  ) : isSchoolNiche ? (
                    <SchoolSisArtIllustration className="w-full h-auto drop-shadow-xl" />
                  ) : isMadrasatNiche ? (
                    <MadrasatArtIllustration className="w-full h-auto drop-shadow-xl" />
                  ) : (
                    <MultiTenantNetworkIllustration className="w-full h-auto drop-shadow-xl" />
                  )}
                </div>
              )}

              {/* Side Card Bottom Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1 relative z-10 shadow-inner">
                {isMadrasatNiche ? (
                  <>
                    <p className="font-serif text-lg text-emerald-300 font-bold">
                      {authConfig?.calligraphyText || 'وَقُل رَّبِّ زِدْنِي عِلْمًا'}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      {authConfig?.calligraphyTranslation || '“And say: My Lord, increase me in knowledge” • Surah Taha: 114'}
                    </p>
                  </>
                ) : isCodingNiche ? (
                  <>
                    <p className="font-mono text-xs text-blue-300 font-bold">
                      // Build, Ship & Review Clean Code
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Automated AST test runner & live pair programming
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Academic Excellence & Integrity
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Live interactive sessions & continuous progress monitoring
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Form Card (7 Columns) */}
            <div className="lg:col-span-7 p-8 sm:p-14 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-6 lg:hidden">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-primary,#047857)] text-white flex items-center justify-center font-bold text-sm">
                    {tenant?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{tenant?.name || 'Academy Portal'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tenant?.subdomain || 'portal'}.edu</span>
                  </div>
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign In</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-8">
                  Enter your credentials to access your courses, live classroom sessions, and records.
                </p>

                {renderFormFields()}
              </div>

              {renderPersonaSwitcher()}
            </div>
          </div>
        )}

        {/* LAYOUT 2: CENTERED GLASS */}
        {activeLayout === 'centered_glass' && (
          <div className="w-full max-w-2xl min-h-[78vh] p-8 sm:p-12 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary,#047857)] border border-emerald-400/40 text-white flex items-center justify-center mx-auto shadow-lg font-bold text-2xl">
                  {tenant?.name?.charAt(0) || 'H'}
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">{tenant?.name}</h2>
                <div className="text-sm text-emerald-300 font-serif font-bold">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 shadow-xl space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Sign In to Your Account</h3>
                {renderFormFields()}
              </div>

              {renderPersonaSwitcher()}
            </div>
          </div>
        )}

        {/* LAYOUT 3: MINIMALIST CLEAN CARD */}
        {activeLayout === 'minimal_card' && (
          <div className="w-full max-w-xl min-h-[75vh] p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary,#047857)] text-white flex items-center justify-center font-bold text-lg shadow-md">
                {tenant?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-slate-900 leading-tight">{tenant?.name || 'Academy Workspace'}</h2>
                <p className="text-xs text-slate-500">Student & Instructor Portal</p>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900">Sign In</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                Enter your registered credentials below to access your courses.
              </p>
              {renderFormFields()}
            </div>

            {renderPersonaSwitcher()}
          </div>
        )}

        {/* LAYOUT 4: HERITAGE ARABESQUE FRAME */}
        {activeLayout === 'heritage_frame' && (
          <div className="w-full max-w-2xl min-h-[78vh] p-4 bg-gradient-to-br from-amber-600 via-emerald-800 to-amber-700 rounded-3xl shadow-2xl flex items-center justify-center">
            <div className="w-full p-8 sm:p-12 bg-white rounded-2xl border-4 border-amber-400/40 relative space-y-6">
              <div className="text-center space-y-1.5">
                <div className="font-serif text-base font-bold text-emerald-800">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tenant?.name}</h2>
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                  Quranic Learning Management System
                </p>
              </div>

              {renderFormFields()}
              {renderPersonaSwitcher()}
            </div>
          </div>
        )}
      </div>

      {/* White-labeled Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 space-y-1">
        <p>
          {isPlatformLogin
            ? `© ${new Date().getFullYear()} Ankabit LMS • Multi-Tenant Academy Operating System`
            : `© ${new Date().getFullYear()} ${tenant?.name || 'Academy'}. All rights reserved.`}
        </p>
      </footer>
    </div>
  );
};
