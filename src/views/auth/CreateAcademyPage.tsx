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
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Code2,
  Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Badge } from '../../components/ui';
import { AuthHeroIllustration } from '../../components/illustrations/Illustrations2D';

interface CreateAcademyPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess: () => void;
}

export const CreateAcademyPage: React.FC<CreateAcademyPageProps> = ({
  onAddToast,
  onSuccess,
}) => {
  const router = useRouter();
  const { register } = useAuth();
  const { language } = useTenant();

  const [academyName, setAcademyName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [adminName, setAdminName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [niche, setNiche] = useState<'quran' | 'coding' | 'general'>('quran');
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academyName || !subdomain || !adminName || !email || !password) {
      onAddToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please complete all fields to register your academy.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      register(adminName, email, 'admin', subdomain);
      onAddToast({
        type: 'success',
        title: 'Academy Setup Completed',
        message: `Welcome to ${academyName}! Your subdomain ${subdomain}.techmadrasah.app is ready.`,
      });
      setIsSubmitting(false);
      onSuccess();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-center items-center p-4 sm:p-8 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/60 overflow-hidden">
        {/* Left Hero Visual Card */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">TechMadrasah</span>
            </div>

            <div className="pt-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Launch Your Autonomous Academy
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Receive dedicated subdomains, custom domains, authentic Quran streaming reader, WebRTC video classroom, and autonomous tuition processing.
              </p>
            </div>
          </div>

          {/* 2D Vector Graphic */}
          <div className="my-6 max-w-[260px] mx-auto">
            <AuthHeroIllustration className="w-full h-auto" />
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1 relative z-10">
            <p className="font-serif text-base text-emerald-300 font-bold">
              اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
            </p>
            <p className="text-[10px] text-slate-400 italic">
              &ldquo;Recite in the name of your Lord who created&rdquo; • Surah Al-Alaq: 1
            </p>
          </div>
        </div>

        {/* Right Form Wizard */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-extrabold text-slate-900 text-sm">TechMadrasah</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Home
              </button>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Your Academy
            </h1>
            <p className="text-xs text-slate-500">
              Complete your institution details to provision your custom portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Specialty Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Specialty
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNiche('quran')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    niche === 'quran'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Quran & Tajweed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNiche('coding')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    niche === 'coding'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span>Code Bootcamp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNiche('general')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    niche === 'general'
                      ? 'border-purple-600 bg-purple-50/60 text-purple-900 ring-1 ring-purple-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span>Language / School</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Academy Name"
                type="text"
                required
                value={academyName}
                onChange={(e) => {
                  setAcademyName(e.target.value);
                  if (!subdomain) {
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20));
                  }
                }}
                placeholder="e.g. Dar Al-Quran Academy"
                leftIcon={<Building2 className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dedicated Subdomain
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    placeholder="dar-alquran"
                    className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 font-mono"
                  />
                  <span className="px-2.5 py-2 bg-slate-100 border-l border-slate-200 text-slate-500 text-xs font-mono select-none">
                    .techmadrasah.app
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Administrator Name"
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Ustadh Dr. Abdul"
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Admin Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@academy.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Master Password"
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
              size="md"
              className="w-full justify-center shadow-xs"
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Provisioning Academy...' : 'Provision Academy & Enter Dashboard'}
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an academy account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-bold text-slate-900 hover:underline cursor-pointer"
            >
              Sign In &rarr;
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
