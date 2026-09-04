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
  BookOpen,
  GraduationCap,
  School as SchoolIcon,
  Check,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Badge } from '../../components/ui';
import { AnkabitLogo, AnkabitSpiderIcon } from '../../components/brand/AnkabitLogo';
import {
  MadrasatArtIllustration,
  CodeAcademyArtIllustration,
  SchoolSisArtIllustration,
} from '../../components/illustrations/Illustrations2D';
import { TenantNiche } from '../../types';

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

  const [institutionType, setInstitutionType] = useState<'madrasat' | 'code_academy' | 'school'>('madrasat');
  const [academyName, setAcademyName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('dar-alquran');
  const [adminName, setAdminName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const institutionConfigs = {
    madrasat: {
      title: 'Madrasat',
      subtitle: 'Quranic & Islamic Institute',
      desc: '114 Surahs Medina Mushaf reader, audio recitation looper, live halaqahs, and Sanad Ijazah verification studio.',
      brandColor: '#059669',
      badge: 'Quran & Tajweed Track',
      icon: BookOpen,
      placeholderName: 'Dar Al-Quran Madrasat',
      placeholderSubdomain: 'dar-alquran',
      glowColor: 'bg-emerald-500/20',
      Illustration: MadrasatArtIllustration,
    },
    code_academy: {
      title: 'Code Academy',
      subtitle: 'Coding Bootcamp & Tech Lab',
      desc: 'In-browser Monaco code sandbox, live JS/Python execution, automated unit test grading, and Git PR reviews.',
      brandColor: '#2563eb',
      badge: 'Software Engineering Track',
      icon: Code2,
      placeholderName: 'NextGen Code Academy',
      placeholderSubdomain: 'nextgen-code',
      glowColor: 'bg-blue-500/20',
      Illustration: CodeAcademyArtIllustration,
    },
    school: {
      title: 'School',
      subtitle: 'K-12, Higher Ed & Languages',
      desc: 'Multi-subject gradebook, attendance roster, term GPA report cards, and parent-teacher conference portal.',
      brandColor: '#7c3aed',
      badge: 'Academic SIS Track',
      icon: SchoolIcon,
      placeholderName: 'Horizon International School',
      placeholderSubdomain: 'horizon-school',
      glowColor: 'bg-purple-500/20',
      Illustration: SchoolSisArtIllustration,
    },
  };

  const currentConfig = institutionConfigs[institutionType];
  const CurrentIllustration = currentConfig.Illustration;

  const handleTypeSelect = (type: 'madrasat' | 'code_academy' | 'school') => {
    setInstitutionType(type);
    if (!academyName || academyName === institutionConfigs[institutionType].placeholderName) {
      setAcademyName(institutionConfigs[type].placeholderName);
      setSubdomain(institutionConfigs[type].placeholderSubdomain);
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    const selectedConfig = institutionConfigs[institutionType];

    try {
      // 1. Create Tenant Record in Backend/DB
      await fetch('/api/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: academyName,
          subdomain,
          niche: institutionType,
          brandColor: selectedConfig.brandColor,
        }),
      });

      // 2. Create Admin Account in Backend/DB
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          name: adminName,
          role: 'admin',
          subdomain,
        }),
      });

      // 3. Update Client Session State
      register(adminName, email, 'admin', subdomain);

      onAddToast({
        type: 'success',
        title: 'Academy Provisioned 🎉',
        message: `Welcome to ${academyName}! Your ${selectedConfig.title} portal is live.`,
      });

      setIsSubmitting(false);
      onSuccess();
      router.push(`/${subdomain}/admin`);
    } catch (err: any) {
      console.warn('Academy setup network error, using client fallback:', err);
      register(adminName, email, 'admin', subdomain);
      setIsSubmitting(false);
      onSuccess();
      router.push(`/${subdomain}/admin`);
    }
  };

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

      {/* Main Container - High Capacity Screen-Filling 6XL Card */}
      <div className="flex-1 flex items-center justify-center my-2">
        <div className="w-full max-w-6xl min-h-[84vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
          {/* Left Hero Dynamic Niche Card (5 Columns) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
            {/* Dynamic Glow based on Niche */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${currentConfig.glowColor} rounded-full blur-3xl pointer-events-none transition-all duration-300`} />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <AnkabitLogo size="md" textColor="text-white" />
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                  {currentConfig.badge}
                </span>
              </div>

              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Launch Your Branded {currentConfig.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {currentConfig.desc}
                </p>
              </div>
            </div>

            {/* Dynamic Niche Vector Illustration */}
            <div className="my-6 max-w-[320px] mx-auto transition-all duration-300">
              <CurrentIllustration className="w-full h-auto drop-shadow-2xl" />
            </div>

            {/* Dynamic Feature Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 relative z-10 shadow-inner">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentConfig.subtitle}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auto-provisions subdomain, course builder, WebRTC video rooms, and merchant gateway.
              </p>
            </div>
          </div>

          {/* Right Form Wizard (7 Columns) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    Step 1 of 2 • Academy Provisioning
                  </span>
                  <span className="text-xs text-slate-400">Takes &lt; 30 seconds</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create Your Institution
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your academy track and specify your custom subdomain & administrator credentials.
                </p>
              </div>

              {/* STEP 1: Institution Track Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  1. Choose Institution Specialty
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'madrasat', config: institutionConfigs.madrasat },
                    { id: 'code_academy', config: institutionConfigs.code_academy },
                    { id: 'school', config: institutionConfigs.school },
                  ].map(({ id, config }) => {
                    const Icon = config.icon;
                    const isSelected = institutionType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleTypeSelect(id as any)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer select-none flex flex-col justify-between min-h-[115px] ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-lg ring-2 ring-slate-900/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs`}
                              style={{ backgroundColor: config.brandColor }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-emerald-400 font-bold" />}
                          </div>
                          <div className={`font-black text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {config.title}
                          </div>
                          <div className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {config.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Academy Name & Subdomain */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Academy / Institution Name"
                    type="text"
                    required
                    value={academyName}
                    onChange={(e) => {
                      setAcademyName(e.target.value);
                      if (!subdomain || subdomain === currentConfig.placeholderSubdomain) {
                        setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20));
                      }
                    }}
                    placeholder={currentConfig.placeholderName}
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Free Dedicated Subdomain
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 shadow-xs h-10">
                      <input
                        type="text"
                        required
                        value={subdomain}
                        onChange={handleSubdomainChange}
                        placeholder={currentConfig.placeholderSubdomain}
                        className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 font-mono"
                      />
                      <span className="px-3 py-2 bg-slate-100 border-l border-slate-200 text-slate-600 text-xs font-mono font-bold select-none shrink-0">
                        .ankabit.app
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Admin Full Name"
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Dr. Tariq Mansoor"
                    leftIcon={<User className="w-4 h-4" />}
                  />

                  <Input
                    label="Official Work Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@youracademy.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                  />

                  <Input
                    label="Admin Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free 14-day full tier trial • No credit card required</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto font-bold shadow-md"
                  >
                    {isSubmitting ? 'Provisioning Academy...' : 'Launch Academy Portal'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Bottom Sign In Link */}
            <div className="pt-4 border-t border-slate-200/80 text-center text-xs text-slate-500">
              Already provisioned an academy?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Sign in to your dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 Ankabit LMS • The Autonomous Multi-Tenant Educational Operating System</p>
      </footer>
    </div>
  );
};
