import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Select } from '../ui';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  Globe,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnkabitLogo } from '../brand/AnkabitLogo';
import {
  MadrasatArtIllustration,
  CodeAcademyArtIllustration,
  SchoolSisArtIllustration,
  MultiTenantNetworkIllustration,
} from '../illustrations/Illustrations2D';

interface SignUpPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
  isPlatformLevel?: boolean;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onAddToast,
  onSuccess,
  isPlatformLevel = false
}) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { register } = useAuth();

  const isPlatformSignup = isPlatformLevel || !tenant?.subdomain || tenant?.subdomain === 'platform' || tenant?.subdomain === 'demo';
  const isDemoAcademy = ['hifz-academy', 'al-furqan', 'code-academy', 'school-demo'].includes(tenant?.subdomain || '');

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>(tenant?.subdomain || 'hifz-academy');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Discover user-created custom academies from localStorage
  const allAcademyOptions = React.useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();

    // Base mock tenants
    Object.values(MOCK_TENANTS).forEach((t) => {
      map.set(t.subdomain, {
        value: t.subdomain,
        label: `${t.name} (${t.customDomain || `${t.subdomain}.edu`})`,
      });
    });

    // Add local created academies
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('tenant_config_')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.subdomain) {
                map.set(parsed.subdomain, {
                  value: parsed.subdomain,
                  label: `${parsed.name || parsed.subdomain} (${parsed.customDomain || `${parsed.subdomain}.edu`})`,
                });
              }
            }
          }
        }
      } catch (e) {}
    }

    return Array.from(map.values());
  }, []);

  const activeSubdomain = isPlatformSignup ? selectedSubdomain : (tenant?.subdomain || 'hifz-academy');
  const isCodingNiche = activeSubdomain.includes('code') || tenant?.niche === 'coding';
  const isSchoolNiche = activeSubdomain.includes('school') || activeSubdomain.includes('horizon') || tenant?.niche === 'school';
  const isMadrasatNiche = !isCodingNiche && !isSchoolNiche;

  const authConfig = tenant?.authCustomization;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      onAddToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please fill in all mandatory account fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setTenantBySubdomain(activeSubdomain);
      register(name, email, 'student', activeSubdomain);
      onAddToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome, ${name}! Your student registration is complete.`,
      });
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess('student', activeSubdomain);
      } else {
        router.push(`/${activeSubdomain}/lms`);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between p-3 sm:p-6 sm:py-8 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl mx-auto mb-3 flex items-center justify-between px-2">
        <div
          className="cursor-pointer flex items-center gap-2.5"
          onClick={() => router.push(isPlatformSignup ? '/' : `/${tenant?.subdomain}`)}
        >
          {isPlatformSignup ? (
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
          onClick={() => router.push(isPlatformSignup ? '/' : `/${tenant?.subdomain}`)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer transition-all hover:border-slate-300"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{isPlatformSignup ? 'Platform Home' : 'Academy Home'}</span>
        </button>
      </div>

      {/* Main Container - High Capacity Screen-Filling 6XL Card */}
      <div className="flex-1 flex items-center justify-center my-2">
        <div className="w-full max-w-6xl min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
          {/* Left Hero Visual Card (5 Columns) */}
          <div
            className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white relative overflow-hidden"
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
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {isPlatformSignup ? (
                <AnkabitLogo size="md" textColor="text-white" />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                    {tenant?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="font-extrabold text-white text-base">{tenant?.name}</span>
                </div>
              )}

              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {authConfig?.welcomeHeading || `Join ${tenant?.name || 'Your Academy'}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {authConfig?.welcomeSubtitle ||
                    'Enroll in curriculum courses, access interactive live classrooms, and collaborate with your teachers.'}
                </p>
              </div>
            </div>

            {/* Dynamic Niche Vector Illustration (if no background image) */}
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

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 relative z-10 shadow-inner">
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Autonomous Student Experience
              </p>
              <p className="text-[11px] text-slate-400">
                Self-paced learning tracks, audio reciters, code execution labs & live video WebRTC.
              </p>
            </div>
          </div>

          {/* Right Form Card (7 Columns) */}
          <div className="lg:col-span-7 p-8 sm:p-14 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create Student Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Register below to access your courses, classroom huddles, and homework assignments.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isPlatformSignup && (
                  <Select
                    label="Select Academy Domain"
                    value={selectedSubdomain}
                    onChange={(e) => setSelectedSubdomain(e.target.value)}
                    options={allAcademyOptions}
                  />
                )}

                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bilal Ibrahim"
                  leftIcon={<User className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone / WhatsApp"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 0199"
                    leftIcon={<Phone className="w-4 h-4" />}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-md font-bold text-white bg-emerald-700 hover:bg-emerald-800"
                  disabled={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Registering Account...' : 'Complete Registration'}
                </Button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push(isPlatformSignup ? '/login' : `/${tenant?.subdomain}/login`)}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
              {isPlatformSignup && (
                <button
                  type="button"
                  onClick={() => router.push('/create-academy')}
                  className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Launch Your Academy &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 space-y-1">
        <p>
          {isPlatformSignup
            ? `© ${new Date().getFullYear()} Ankabit LMS • Multi-Tenant Academy Operating System`
            : `© ${new Date().getFullYear()} ${tenant?.name || 'Academy'}. All rights reserved.`}
        </p>
      </footer>
    </div>
  );
};
