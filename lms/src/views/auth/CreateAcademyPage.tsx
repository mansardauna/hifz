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
  ArrowRight,
  Sparkles,
  Code2,
  BookOpen,
  School as SchoolIcon,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Badge } from '../../components/ui';
import { AnkabitLogo } from '../../components/brand/AnkabitLogo';
import { AuthLaptopSecurityIllustration } from '../../components/illustrations/Illustrations2D';
import { TenantNiche } from '../../types';

interface CreateAcademyPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onSuccess?: (subdomain?: string) => void;
}

export const CreateAcademyPage: React.FC<CreateAcademyPageProps> = ({
  onAddToast,
  onSuccess,
}) => {
  const router = useRouter();
  const { register, login } = useAuth();
  const { language } = useTenant();

  const [institutionType, setInstitutionType] = useState<'madrasat' | 'code_academy' | 'school'>('madrasat');
  const [academyName, setAcademyName] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [isSubdomainCustomized, setIsSubdomainCustomized] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const institutionConfigs = {
    madrasat: {
      title: 'Madrasat & Quran',
      subtitle: 'Quranic & Islamic Institute',
      desc: '114 Surahs Medina Mushaf reader, audio recitation looper, live halaqahs, and Sanad Ijazah verification studio.',
      brandColor: '#059669',
      badge: 'Quran & Tajweed Track',
      icon: BookOpen,
      placeholderName: 'Dar Al-Quran Academy',
      placeholderSubdomain: 'dar-alquran',
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
    },
    school: {
      title: 'Vocational & School',
      subtitle: 'Universal Schools & Trade Skills',
      desc: 'Multi-subject gradebook, attendance roster, term GPA report cards, and parent-teacher conference portal.',
      brandColor: '#7c3aed',
      badge: 'Academic SIS Track',
      icon: SchoolIcon,
      placeholderName: 'Horizon Academy',
      placeholderSubdomain: 'horizon-academy',
    },
  };

  const currentConfig = institutionConfigs[institutionType];

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubdomainCustomized(true);
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
    setSubdomain(val);
  };

  // Real-time Subdomain Availability Check
  const subdomainCheck = React.useMemo(() => {
    const trimmed = subdomain.toLowerCase().trim();
    if (!trimmed) return { status: 'empty', message: '' };
    if (trimmed.length < 3) return { status: 'invalid', message: 'Subdomain must be at least 3 characters.' };

    const reservedSubdomains = [
      'al-furqan',
      'hifz-academy',
      'code-academy',
      'school-demo',
      'super-admin',
      'platform',
      'demo',
      'api',
      'admin',
      'mail',
      'auth',
      'login',
      'register',
      'root',
    ];

    if (reservedSubdomains.includes(trimmed)) {
      return { status: 'taken', message: `"${trimmed}" is a reserved platform name. Please choose another.` };
    }

    if (typeof window !== 'undefined') {
      const exists = localStorage.getItem(`tenant_config_${trimmed}`);
      if (exists) {
        return { status: 'taken', message: `Subdomain "${trimmed}" is already registered.` };
      }
    }

    return { status: 'available', message: `${trimmed}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost'} is available!` };
  }, [subdomain]);

  // Real-time Email Availability Check
  const emailCheck = React.useMemo(() => {
    const trimmed = email.toLowerCase().trim();
    if (!trimmed || !trimmed.includes('@')) return { status: 'empty', message: '' };

    if (typeof window !== 'undefined') {
      const existingSubdomain = localStorage.getItem(`tenant_admin_email_${trimmed}`);
      if (existingSubdomain) {
        return {
          status: 'taken',
          message: `An academy is already registered with ${trimmed}. Please sign in instead.`,
        };
      }
    }
    return { status: 'available', message: '' };
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!academyName || !subdomain || !adminName || !email || !password) {
      const msg = 'Please complete all required fields to register your academy.';
      setFormError(msg);
      onAddToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: msg,
      });
      return;
    }

    if (subdomainCheck.status === 'taken') {
      const msg = `The subdomain "${subdomain}" is already in use. Please choose a unique subdomain.`;
      setFormError(msg);
      onAddToast({
        type: 'error',
        title: 'Subdomain Already Taken',
        message: msg,
      });
      return;
    }

    if (emailCheck.status === 'taken') {
      const msg = `An account with email "${email}" is already registered. Please sign in to your existing academy.`;
      setFormError(msg);
      onAddToast({
        type: 'warning',
        title: 'Account Already Exists',
        message: msg,
        action: {
          label: 'Sign In',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    setIsSubmitting(true);
    const selectedConfig = institutionConfigs[institutionType];

    try {
      // 1. Create Tenant Record in Backend/DB
      const tenantRes = await fetch('/api/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: academyName,
          subdomain,
          niche: institutionType,
          theme: {
            primaryColor: selectedConfig.brandColor,
            primaryHover: selectedConfig.brandColor,
            secondaryColor: '#0f172a',
            accentColor: '#10b981',
            backgroundColor: '#ffffff',
            surfaceColor: '#f8fafc',
            textColor: '#0f172a',
            borderRadius: 'rounded-xl',
            fontFamily: 'Inter',
          },
          adminName,
          adminEmail: email,
          adminPassword: password,
        }),
      });

      if (!tenantRes.ok) {
        const errorData = await tenantRes.json();
        const errorMsg = errorData.error || errorData.message || 'Failed to create academy tenant';
        setFormError(errorMsg);
        onAddToast({
          type: 'error',
          title: 'Provisioning Failed',
          message: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      const tenantData = await tenantRes.json();

      // 2. Register Admin User in Auth API
      const authRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminName,
          email,
          password,
          role: 'admin',
          subdomain,
        }),
      });

      if (!authRes.ok) {
        const authErrData = await authRes.json();
        const errorMsg = authErrData.error || authErrData.message || 'Failed to register administrator account';
        setFormError(errorMsg);
        onAddToast({
          type: 'error',
          title: 'Registration Failed',
          message: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      const authData = await authRes.json();
      if (authData.token && authData.user) {
        login(authData.user, authData.user.role, authData.user.name, authData.token, authData.user.tenantId, authData.user.id, undefined, subdomain);
      } else {
        register(adminName, email, 'admin', tenantData?.tenant?.id || subdomain, undefined, subdomain);
      }

      // Local storage cache for offline responsiveness
      if (typeof window !== 'undefined') {
        try {
          const cleanTenant = {
            id: authData?.user?.tenantId || tenantData?.tenant?.id || tenantData?.id || `tenant-${subdomain}`,
            name: academyName,
            subdomain,
            niche: institutionType,
            theme: {
              primaryColor: selectedConfig.brandColor,
              primaryHover: selectedConfig.brandColor,
              secondaryColor: '#0f172a',
              accentColor: '#10b981',
              backgroundColor: '#ffffff',
              surfaceColor: '#f8fafc',
              textColor: '#0f172a',
              borderRadius: 'rounded-xl',
              fontFamily: 'Inter',
            },
            subscriptionPlan: 'free',
            pageBlocks: [],
            pricingPlans: [],
            paymentGateways: [],
            forms: [],
            customFormFields: [],
            contactEmail: email,
            contactPhone: '',
            defaultDirection: 'ltr',
          };
          localStorage.setItem(`tenant_config_${subdomain}`, JSON.stringify(cleanTenant));
          localStorage.setItem(`tenant_admin_email_${email.toLowerCase().trim()}`, subdomain);
        } catch (e) {}
      }

      onAddToast({
        type: 'success',
        title: 'Academy Provisioned',
        message: `Welcome to ${academyName}! Your ${selectedConfig.title} portal is live.`,
      });

      setIsSubmitting(false);
      if (onSuccess) onSuccess(subdomain);
      else router.push(`/${subdomain}/admin`);
    } catch (err: any) {
      const errorMsg = err.message || 'Could not communicate with the database server.';
      setFormError(errorMsg);
      onAddToast({
        type: 'error',
        title: 'Server Error',
        message: errorMsg,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-stretch font-sans selection:bg-emerald-600 selection:text-white">
      {/* ============================================================ */}
      {/* LEFT COLUMN: BRANDING & VECTOR ILLUSTRATION (Image 3 Design) */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-100 flex-col justify-between p-12 overflow-hidden border-r border-slate-200/60">
        {/* Soft Background Geometric Waves */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Top-Left Brand Logo (Image 3 Layout) */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-700 shadow-sm transition-transform group-hover:scale-105">
              <AnkabitLogo size="sm" showText={false} />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-slate-900 block leading-tight">
                Ankabit LMS
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Academy Provisioning Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Vector Illustration of Student by Laptop with Lock Badge (From Image 3) */}
        <div className="relative z-10 my-auto flex items-center justify-center py-6">
          <AuthLaptopSecurityIllustration className="w-full max-w-lg h-auto drop-shadow-xl" />
        </div>

        {/* Bottom Subtext */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          Protected by Ankabit LMS multi-tenant isolation engine with custom domains & automated SFU video rooms.
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: 1-FIELD-PER-ROW VERTICAL STACK FORM (Image 3)  */}
      {/* ============================================================ */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
        {/* Top Right Switch Button (From Image 3) */}
        <div className="flex justify-between items-center mb-6">
          <div className="lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <AnkabitLogo size="sm" />
            </Link>
          </div>
          <div className="ml-auto">
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm"
            >
              Already have an academy? Sign In
            </Link>
          </div>
        </div>

        {/* Center Form Card */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-semibold capitalize tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Instant Provisioning
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Create Your Academy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Launch your specialized LMS portal with isolated student database, live classrooms, and custom domain in seconds.
            </p>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form: STRICTLY 1 PER COLUMN (Single vertical stack, NO multi-col grid) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Track Selection (1 per col) */}
            <div className="space-y-1.5 font-sans">
              <label className="block text-xs font-semibold capitalize tracking-wider text-slate-700">
                Academy Specialization
              </label>
              <div className="space-y-2">
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
                      onClick={() => setInstitutionType(id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className="w-5 h-5 shrink-0"
                          style={{ color: config.brandColor }}
                        />
                        <div>
                          <div className="font-semibold text-xs text-slate-900">{config.title}</div>
                          <div className="text-[10px] text-slate-500">{config.subtitle}</div>
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-emerald-600 font-semibold shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 2: Academy Name (1 per col) */}
            <div className="space-y-1 font-sans">
              <Input
                label="Academy Name"
                type="text"
                required
                value={academyName}
                onChange={(e) => {
                  const val = e.target.value;
                  setAcademyName(val);
                  if (!isSubdomainCustomized) {
                    const slug = val
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .trim()
                      .replace(/[\s_]+/g, '-')
                      .replace(/-+/g, '-')
                      .slice(0, 24);
                    setSubdomain(slug);
                  }
                }}
                placeholder={currentConfig.placeholderName}
                leftIcon={<Building2 className="w-4 h-4" />}
              />
            </div>

            {/* Field 3: Subdomain Slug (1 per col) */}
            <div className="space-y-1.5 font-sans">
              <label htmlFor="subdomain-input" className="block text-xs font-semibold capitalize tracking-wider text-slate-700">
                Academy Subdomain
              </label>
              <div
                className={`relative flex items-center rounded-xl border bg-white overflow-hidden transition-colors ${
                  subdomainCheck.status === 'taken' || subdomainCheck.status === 'invalid'
                    ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                    : subdomainCheck.status === 'available'
                    ? 'border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20'
                    : 'border-slate-300 hover:border-slate-400 focus-within:border-emerald-600'
                }`}
              >
                <div className="pl-3.5 pr-1 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  id="subdomain-input"
                  type="text"
                  required
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder={currentConfig.placeholderSubdomain}
                  className="w-full px-2 py-2.5 text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-mono"
                />
                <span className="px-3 py-2.5 bg-slate-50 border-l border-slate-200 text-slate-500 text-xs sm:text-sm font-mono font-medium select-none shrink-0">
                  .{process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost'}
                </span>
              </div>

              {/* Subdomain Status Hint */}
              {subdomainCheck.status !== 'empty' && (
                <p
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    subdomainCheck.status === 'taken' || subdomainCheck.status === 'invalid'
                      ? 'text-rose-600'
                      : 'text-emerald-700'
                  }`}
                >
                  <span>{subdomainCheck.status === 'available' ? 'Available' : 'Unavailable'}:</span>
                  <span>{subdomainCheck.message}</span>
                </p>
              )}
            </div>

            {/* Field 4: Admin Full Name (1 per col) */}
            <div className="space-y-1 font-sans">
              <Input
                label="Administrator Full Name"
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>

            {/* Field 5: Admin Work Email (1 per col) */}
            <div className="space-y-1 font-sans">
              <Input
                label="Administrator Work Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@academy.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
              {emailCheck.status === 'taken' && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 inline" />
                  <span>{emailCheck.message}</span>
                </p>
              )}
            </div>

            {/* Field 6: Password (1 per col) */}
            <div className="space-y-1 font-sans">
              <label className="block text-xs font-semibold capitalize tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 7: Primary Action Button (1 per col) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Provisioning Academy...</span>
                ) : (
                  <>
                    <span>Provision Academy</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Subtext */}
        <div className="mt-8 text-center text-[11px] text-slate-400">
          By provisioning an academy, you agree to the Ankabit LMS Master Subscription Agreement and Data Privacy Addendum.
        </div>
      </div>
    </div>
  );
};
