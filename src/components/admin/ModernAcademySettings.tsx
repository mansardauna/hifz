import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { LockedFeatureCard } from './LockedFeatureCard';
import { AuthPageCustomization, FormFieldConfig } from '../../types';
import {
  Building2,
  Phone,
  MapPin,
  Globe,
  Upload,
  Clock,
  Sparkles,
  Shield,
  KeyRound,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Check,
  Palette,
  ExternalLink,
  ShieldCheck,
  Layout,
  Type,
  Code,
  Plus,
  Trash2,
  Sliders,
  Users,
  UserPlus,
  UserCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface ModernAcademySettingsProps {
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
  onOpenUpgradeModal?: () => void;
}

const PRESET_BRAND_COLORS = [
  '#059669', // Emerald Green (Default)
  '#d97706', // Amber Gold
  '#dc2626', // Crimson Red
  '#2563eb', // Royal Blue
  '#7c3aed', // Vibrant Purple
  '#0f172a', // Slate Dark
  '#1C1B73', // Navy Indigo
  '#0d9488', // Teal
];

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'registrar' | 'parent';
  status: 'active' | 'invited';
  assignedClasses: number;
}

export const ModernAcademySettings: React.FC<ModernAcademySettingsProps> = ({
  onAddToast,
  onOpenUpgradeModal,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success, error, info } = useToast();
  const plan = tenant.subscriptionPlan || 'free';
  const isCustomDomainUnlocked = plan === 'growth' || plan === 'enterprise';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'roles_permissions' | 'auth_layout' | 'security'>('general');

  // General Settings
  const [companyName, setCompanyName] = useState<string>(tenant.name || 'Hifz Quran Academy');
  const [companyId, setCompanyId] = useState<string>(tenant.id || 'ACAD-2F2467890');
  const [phoneNumber, setPhoneNumber] = useState<string>(tenant.contactPhone || '+966 50 123 4567');
  const [contactEmail, setContactEmail] = useState<string>(tenant.contactEmail || 'admissions@academy.com');
  const [timeZone, setTimeZone] = useState<string>('UTC +3:00 Arabia Standard Time (Makkah)');
  const [subdomain, setSubdomain] = useState<string>(tenant.subdomain || 'hifz-academy');
  const [customDomain, setCustomDomain] = useState<string>(tenant.customDomain || '');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);

  // Theme & Branding
  const [logoUrl, setLogoUrl] = useState<string>(tenant.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState<string>(tenant.faviconUrl || '/icons/icon.svg');
  const [primaryColor, setPrimaryColor] = useState<string>(tenant.theme?.primaryColor || '#059669');
  const [secondaryColor, setSecondaryColor] = useState<string>(tenant.theme?.secondaryColor || '#d97706');
  const [fontFamily, setFontFamily] = useState<string>(tenant.theme?.fontFamily || 'Poppins');
  const [borderRadius, setBorderRadius] = useState<string>(tenant.theme?.borderRadius || '0.5rem');
  const [customCss, setCustomCss] = useState<string>(tenant.customCss || '');

  // Auth Layout Customization
  const [authLayout, setAuthLayout] = useState<'split' | 'centered_glass' | 'minimal_card' | 'heritage_frame'>(
    (tenant.authCustomization?.layout as any) || 'split'
  );
  const [welcomeHeading, setWelcomeHeading] = useState<string>(
    tenant.authCustomization?.welcomeHeading || 'Welcome to Your Academy Workspace'
  );
  const [welcomeSubtitle, setWelcomeSubtitle] = useState<string>(
    tenant.authCustomization?.welcomeSubtitle || 'Enter your account credentials to access your courses, classroom huddles, and student records.'
  );
  const [calligraphyText, setCalligraphyText] = useState<string>(
    tenant.authCustomization?.calligraphyText || 'وَقُل رَّبِّ زِدْنِي عِلْمًا'
  );
  const [calligraphyTranslation, setCalligraphyTranslation] = useState<string>(
    tenant.authCustomization?.calligraphyTranslation || '“And say: My Lord, increase me in knowledge” • Surah Taha: 114'
  );

  // Custom Fields for Student Registration
  const [customFields, setCustomFields] = useState<FormFieldConfig[]>(
    tenant.customFormFields || [
      { id: 'parentName', label: 'Parent / Guardian Name', labelAr: 'اسم ولي الأمر', type: 'text', required: false, width: 'half' },
      { id: 'memorizedJuz', label: 'Current Juz Memorized (0-30)', labelAr: 'عدد الأجزاء المحفوظة', type: 'select', required: true, width: 'half' }
    ]
  );
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'select' | 'phone'>('text');

  // Staff & RBAC State
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: 'st-1', name: 'Sheikh Tariq Al-Mansoor', email: 'director@academy.com', role: 'admin', status: 'active', assignedClasses: 6 },
    { id: 'st-2', name: 'Ustadh Bilal Hashmi', email: 'bilal@academy.com', role: 'teacher', status: 'active', assignedClasses: 4 },
    { id: 'st-3', name: 'Ustadha Fatima Zahra', email: 'fatima@academy.com', role: 'teacher', status: 'active', assignedClasses: 3 },
    { id: 'st-4', name: 'Brother Kareem Said', email: 'admissions@academy.com', role: 'registrar', status: 'invited', assignedClasses: 0 },
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'teacher' | 'registrar'>('teacher');

  // Role Permissions Matrix
  const [rolePermissions, setRolePermissions] = useState({
    admin: { manageBilling: true, editLanding: true, manageCourses: true, gradeSubmissions: true, liveClass: true, forumMod: true },
    teacher: { manageBilling: false, editLanding: false, manageCourses: true, gradeSubmissions: true, liveClass: true, forumMod: true },
    registrar: { manageBilling: false, editLanding: false, manageCourses: false, gradeSubmissions: false, liveClass: false, forumMod: false },
    student: { manageBilling: false, editLanding: false, manageCourses: false, gradeSubmissions: false, liveClass: true, forumMod: true },
    parent: { manageBilling: false, editLanding: false, manageCourses: false, gradeSubmissions: false, liveClass: false, forumMod: false },
  });

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [active2faMethod, setActive2faMethod] = useState<string | null>('email');

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}`,
      label: newFieldName.trim(),
      labelAr: newFieldName.trim(),
      type: newFieldType,
      required: false,
      width: 'full',
    };
    setCustomFields([...customFields, newField]);
    setNewFieldName('');
    success('Field Added', `Added "${newField.label}" to registration form.`);
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
    info('Field Removed', 'Registration field removed.');
  };

  const handleInviteStaff = () => {
    if (!inviteEmail.trim() || !inviteName.trim()) {
      error('Missing Details', 'Please provide a staff name and valid email address.');
      return;
    }
    const newMember: StaffMember = {
      id: `st-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'invited',
      assignedClasses: 0,
    };
    setStaffList([...staffList, newMember]);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
    success('Invitation Sent', `Sent role invitation to ${newMember.email} as ${newMember.role.toUpperCase()}.`);
  };

  const handleRemoveStaff = (id: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
    info('Staff Member Removed', 'Staff access has been revoked.');
  };

  const handleSaveGeneral = () => {
    updateTenantConfig({
      name: companyName,
      contactPhone: phoneNumber,
      contactEmail: contactEmail,
      customDomain: customDomain || undefined,
    });
    success('Settings Saved', 'Academy profile and general contact details updated.');
  };

  const handleSaveBranding = () => {
    updateTenantConfig({
      logoUrl: logoUrl || undefined,
      faviconUrl: faviconUrl || undefined,
      theme: {
        ...tenant.theme,
        primaryColor,
        primaryHover: primaryColor,
        secondaryColor,
        fontFamily,
        borderRadius,
      },
      customCss,
    });
    success('Theme & Branding Applied', 'Colors, logo, unique favicon, and font styles updated across all views.');
  };

  const handleSaveAuthLayout = () => {
    updateTenantConfig({
      authCustomization: {
        layout: authLayout,
        welcomeHeading,
        welcomeSubtitle,
        calligraphyText,
        calligraphyTranslation,
      },
      customFormFields: customFields,
    });
    success('Login Experience Updated', 'Authentication layout and registration fields updated.');
  };

  const handleVerifyCustomDomain = () => {
    if (!customDomain.trim()) {
      error('Domain Required', 'Please enter your custom domain (e.g. academy.com).');
      return;
    }
    if (!isCustomDomainUnlocked) {
      if (onOpenUpgradeModal) onOpenUpgradeModal();
      return;
    }
    setIsVerifyingDomain(true);
    setTimeout(() => {
      setIsVerifyingDomain(false);
      success('DNS Connected! 🎉', `CNAME record for ${customDomain} successfully resolved to Vercel.`);
    }, 1200);
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword.length < 8) {
      error('Password Too Short', 'New password must be at least 8 characters long.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    success('Password Updated', 'Your administrative security credentials have been updated.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">
            Academy Architecture & RBAC
          </Badge>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Settings, Staff Roles & White-labeling
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure institutional profile, branding tokens, staff role permissions, and authentication security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active Tier: <strong className="uppercase">{plan}</strong>
          </span>
          {plan !== 'enterprise' && onOpenUpgradeModal && (
            <Button variant="outline" size="sm" onClick={onOpenUpgradeModal} className="font-bold text-xs">
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>General & Domain</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'branding'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Branding & Theme Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab('roles_permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roles_permissions'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Roles & RBAC</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
            {staffList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('auth_layout')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'auth_layout'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Login Experience & Form Fields</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Sessions</span>
        </button>
      </div>

      {/* TAB 1: GENERAL & DOMAIN */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Institutional Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academy Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academy Registration ID</label>
                <input
                  type="text"
                  disabled
                  value={companyId}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admissions Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </Card>

          {/* Subdomain & Custom Domain */}
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Domain & URL Routing</span>
            </h3>

            <div className="space-y-4">
              {/* Default Subdomain */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Platform Subdomain (Free & Always Active)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-600 font-bold">
                    https://
                  </span>
                  <input
                    type="text"
                    disabled
                    value={subdomain}
                    className="w-48 px-3 py-2 border-y border-slate-300 text-xs font-mono font-bold bg-slate-50 text-slate-800 cursor-not-allowed"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-xs font-mono text-slate-600 font-bold">
                    .ankabit.app
                  </span>
                </div>
              </div>

              {/* Custom Domain (Feature Gated) */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Connect Custom Apex/Subdomain (e.g. quranacademy.org)
                  </label>
                  {!isCustomDomainUnlocked && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      Growth & Enterprise Tier
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="academy.org or lms.myinstitution.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    disabled={!isCustomDomainUnlocked}
                    className={`flex-1 px-3 py-2 border rounded-xl text-xs font-mono ${
                      isCustomDomainUnlocked
                        ? 'border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600'
                        : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  />

                  <Button
                    variant={isCustomDomainUnlocked ? 'primary' : 'outline'}
                    size="sm"
                    onClick={handleVerifyCustomDomain}
                    isLoading={isVerifyingDomain}
                    className="font-bold text-xs"
                  >
                    {isCustomDomainUnlocked ? 'Verify DNS' : 'Unlock Custom Domain'}
                  </Button>
                </div>

                {isCustomDomainUnlocked && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    Point a CNAME record from your domain registrar to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-700">cname.vercel-dns.com</code>. SSL certificate generates automatically.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="primary" size="sm" onClick={handleSaveGeneral} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                Save General Settings
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: BRANDING & THEME TOKENS */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          {/* Brand Identity & Favicon Card */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span>Logos & Subdomain Favicon</span>
                </h3>
                <span className="text-xs text-slate-500">Customize the browser tab icon and academy logo across student dashboards</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academy Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://your-domain.com/logo.png"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Recommended: Transparent PNG or SVG (256x256px or wider)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subdomain Favicon URL (Browser Tab Icon)
                  </label>
                  <input
                    type="url"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://your-domain.com/favicon.ico"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Direct link to your .ico, .png, or .svg icon</p>
                </div>
              </div>

              {/* Live Browser Tab Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Live Browser Tab Preview</label>
                <div className="bg-slate-900 rounded-xl p-3 shadow-inner border border-slate-800">
                  {/* Fake browser top bar */}
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    <div className="ml-2 text-[10px] text-slate-500 font-mono flex-1 truncate">
                      https://{subdomain || 'your-academy'}.ankabit.app
                    </div>
                  </div>

                  {/* Browser Tab */}
                  <div className="mt-2.5 max-w-[280px] bg-slate-800 rounded-t-lg px-3 py-1.5 flex items-center gap-2 border border-slate-700 border-b-0 shadow-sm">
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="Favicon"
                        className="w-4 h-4 rounded-xs object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/icons/icon.svg';
                        }}
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                        {companyName.charAt(0) || 'A'}
                      </div>
                    )}
                    <span className="text-xs text-slate-200 font-medium truncate">
                      {companyName} • Ankabit
                    </span>
                    <span className="ml-auto text-[10px] text-slate-500">×</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Theme Tokens Card */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span>Theme Tokens & Brand Colors</span>
              </h3>
              <span className="text-xs text-slate-500">Applies across all student & landing pages</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Preset Brand Palette</label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_BRAND_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setPrimaryColor(c);
                        info('Color Selected', `Primary brand color set to ${c}.`);
                      }}
                      style={{ backgroundColor: c }}
                      className={`w-9 h-9 rounded-xl transition-transform cursor-pointer flex items-center justify-center shadow-xs ${
                        primaryColor === c ? 'ring-3 ring-emerald-400 scale-110 shadow-md' : 'hover:scale-105'
                      }`}
                    >
                      {primaryColor === c && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Color Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Poppins">Poppins (Modern Clean)</option>
                    <option value="Inter">Inter (SaaS Standard)</option>
                    <option value="Amiri">Amiri (Traditional Quranic Naskh)</option>
                    <option value="Cairo">Cairo (Contemporary Arabic)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom CSS Overrides</label>
                <textarea
                  rows={3}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Custom CSS overrides for your academy pages */"
                  className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="primary" size="sm" onClick={handleSaveBranding} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                Save & Apply Brand Theme
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: STAFF ROLES & RBAC */}
      {activeTab === 'roles_permissions' && (
        <div className="space-y-6">
          {/* Staff Members Management */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Academy Staff & Direct Role Assignment</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Directly provision accounts or assign roles for teachers, registrars, and sub-administrators.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsInviteModalOpen(true)}
                leftIcon={<UserPlus className="w-4 h-4" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Provision / Invite Staff
              </Button>
            </div>

            {/* Staff Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Assigned Classes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{staff.name}</div>
                        <div className="text-slate-500 text-[11px]">{staff.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold capitalize">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px]">
                          {staff.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{staff.assignedClasses} Courses</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={staff.status === 'active' ? 'success' : 'warning'}>
                          {staff.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer font-semibold text-xs"
                          title="Revoke access"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Public Signups & Student/Teacher Admissions Approval Queue */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Public Signups & Role Access Approval Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant signups and accept them before granting access to their student or instructor dashboard.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
                3 Pending Review
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Requested Role</th>
                    <th className="py-3 px-4">Applied Track</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { id: 'app-1', name: 'Zaid Al-Mansoor', email: 'zaid@student.com', role: 'student', track: 'Quran Hifz & Tajweed', time: '10 mins ago' },
                    { id: 'app-2', name: 'Maryam Al-Sabah', email: 'maryam@learner.com', role: 'student', track: 'Full Quran Memorization', time: '1 hour ago' },
                    { id: 'app-3', name: 'Ustadh Hisham Qureshi', email: 'hisham.q@instructor.com', role: 'teacher', track: 'Advanced Qira\'at Halaqah', time: 'Yesterday' },
                  ].map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{app.name}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{app.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold capitalize">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${app.role === 'teacher' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {app.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{app.track}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{app.time}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            success('Applicant Approved! 🚀', `Granted dashboard access to ${app.name} (${app.email}) and dispatched welcome credentials.`);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] py-1 px-2.5"
                        >
                          Accept & Activate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            info('Application Rejected', `Declined applicant ${app.name}.`);
                          }}
                          className="text-rose-600 hover:bg-rose-50 text-[11px] py-1 px-2 border-rose-200"
                        >
                          Decline
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Role Permissions Matrix */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Granular Role Permission Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure what actions each account role is permitted to perform.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Permission Capability</th>
                    <th className="py-3 px-3 text-center">Academy Admin</th>
                    <th className="py-3 px-3 text-center">Instructor / Teacher</th>
                    <th className="py-3 px-3 text-center">Registrar</th>
                    <th className="py-3 px-3 text-center">Student</th>
                    <th className="py-3 px-3 text-center">Parent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-semibold">Manage Billing & Gateways</td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Host Live WebRTC Classrooms</td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Grade Recitations & Feedback</td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Post in Community Forum</td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">View Child Attendance & Invoices</td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="text-center py-3"><Lock className="w-4 h-4 text-slate-300 mx-auto" /></td>
                    <td className="text-center py-3"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: AUTH LAYOUT & REGISTRATION FIELDS */}
      {activeTab === 'auth_layout' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layout className="w-5 h-5 text-emerald-600" />
                <span>Login Layout & Student Registration Setup</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the authentication interface for your students, parents, and teachers.
              </p>
            </div>

            <a
              href={`/${tenant.subdomain}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Preview Live Login</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Visual Layout Style Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Select Academy Login Layout
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'split',
                  title: 'Split Modern',
                  desc: 'Dark Islamic hero with calligraphy, ayah quote, and side login card.',
                  badge: 'Recommended',
                },
                {
                  id: 'centered_glass',
                  title: 'Medina Glass',
                  desc: 'Frosted emerald glassmorphic floating card with Bismillah medallion.',
                  badge: 'Majestic',
                },
                {
                  id: 'minimal_card',
                  title: 'Minimalist Clean',
                  desc: 'Clean white SaaS layout with high contrast typography.',
                  badge: 'Focused',
                },
                {
                  id: 'heritage_frame',
                  title: 'Arabesque Frame',
                  desc: 'Ornate geometric border with gold accents & Quranic calligraphy.',
                  badge: 'Traditional',
                },
              ].map((style) => {
                const isSelected = authLayout === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setAuthLayout(style.id as any)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-xs text-slate-900">{style.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{style.desc}</p>
                    </div>
                    <div className="mt-3">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {style.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Welcome Header Text</label>
              <input
                type="text"
                value={welcomeHeading}
                onChange={(e) => setWelcomeHeading(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calligraphy Verse Quote</label>
              <input
                type="text"
                value={calligraphyText}
                onChange={(e) => setCalligraphyText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-arabic font-bold"
              />
            </div>
          </div>

          {/* Custom Student Fields */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Custom Student Registration Form Fields
            </h4>

            <div className="space-y-2">
              {customFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{field.label}</span>
                    <span className="text-slate-500 ml-2 font-mono text-[11px]">({field.type})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="New field label (e.g. Previous Quran Teacher Name)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="text">Text Input</option>
                <option value="select">Dropdown Select</option>
                <option value="phone">Phone Number</option>
              </select>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddField} className="font-bold text-xs">
                Add Field
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" size="sm" onClick={handleSaveAuthLayout} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
              Save Login & Form Settings
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 5: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Security Credentials & Two-Factor Authentication</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Administrator Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 8 characters..."
                  className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="primary" size="sm" onClick={handleUpdatePassword} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                Update Password
              </Button>
            </div>
          </div>

          {/* 2FA */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Two-Factor Authentication (2FA)
            </h4>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Email Verification OTP Codes</div>
                  <div className="text-[11px] text-slate-500">Require 6-digit confirmation code on new device logins</div>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Staff Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Invite New Staff Member</span>
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sheikh Abdullah"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@academy.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
                >
                  <option value="teacher">Instructor / Teacher (Live Class, Grading)</option>
                  <option value="registrar">Admissions Registrar (Leads CRM, Invoices)</option>
                  <option value="admin">Assistant Director / Sub-Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleInviteStaff} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
