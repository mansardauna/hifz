import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnkabitLogo } from '../brand/AnkabitLogo';
import { AuthLaptopSecurityIllustration } from '../illustrations/Illustrations2D';
import Link from 'next/link';

interface SignUpPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
  isPlatformLevel?: boolean;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onAddToast,
  onSuccess,
  isPlatformLevel = false,
}) => {
  const router = useRouter();
  const { tenant } = useTenant();
  const { login } = useAuth();

  const isPlatformSignup = isPlatformLevel || !tenant?.subdomain || tenant?.subdomain === 'platform';
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
  const academyTitle = isPlatformSignup ? 'Ankabit LMS Platform' : tenant.name || 'Academy Portal';

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;
    if (!agreeTerms) {
      const msg = 'Please agree to the Terms & Privacy Policy to create your account.';
      setAuthError(msg);
      onAddToast({
        type: 'error',
        title: 'Terms of Service',
        message: msg,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: name.trim(),
          email: email.trim(),
          password,
          role: 'student',
          subdomain: targetSubdomain,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || data.message || 'Registration could not be completed';
        setAuthError(errorMsg);
        onAddToast({
          type: 'error',
          title: 'Registration Error',
          message: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      const user = data.user;
      login(user, user.role, user.name, data.token, user.tenantId, user.id, user.avatarUrl, user.tenantSubdomain || user.subdomain);

      onAddToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome, ${user.name}! Your student profile has been registered.`,
      });

      const resolvedSubdomain =
        user.tenantSubdomain ||
        user.subdomain ||
        (targetSubdomain !== 'platform' && targetSubdomain !== 'demo' ? targetSubdomain : null) ||
        'demo';

      if (onSuccess) {
        onSuccess(user.role, resolvedSubdomain);
      } else {
        router.push(`/${resolvedSubdomain}/lms`);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Could not connect to the registration service.';
      setAuthError(errorMsg);
      onAddToast({
        type: 'error',
        title: 'Network Error',
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-stretch font-sans selection:bg-emerald-600 selection:text-white">
      {/* ============================================================ */}
      {/* LEFT COLUMN: BRANDING & STUDENT WITH LAPTOP ILLUSTRATION    */}
      {/* (Image 3 Layout with Ankabit Emerald Brand Identity)         */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-100 flex-col justify-between p-12 overflow-hidden border-r border-slate-200/60">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Top-Left Brand Logo */}
        <div className="relative z-10">
          <Link href={`/${targetSubdomain}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-700 shadow-sm transition-transform group-hover:scale-105">
              <AnkabitLogo size="sm" showText={false} />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                {academyTitle}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Student Enrollment
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
      {/* RIGHT COLUMN: CREATE ACCOUNT FORM                           */}
      {/* ============================================================ */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Right Secondary Switch Button */}
        <div className="flex justify-end items-center mb-8">
          <Link
            href={isPlatformSignup ? '/login' : `/${targetSubdomain}/login`}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Student Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Enter your personal details to get started with your academy journey.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Field 1: Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ahmad Ibn Yusuf"
                autoComplete="name"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-xl text-sm bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                  fieldErrors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-rose-500 font-medium">{fieldErrors.name}</p>
              )}
            </div>

            {/* Field 2: Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="signup-email"
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
              {fieldErrors.email && (
                <p className="text-xs text-rose-500 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Field 3: Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Create a password (min 6 chars)"
                  autoComplete="new-password"
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

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                I agree to the academy{' '}
                <a href="#" className="font-semibold text-slate-900 underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="font-semibold text-slate-900 underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Student Account'
              )}
            </button>
          </form>

          {/* Subtext footer */}
          {!isPlatformSignup && (
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
