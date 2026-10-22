import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnkabitLogo } from '../brand/AnkabitLogo';
import { AuthLaptopSecurityIllustration } from '../illustrations/Illustrations2D';
import Link from 'next/link';
import { getPlatformRootDomain } from '../../lib/platformDomain';

const DEMO_ACCOUNTS = [
  { role: 'superadmin', label: 'Super Admin' },
  { role: 'admin', label: 'Academy Admin' },
  { role: 'teacher', label: 'Teacher' },
  { role: 'student', label: 'Student' },
] as const;

interface SignInPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
  isPlatformLevel?: boolean;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onAddToast,
  onSuccess,
  isPlatformLevel = false,
}) => {
  const router = useRouter();
  const { tenant } = useTenant();
  const { login } = useAuth();

  const isPlatformLogin = isPlatformLevel || !tenant?.subdomain || tenant?.subdomain === 'platform';
  const academyTitle = isPlatformLogin ? 'Ankabit LMS Platform' : tenant.name || 'Academy Portal';
  const targetSubdomain = useMemo(() => {
    if (tenant?.subdomain && tenant.subdomain !== 'platform') return tenant.subdomain;
    if (typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/').filter(Boolean)[0];
      if (seg && !['login', 'signup', 'register', 'api', 'platform', 'super-admin'].includes(seg)) {
        return seg;
      }
    }
    return tenant?.subdomain || 'demo';
  }, [tenant?.subdomain]);
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const signInWithCredentials = async (credentialsEmail: string, credentialsPassword: string) => {
    setAuthError(null);

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentialsEmail.trim(),
          password: credentialsPassword,
          subdomain: isPlatformLogin ? undefined : targetSubdomain,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || data.message || 'Invalid email or password';
        setAuthError(errorMsg);
        onAddToast({
          type: 'error',
          title: 'Sign In Failed',
          message: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      // Update Client Auth Context
      const user = data.user;
      login(user, user.role, user.name, data.token, user.tenantId, user.id, user.avatarUrl, user.tenantSubdomain || user.subdomain);

      onAddToast({
        type: 'success',
        title: 'Welcome Back',
        message: `Signed in successfully as ${user.name}`,
      });

      // Destination subdomain: prioritize user's authentic workspace from backend
      const resolvedSubdomain =
        user.tenantSubdomain ||
        user.subdomain ||
        (targetSubdomain !== 'platform' && targetSubdomain !== 'demo' ? targetSubdomain : null) ||
        'demo';

      if (onSuccess) {
        onSuccess(user.role, resolvedSubdomain);
      } else {
        if (user.role === 'superadmin') {
          router.push('/super-admin');
        } else if (user.role === 'admin') {
          router.push(`/${resolvedSubdomain}/admin`);
        } else {
          router.push(`/${resolvedSubdomain}/lms`);
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Could not communicate with the authentication server.';
      setAuthError(errorMsg);
      onAddToast({
        type: 'error',
        title: 'Connection Error',
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await signInWithCredentials(email, password);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-stretch font-sans selection:bg-emerald-600 selection:text-white">
      {/* ============================================================ */}
      {/* LEFT COLUMN: BRANDING & STUDENT WITH LAPTOP ILLUSTRATION    */}
      {/* (Image 3 Layout with Ankabit Emerald Brand Identity)         */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-100 flex-col justify-between p-12 overflow-hidden border-r border-slate-200/60">
        {/* Soft Background Geometric Waves */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Top-Left Academy Brand Logo (From Image 3) */}
        <div className="relative z-10">
          <Link href={`/${targetSubdomain}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-700 shadow-sm transition-transform group-hover:scale-105">
              <AnkabitLogo size="sm" showText={false} />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-slate-900 block leading-tight">
                {academyTitle}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Academy Authentication Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Bottom: Vector Illustration of Student by Laptop with Lock Badge */}
        <div className="relative z-10 my-auto flex items-center justify-center py-6">
          <AuthLaptopSecurityIllustration className="w-full max-w-lg h-auto drop-shadow-xl" />
        </div>

        {/* Bottom Subtext */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          Protected by Ankabit LMS 256-bit encrypted authentication studio.
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: ACCOUNT LOGIN FORM                            */}
      {/* (Image 3 Arrangement with Ankabit Emerald Styling)           */}
      {/* ============================================================ */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Right Secondary Switch Button (From Image 3) */}
        <div className="flex justify-end items-center mb-8">
          <Link
            href={isPlatformLogin ? '/create-academy' : `/${targetSubdomain}/signup`}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm"
          >
            {isPlatformLogin ? 'Create Academy' : 'Sign Up'}
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Account Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              If you are already a member you can login with your email address and password.
            </p>
          </div>

          {isDemoMode && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-emerald-950">Demo mode</p>
                <p className="text-xs text-emerald-800">Choose a role to enter the prepared workspace. Password: <code>password</code></p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void signInWithCredentials(`${account.role}@${getPlatformRootDomain()}`, 'password')}
                    className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {account.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Field 1: Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="signin-email" className="block text-xs font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@academy.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                    fieldErrors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-500 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Field 2: Password */}
            <div className="space-y-1.5">
              <label htmlFor="signin-password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all pr-11 ${
                    fieldErrors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-rose-500 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Options Row: Remember Me & Forgot Password (From Image 3) */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToast({
                    type: 'info',
                    title: 'Password Assistance',
                    message: 'Please contact your academy administrator to reset your student password.',
                  });
                }}
                className="font-medium text-slate-500 hover:text-emerald-700 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Action Button: Full-width "Login" Button (From Image 3 with Emerald Palette) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Subtext footer */}
          {!isPlatformLogin && (
            <div className="text-center pt-4">
              <Link
                href={`/${targetSubdomain}`}
                className="text-xs text-slate-400 hover:text-slate-600 hover:underline"
              >
                &larr; Return to {academyTitle}
              </Link>
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-400 mt-8">
          © 2026 {academyTitle} • Powered by Ankabit LMS
        </div>
      </div>
    </div>
  );
};
