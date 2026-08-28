import React, { useState, useMemo } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { MOCK_TENANTS } from '../../services/mockData';
import { ToastMessage } from '../ui/Toast';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IslamicStarPattern, CrescentVector, IslamicArchVector } from '../ui/IslamicArtDecoration';

interface SignInPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (role: UserRole, subdomain: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onAddToast, onSuccess }) => {
  const router = useRouter();
  const { tenant, setTenantBySubdomain } = useTenant();
  const { login } = useAuth();

  // 2-Way Role Switch: Student Portal vs Academy Admin
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState<string>('student@al-furqan.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-detect academy from entered email domain or fallback to tenant context
  const detectedTenant = useMemo(() => {
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail.includes('bayyinah')) {
      return MOCK_TENANTS['bayyinah-arabic'] || tenant;
    }
    if (lowerEmail.includes('dar-alquran') || lowerEmail.includes('dar')) {
      return MOCK_TENANTS['dar-alquran'] || tenant;
    }
    if (lowerEmail.includes('al-furqan') || lowerEmail.includes('furqan')) {
      return MOCK_TENANTS['al-furqan'] || tenant;
    }
    return tenant || MOCK_TENANTS['al-furqan'];
  }, [email, tenant]);

  const handleRoleChange = (role: 'student' | 'admin') => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('admin@al-furqan.com');
    } else {
      setEmail('student@al-furqan.com');
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

    // Sync active tenant in context
    setTenantBySubdomain(detectedTenant.subdomain);
    login(email, activeRole);
    onAddToast({
      type: 'success',
      title: 'Signed In Successfully',
      message: `Welcome back!`,
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
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background 2D Geometric Artwork */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <IslamicStarPattern className="w-full h-full text-emerald-400" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-700 text-amber-300 font-bold font-display text-2xl shadow-xl border border-emerald-500">
              ح
            </div>
            <CrescentVector className="w-6 h-6 absolute -top-2 -right-3 text-amber-400" />
          </div>

          <h2 className="text-3xl font-bold font-display text-white tracking-tight">
            Sign In to Hifz
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            Access your Quran academy portal, recitation reader, or administration CRM.
          </p>
        </div>

        {/* Card with Glassmorphism */}
        <div className="bg-white/95 backdrop-blur-md py-6 sm:py-8 px-5 sm:px-8 shadow-2xl rounded-2xl border border-slate-200/80 relative">
          {/* 2-Way Role Switch */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-md mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Academy Admin</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {activeRole === 'admin' ? 'Administrator Email' : 'Student Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute top-3 left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeRole === 'admin' ? 'admin@yourmadrasah.com' : 'student@yourmadrasah.com'}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute top-3 left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 absolute top-3 right-3 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              <span>{isSubmitting ? 'Signing In...' : activeRole === 'admin' ? 'Sign In to Admin CRM' : 'Sign In to Student Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Looking to launch an academy? </span>
            <button
              type="button"
              onClick={() => router.push('/create-academy')}
              className="font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
