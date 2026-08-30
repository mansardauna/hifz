import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowLeft,
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

  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState<string>('student@hifz-academy.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const detectedTenant = useMemo(() => {
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail.includes('code')) {
      return MOCK_TENANTS['code-academy'] || tenant;
    }
    if (lowerEmail.includes('bayyinah')) {
      return MOCK_TENANTS['bayyinah-arabic'] || tenant;
    }
    if (lowerEmail.includes('al-furqan') || lowerEmail.includes('furqan')) {
      return MOCK_TENANTS['al-furqan'] || tenant;
    }
    if (lowerEmail.includes('hifz')) {
      return MOCK_TENANTS['hifz-academy'] || tenant;
    }
    return tenant || MOCK_TENANTS['hifz-academy'] || MOCK_TENANTS['al-furqan'];
  }, [email, tenant]);

  const handleRoleChange = (role: 'student' | 'admin') => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('admin@hifz-academy.com');
    } else {
      setEmail('student@hifz-academy.com');
    }
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
    setTenantBySubdomain(detectedTenant.subdomain);
    login(email, activeRole);
    onAddToast({
      type: 'success',
      title: 'Signed In Successfully',
      message: `Welcome back to ${detectedTenant.name}!`,
    });

    if (onSuccess) {
      onSuccess(activeRole, detectedTenant.subdomain);
    } else {
      if (activeRole === 'admin') {
        router.push(`/${detectedTenant.subdomain}/admin`);
      } else {
        router.push(`/${detectedTenant.subdomain}/lms`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm">TechMadrasah</span>
        </div>

        <button
          onClick={() => router.push('/register')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Register Student &rarr;
        </button>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Left Hero Visual Card */}
          <div className="hidden lg:flex flex-col justify-between p-8 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold border border-slate-700">
                <Sparkles className="w-3 h-3" />
                <span>White-Label Tenant Portal</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                TechMadrasah Core OS
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly to your registered institution, access live 114 Surahs or browser code sandboxes, and enter WebRTC live video classrooms.
              </p>
            </div>

            {/* 2D Vector Graphic */}
            <div className="my-6 max-w-[280px] mx-auto">
              <AuthHeroIllustration className="w-full h-auto" />
            </div>

            {/* Ayah Quote & Calligraphy */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1 relative z-10">
              <p className="font-serif text-base text-emerald-300 font-bold">
                وَقُل رَّبِّ زِدْنِي عِلْمًا
              </p>
              <p className="text-[10px] text-slate-400 italic">
                &ldquo;And say: My Lord, increase me in knowledge&rdquo; • Surah Taha: 114
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Sign In to Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access your academy workspace.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRole === 'student'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Student Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Academy Admin</span>
              </button>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@academy.com"
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

              {/* Detected Tenant Preview */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Academy</span>
                  <span className="font-bold text-slate-900">{detectedTenant.name}</span>
                </div>
                <Badge variant="default">{detectedTenant.subdomain}.techmadrasah.app</Badge>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center shadow-xs"
                disabled={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Authenticating...' : `Sign In as ${activeRole === 'admin' ? 'Administrator' : 'Student'}`}
              </Button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Need a new academy?{' '}
              <button
                type="button"
                onClick={() => router.push('/create-academy')}
                className="font-bold text-slate-900 hover:underline cursor-pointer"
              >
                Register Academy &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 TechMadrasah Inc. • White-Label Educational Platform
      </footer>
    </div>
  );
};
