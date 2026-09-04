import React, { useState } from 'react';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthHeroIllustration } from '../illustrations/Illustrations2D';

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

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'student',
    name: 'Zaid Al-Mansoor',
    email: 'student@hifz-academy.com',
    badge: 'Student Portal',
    icon: GraduationCap,
    avatarBg: 'bg-emerald-600',
  },
  {
    role: 'teacher',
    name: 'Shaykh Bilal Hashmi',
    email: 'teacher@hifz-academy.com',
    badge: 'Instructor LMS',
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

export const SignInPage: React.FC<SignInPageProps> = ({ onAddToast, onSuccess }) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { login } = useAuth();

  const activeLayout: LayoutType =
    (tenant?.authCustomization?.layout as LayoutType) || 'split';
  const [email, setEmail] = useState<string>('student@hifz-academy.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authConfig = tenant?.authCustomization;
  const primaryColor = tenant.theme?.primaryColor || '#059669';

  const selectPersona = (p: DemoPersona) => {
    setEmail(p.email);
    setPassword('password123');
    onAddToast({
      type: 'info',
      title: `${p.badge} Selected`,
      message: `Loaded demo credentials for ${p.name}.`,
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
      detectedName = 'Sheikh Tariq Al-Mansoor';
    } else if (
      lowerEmail.startsWith('teacher') ||
      lowerEmail.includes('instructor') ||
      lowerEmail.includes('shaykh') ||
      lowerEmail.includes('ustadh')
    ) {
      detectedRole = 'teacher';
      detectedName = 'Shaykh Bilal Hashmi';
    }

    let targetSubdomain = tenant?.subdomain || 'hifz-academy';
    if (lowerEmail.includes('code')) {
      targetSubdomain = 'code-academy';
    } else if (lowerEmail.includes('bayyinah')) {
      targetSubdomain = 'bayyinah-arabic';
    } else if (lowerEmail.includes('al-furqan') || lowerEmail.includes('furqan')) {
      targetSubdomain = 'al-furqan';
    } else if (lowerEmail.includes('hifz')) {
      targetSubdomain = 'hifz-academy';
    }

    setTimeout(() => {
      setTenantBySubdomain(targetSubdomain);
      login(email, detectedRole, detectedName);

      onAddToast({
        type: 'success',
        title: 'Authenticated Successfully',
        message: `Welcome back to your ${
          detectedRole === 'superadmin'
            ? 'Platform SuperAdmin Console'
            : detectedRole === 'admin'
            ? 'Administration'
            : detectedRole === 'teacher'
            ? 'Teacher Studio'
            : 'Learning'
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
            className={`w-full px-3.5 py-2 pl-9 pr-10 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors placeholder:text-slate-400 ${
              isGlass ? 'bg-white/90 border-white/40 text-slate-900' : 'border-slate-300 bg-white text-slate-900'
            }`}
          />
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
        className="w-full justify-center shadow-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
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
          Demo Persona 1-Click Login
        </span>
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {DEMO_PERSONAS.map((p) => {
          const Icon = p.icon;
          const isSelected = email === p.email;
          return (
            <button
              key={p.role}
              type="button"
              onClick={() => selectPersona(p)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-5 h-5 rounded-md ${p.avatarBg} text-white flex items-center justify-center`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-900 truncate">{p.badge}</span>
              </div>
              <p className="text-[9px] text-slate-500 truncate">{p.name.split(' ')[0]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between p-3 sm:p-6 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Clean Top Navigation Bar */}
      <div className="w-full max-w-4xl mx-auto mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
            {tenant?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <span className="font-extrabold text-slate-800 text-sm block leading-none">{tenant?.name || 'Ankabit LMS'}</span>
            <span className="text-[10px] text-emerald-700 font-mono">{tenant?.subdomain || 'demo'}.ankabit.app</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer transition-all hover:border-slate-300"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Academy Home</span>
        </button>
      </div>

      {/* Main Container by Selected Layout */}
      <div className="flex-1 flex items-center justify-center">
        {/* LAYOUT 1: SPLIT MODERN */}
        {activeLayout === 'split' && (
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/60 overflow-hidden">
            {/* Left Hero */}
            <div className="hidden lg:flex flex-col justify-between p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {tenant?.name?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <span className="font-black text-white text-base block leading-none">
                      {tenant?.name || 'Ankabit LMS'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {tenant?.subdomain}.ankabit.app
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                    {authConfig?.welcomeHeading || 'Welcome to Your Academy Workspace'}
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {authConfig?.welcomeSubtitle || 'Enter your credentials to access live halaqahs, recitation records, and student portals.'}
                  </p>
                </div>
              </div>

              {/* 2D Vector Illustration */}
              <div className="my-6 max-w-[240px] mx-auto">
                <AuthHeroIllustration className="w-full h-auto" />
              </div>

              {/* Calligraphy Quote */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1 relative z-10 shadow-inner">
                <p className="font-serif text-lg text-emerald-300 font-bold">
                  {authConfig?.calligraphyText || 'وَقُل رَّبِّ زِدْنِي عِلْمًا'}
                </p>
                <p className="text-[10px] text-slate-400 italic">
                  {authConfig?.calligraphyTranslation || '“And say: My Lord, increase me in knowledge” • Surah Taha: 114'}
                </p>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4 lg:hidden">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {tenant?.name?.charAt(0) || 'H'}
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">{tenant?.name}</span>
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h1>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Sign in to access student recitation tracker, curriculum, and live sessions.
                </p>

                {renderFormFields()}
              </div>

              {renderPersonaSwitcher()}
            </div>
          </div>
        )}

        {/* LAYOUT 2: MEDINA CENTERED GLASS */}
        {activeLayout === 'centered_glass' && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700/80 border border-emerald-400/40 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-700/30 font-bold text-xl">
                  {tenant?.name?.charAt(0) || 'H'}
                </div>
                <h2 className="text-xl font-black tracking-tight text-white">{tenant?.name}</h2>
                <div className="text-xs text-emerald-300 font-serif font-bold">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-xl space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Sign In to Your Account</h3>
                {renderFormFields()}
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                {renderPersonaSwitcher()}
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 3: MINIMALIST CLEAN CARD */}
        {activeLayout === 'minimal_card' && (
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-700/20">
                {tenant?.name?.charAt(0) || 'H'}
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 leading-tight">{tenant?.name}</h2>
                <p className="text-xs text-slate-500">Student & Instructor Portal</p>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900">Sign In</h1>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Enter your registered credentials below.
              </p>
              {renderFormFields()}
            </div>

            {renderPersonaSwitcher()}
          </div>
        )}

        {/* LAYOUT 4: HERITAGE ARABESQUE FRAME */}
        {activeLayout === 'heritage_frame' && (
          <div className="w-full max-w-lg p-3 bg-gradient-to-br from-amber-600 via-emerald-800 to-amber-700 rounded-3xl shadow-2xl">
            <div className="p-6 sm:p-8 bg-white rounded-2xl border-4 border-amber-400/40 relative space-y-6">
              {/* Corner Arabesque Ornaments */}
              <div className="absolute top-2 left-2 text-amber-500 font-mono text-xs select-none">❖</div>
              <div className="absolute top-2 right-2 text-amber-500 font-mono text-xs select-none">❖</div>
              <div className="absolute bottom-2 left-2 text-amber-500 font-mono text-xs select-none">❖</div>
              <div className="absolute bottom-2 right-2 text-amber-500 font-mono text-xs select-none">❖</div>

              <div className="text-center space-y-1.5">
                <div className="font-serif text-sm font-bold text-emerald-800">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{tenant?.name}</h2>
                <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">
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
      <footer className="mt-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 Ankabit LMS • Multi-Tenant Academy Operating System</p>
      </footer>
    </div>
  );
};

