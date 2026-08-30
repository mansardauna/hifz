import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Button, Input } from '../ui';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthHeroIllustration } from '../illustrations/Illustrations2D';

interface SignInPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onAddToast, onSuccess }) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('student@hifz-academy.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Read tenant auth customization if available
  const authConfig = tenant?.authCustomization;
  const layout = authConfig?.layout || 'split';

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

    // 1. Auto-detect user role based on email / credentials
    const lowerEmail = email.toLowerCase().trim();
    let detectedRole: UserRole = 'student';
    if (lowerEmail.startsWith('admin') || lowerEmail.includes('admin') || lowerEmail.includes('director') || lowerEmail.includes('principal')) {
      detectedRole = 'admin';
    } else if (lowerEmail.startsWith('teacher') || lowerEmail.includes('instructor') || lowerEmail.includes('shaykh') || lowerEmail.includes('ustadh')) {
      detectedRole = 'student'; // Instructor operates with instructor privileges in LMS
    }

    // 2. Auto-detect target academy subdomain from email domain or current tenant context
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
      login(email, detectedRole);

      onAddToast({
        type: 'success',
        title: 'Authenticated Successfully',
        message: `Welcome back to your ${detectedRole === 'admin' ? 'Administration' : 'Learning'} Portal!`,
      });
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(detectedRole, targetSubdomain);
      } else {
        if (detectedRole === 'admin') {
          router.push(`/${targetSubdomain}/admin`);
        } else {
          router.push(`/${targetSubdomain}/lms`);
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-center items-center p-4 sm:p-8 selection:bg-emerald-100 selection:text-emerald-900">
      <div className={`w-full ${layout === 'split' ? 'max-w-4xl grid grid-cols-1 lg:grid-cols-2' : 'max-w-md'} rounded-2xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/60 overflow-hidden`}>
        {/* Left Hero Visual Card (Only in split layout) */}
        {layout === 'split' && (
          <div className="hidden lg:flex flex-col justify-between p-8 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white text-base">
                  {tenant?.name || 'TechMadrasah'}
                </span>
              </div>

              <div className="pt-2">
                <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                  {authConfig?.welcomeHeading || 'Welcome to Your Academy Workspace'}
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {authConfig?.welcomeSubtitle || 'Enter your account credentials to access your courses, classroom huddles, and student records.'}
                </p>
              </div>
            </div>

            {/* 2D Vector Graphic */}
            <div className="my-6 max-w-[260px] mx-auto">
              <AuthHeroIllustration className="w-full h-auto" />
            </div>

            {/* Ayah Quote & Calligraphy */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1 relative z-10">
              <p className="font-serif text-base text-emerald-300 font-bold">
                {authConfig?.calligraphyText || 'وَقُل رَّبِّ زِدْنِي عِلْمًا'}
              </p>
              <p className="text-[10px] text-slate-400 italic">
                {authConfig?.calligraphyTranslation || '“And say: My Lord, increase me in knowledge” • Surah Taha: 114'}
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{tenant?.name || 'TechMadrasah'}</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Home
              </button>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Enter your email and password to access your portal.
            </p>
          </div>

          {/* Unified Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 pl-9 pr-10 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors placeholder:text-slate-400"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-emerald-700 hover:underline">Forgot password?</a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center shadow-xs"
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="font-bold text-slate-900 hover:underline cursor-pointer"
              >
                Register
              </button>
            </span>
            <button
              type="button"
              onClick={() => router.push('/create-academy')}
              className="font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Launch Academy &rarr;
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-400">
        © 2026 TechMadrasah Inc. • Educational Platform
      </footer>
    </div>
  );
};
