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

export const SignInPage: React.FC<SignInPageProps> = ({ onAddToast, onSuccess }) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { login } = useAuth();

  const isCodingNiche = tenant?.niche === 'coding' || tenant?.niche === 'code_academy' || tenant?.subdomain?.includes('code');
  const isSchoolNiche = tenant?.niche === 'school' || tenant?.subdomain?.includes('school') || tenant?.subdomain?.includes('horizon') || tenant?.subdomain?.includes('al-furqan');
  const isMadrasatNiche = (tenant?.niche === 'madrasat' || tenant?.niche === 'quran' || tenant?.subdomain?.includes('hifz') || tenant?.subdomain?.includes('quran') || tenant?.subdomain?.includes('dar-al')) && !isCodingNiche && !isSchoolNiche;
  const isPlatformLogin = !tenant?.subdomain || tenant?.subdomain === 'platform' || tenant?.subdomain === 'demo' || (!isCodingNiche && !isSchoolNiche && !isMadrasatNiche);

  const activeLayout: LayoutType =
    (tenant?.authCustomization?.layout as LayoutType) || 'split';

  const defaultEmail = isCodingNiche
    ? 'mentee@code-academy.com'
    : isSchoolNiche
    ? 'student@horizon-school.com'
    : 'student@hifz-academy.com';

  const [email, setEmail] = useState<string>(defaultEmail);
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authConfig = tenant?.authCustomization;
  const primaryColor = tenant.theme?.primaryColor || '#059669';

  // Dynamic Demo Personas tailored per Niche
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
          avatarBg: 'bg-slate-900',
        },
      ];
    }
    if (isSchoolNiche) {
      return [
        {
          role: 'student',
          name: 'Zaid Al-Mansoor',
          email: 'student@horizon-school.com',
          badge: 'Enrolled Student',
          icon: GraduationCap,
          avatarBg: 'bg-purple-600',
        },
        {
          role: 'teacher',
          name: 'Dr. Eleanor Vance',
          email: 'faculty@horizon-school.com',
          badge: 'Faculty HOD',
          icon: Award,
          avatarBg: 'bg-violet-600',
        },
        {
          role: 'admin',
          name: 'Principal Office',
          email: 'admin@horizon-school.com',
          badge: 'School Admin',
          icon: Shield,
          avatarBg: 'bg-slate-900',
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
        name: 'Shaykh Bilal Hashmi',
        email: 'teacher@hifz-academy.com',
        badge: 'Sheikh / Teacher',
        icon: BookOpen,
        avatarBg: 'bg-amber-600',
      },
      {
        role: 'admin',
        name: 'Sheikh Tariq (Director)',
        email: 'admin@hifz-academy.com',
        badge: 'Academy Admin',
        icon: Shield,
        avatarBg: 'bg-indigo-600',
      },
    ];
  }, [isCodingNiche, isSchoolNiche]);

  const selectPersona = (p: DemoPersona) => {
    setEmail(p.email);
    setPassword('password123');
    onAddToast({
      type: 'info',
      title: `${p.badge} Selected`,
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
    let detectedName = 'Zaid Al-Mansoor';

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
      lowerEmail.includes('principal')
    ) {
      detectedRole = 'admin';
      detectedName = isCodingNiche
        ? 'Bootcamp Director'
        : isSchoolNiche
        ? 'Principal Office'
        : 'Sheikh Tariq Al-Mansoor';
    } else if (
      lowerEmail.startsWith('teacher') ||
      lowerEmail.includes('instructor') ||
      lowerEmail.includes('mentor') ||
      lowerEmail.includes('faculty') ||
      lowerEmail.includes('shaykh') ||
      lowerEmail.includes('ustadh')
    ) {
      detectedRole = 'teacher';
      detectedName = isCodingNiche
        ? 'Alex Chen (Staff Architect)'
        : isSchoolNiche
        ? 'Dr. Eleanor Vance'
        : 'Shaykh Bilal Hashmi';
    }

    let targetSubdomain = tenant?.subdomain || 'hifz-academy';
    if (lowerEmail.includes('code')) {
      targetSubdomain = 'code-academy';
    } else if (lowerEmail.includes('horizon') || lowerEmail.includes('school')) {
      targetSubdomain = 'al-furqan';
    } else if (lowerEmail.includes('bayyinah')) {
      targetSubdomain = 'bayyinah-arabic';
    } else if (lowerEmail.includes('hifz') || lowerEmail.includes('quran')) {
      targetSubdomain = 'hifz-academy';
    }

    setTimeout(() => {
      setTenantBySubdomain(targetSubdomain);
      login(email, detectedRole, detectedName);

      onAddToast({
        type: 'success',
        title: 'Authenticated Successfully',
        message: `Welcome to your ${
          detectedRole === 'superadmin'
            ? 'Platform SuperAdmin Console'
            : detectedRole === 'admin'
            ? 'Administration Workspace'
            : detectedRole === 'teacher'
            ? 'Instructor Studio'
            : 'Learning Portal'
        }!`,
      });
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(detectedRole, targetSubdomain);
      } else {
        if (detectedRole === 'superadmin') {
          router.push('/super-admin');
        } else if (detectedRole === 'admin') {
          router.push(`/${targetSubdomain}/admin`);
        } else {
          router.push(`/${targetSubdomain}/lms`);
        }
      }
    }, 400);
  };

  // Reusable Form Markup
  const renderFormFields = (isGlass = false) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        className={isGlass ? 'bg-white/90 text-slate-900 border-white/40' : ''}
      />

      <div>
        <label className={`block text-xs font-semibold mb-1 ${isGlass ? 'text-slate-800' : 'text-slate-700'}`}>
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full px-3.5 py-2.5 pl-9 pr-10 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:border-[var(--color-primary,#047857)] focus:ring-2 focus:ring-[var(--color-primary,#047857)]/20 transition-colors placeholder:text-slate-400 ${
              isGlass ? 'bg-white/90 border-white/40 text-slate-900' : 'border-slate-300 bg-white text-slate-900'
            }`}
          />
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
          <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
          <span>Remember me</span>
        </label>
        <a href="#" className="font-semibold text-emerald-700 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full justify-center shadow-md text-white font-bold"
        disabled={isSubmitting}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
      </Button>
    </form>
  );

  // Persona Quick Switcher Bar
  const renderPersonaSwitcher = () => (
    <div className="pt-4 border-t border-slate-200/80 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
          Demo 1-Click Role Switcher
        </span>
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between p-3 sm:p-6 sm:py-8 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl mx-auto mb-3 flex items-center justify-between px-2">
        <div className="cursor-pointer" onClick={() => router.push('/')}>
          <AnkabitLogo size="md" />
        </div>

        <button
          onClick={() => router.push('/')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer transition-all hover:border-slate-300"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Platform Home</span>
        </button>
      </div>

      {/* Main Container - High Capacity Large Screen-Filling 6XL Card */}
      <div className="flex-1 flex items-center justify-center my-2">
        {/* LAYOUT 1: SPLIT MODERN */}
        {activeLayout === 'split' && (
          <div className="w-full max-w-6xl min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
            {/* Left Hero (5 Columns) - Dynamically Morphs per Niche */}
            <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white relative overflow-hidden">
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
                        {isPlatformLogin ? 'cloud.ankabit.app' : `${tenant?.subdomain}.ankabit.app`}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15 uppercase">
                    {isCodingNiche ? 'Code Lab' : isSchoolNiche ? 'School SIS' : isMadrasatNiche ? 'Madrasat' : 'Learning OS'}
                  </span>
                </div>

                <div className="pt-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    {isCodingNiche
                      ? 'NextGen Code Bootcamp Portal'
                      : isSchoolNiche
                      ? 'Academic Faculty & Student SIS'
                      : isMadrasatNiche
                      ? (authConfig?.welcomeHeading || 'Dar Al-Quran Academy Portal')
                      : 'The Autonomous Educational OS'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {isCodingNiche
                      ? 'Access browser code sandboxes, algorithm test assertions, and live peer programming huddles.'
                      : isSchoolNiche
                      ? 'View term GPA gradebooks, standardized exam results, and schedule parent-teacher meetings.'
                      : isMadrasatNiche
                      ? (authConfig?.welcomeSubtitle || 'Enter your credentials to access live halaqahs, recitation records, and student portals.')
                      : 'Dedicated custom domains, LiveKit WebRTC video classrooms, and autonomous tuition billing.'}
                  </p>
                </div>
              </div>

              {/* Dynamic 2D Vector Illustration per Niche */}
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

              {/* Side Card Bottom Banner (Islamic only on Madrasat; Neutral elsewhere) */}
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
                ) : isSchoolNiche ? (
                  <>
                    <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Excellence in Academics & Leadership
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Standardized grading scale & cumulative GPA tracking
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Multi-Tenant Cloud Infrastructure
                    </p>
                    <p className="text-[11px] text-slate-400">
                      99.98% Uptime SLA • Zero commission direct payment routing
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
                    <span className="font-extrabold text-slate-900 text-sm block">{tenant?.name || 'Ankabit LMS'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tenant?.subdomain || 'demo'}.ankabit.app</span>
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

        {/* LAYOUT 2: MEDINA CENTERED GLASS */}
        {activeLayout === 'centered_glass' && (
          <div className="w-full max-w-2xl min-h-[78vh] p-8 sm:p-12 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl shadow-emerald-950/40 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary,#047857)] border border-emerald-400/40 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-700/30 font-bold text-2xl">
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

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                {renderPersonaSwitcher()}
              </div>
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
              <div className="absolute top-2 left-2 text-amber-500 font-mono text-xs select-none">❖</div>
              <div className="absolute top-2 right-2 text-amber-500 font-mono text-xs select-none">❖</div>
              <div className="absolute bottom-2 left-2 text-amber-500 font-mono text-xs select-none">❖</div>
              <div className="absolute bottom-2 right-2 text-amber-500 font-mono text-xs select-none">❖</div>

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

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 Ankabit LMS • Multi-Tenant Academy Operating System</p>
      </footer>
    </div>
  );
};
