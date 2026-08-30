import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
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
  Sliders
} from 'lucide-react';

interface ModernAcademySettingsProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
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

export const ModernAcademySettings: React.FC<ModernAcademySettingsProps> = ({
  onAddToast,
  onOpenUpgradeModal,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const plan = tenant.subscriptionPlan || 'free';
  const isCustomDomainUnlocked = plan === 'growth' || plan === 'enterprise';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'auth_layout' | 'security'>('general');

  // General Settings
  const [companyName, setCompanyName] = useState<string>(tenant.name || 'Hifz Quran Academy');
  const [companyId, setCompanyId] = useState<string>(tenant.id || 'ACAD-2F2467890');
  const [phoneNumber, setPhoneNumber] = useState<string>(tenant.contactPhone || '+966 50 123 4567');
  const [contactEmail, setContactEmail] = useState<string>(tenant.contactEmail || 'admissions@academy.com');
  const [timeZone, setTimeZone] = useState<string>('UTC +3:00 Arabia Standard Time (Makkah)');
  const [subdomain, setSubdomain] = useState<string>(tenant.subdomain || 'hifz-academy');
  const [customDomain, setCustomDomain] = useState<string>(tenant.customDomain || '');

  // Theme & Branding
  const [primaryColor, setPrimaryColor] = useState<string>(tenant.theme?.primaryColor || '#059669');
  const [secondaryColor, setSecondaryColor] = useState<string>(tenant.theme?.secondaryColor || '#d97706');
  const [fontFamily, setFontFamily] = useState<string>(tenant.theme?.fontFamily || 'Poppins');
  const [borderRadius, setBorderRadius] = useState<string>(tenant.theme?.borderRadius || '0.5rem');
  const [customCss, setCustomCss] = useState<string>(tenant.customCss || '');

  // Auth Layout Customization
  const [authLayout, setAuthLayout] = useState<'split' | 'card' | 'minimal' | 'banner'>(
    tenant.authCustomization?.layout || 'split'
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

  // Security State
  const [password, setPassword] = useState<string>('••••••••••••');
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
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleSaveAllSettings = () => {
    updateTenantConfig({
      name: companyName,
      contactPhone: phoneNumber,
      contactEmail: contactEmail,
      subdomain: subdomain,
      customDomain: customDomain,
      customCss: customCss,
      customFormFields: customFields,
      theme: {
        ...tenant.theme,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        fontFamily: fontFamily,
        borderRadius: borderRadius,
      },
      authCustomization: {
        layout: authLayout,
        welcomeHeading,
        welcomeSubtitle,
        calligraphyText,
        calligraphyTranslation,
      }
    });

    // Apply primary color immediately to CSS variable
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    onAddToast({
      type: 'success',
      title: 'Academy Settings Saved',
      message: 'Your branding, theme colors, and custom auth layout have been updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Settings Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>General & Domains</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-600" />
            <span>Theme & Colors</span>
          </button>

          <button
            onClick={() => setActiveTab('auth_layout')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'auth_layout'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4 text-blue-600" />
            <span>Auth & Login Experience</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-slate-700" />
            <span>Security & Access</span>
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveAllSettings}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>

      {/* 1. General Profile & Subdomains */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Academy Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Academy Legal / Brand Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Hifz Quran Academy"
                leftIcon={<Building2 className="w-4 h-4" />}
              />

              <Input
                label="Admissions Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admissions@academy.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Contact Phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+966 50 123 4567"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone</label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="UTC +3:00 Arabia Standard Time (Makkah)">UTC +3:00 Arabia Standard Time (Makkah)</option>
                  <option value="UTC +0:00 London (GMT)">UTC +0:00 London (GMT)</option>
                  <option value="UTC -5:00 Central">UTC -5:00 Central (US)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Subdomain & Custom Domains */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Domain & URL Routing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Subdomain
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                    placeholder="academy"
                  />
                  <span className="px-3 bg-slate-100 text-slate-500 text-xs font-mono border-l border-slate-200 py-2">
                    .techmadrasah.app
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Custom Domain CNAME
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="learn.youracademy.com"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 2. Theme & Colors */}
      {activeTab === 'branding' && (
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">
              Theme & Visual Branding Engine
            </h3>
            <p className="text-xs text-slate-500">
              Customize colors, fonts, and styling applied across your student portal, classroom, and public pages.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                {PRESET_BRAND_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
                    style={{ backgroundColor: c }}
                  >
                    {primaryColor === c && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-xs font-mono text-slate-500">{primaryColor}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Poppins">Poppins (Clean & Modern)</option>
                  <option value="Inter">Inter (SaaS Standard)</option>
                  <option value="Cairo">Cairo (Arabic Optimized)</option>
                  <option value="Playfair Display">Playfair Display (Classical)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Border Radius Style
                </label>
                <select
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="0.25rem">Sharp (4px)</option>
                  <option value="0.5rem">Subtle Rounded (8px)</option>
                  <option value="0.75rem">Smooth (12px)</option>
                  <option value="1rem">Pill / Soft (16px)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Custom CSS Override
              </label>
              <textarea
                rows={3}
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="/* Custom CSS styling rules injected into your academy */"
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </Card>
      )}

      {/* 3. Auth & Login Experience */}
      {activeTab === 'auth_layout' && (
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">
              Auth Page Layout & Registration Fields
            </h3>
            <p className="text-xs text-slate-500">
              Choose your login page layout, custom calligraphy headers, and configure student registration fields.
            </p>
          </div>

          {/* Layout Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Auth Page Layout Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAuthLayout('split')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  authLayout === 'split'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Layout className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Split Screen Hero</div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Visual card on left with calligraphy quote and form on right.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAuthLayout('card')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  authLayout === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Centered Card</div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Focused standalone card centered on the screen.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAuthLayout('minimal')}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                  authLayout === 'minimal'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Type className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">Minimalist</div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Clean borderless form focused on rapid authentication.
                </p>
              </button>
            </div>
          </div>

          {/* Copy Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Welcome Heading"
              value={welcomeHeading}
              onChange={(e) => setWelcomeHeading(e.target.value)}
              placeholder="Welcome to Your Academy Workspace"
            />

            <Input
              label="Welcome Subtitle"
              value={welcomeSubtitle}
              onChange={(e) => setWelcomeSubtitle(e.target.value)}
              placeholder="Enter your account credentials to access your portal..."
            />

            <Input
              label="Arabic Calligraphy / Motto"
              value={calligraphyText}
              onChange={(e) => setCalligraphyText(e.target.value)}
              placeholder="وَقُل رَّبِّ زِدْنِي عِلْمًا"
            />

            <Input
              label="Quote Translation"
              value={calligraphyTranslation}
              onChange={(e) => setCalligraphyTranslation(e.target.value)}
              placeholder="And say: My Lord, increase me in knowledge"
            />
          </div>

          {/* Custom Registration Fields */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Student Registration Fields</h4>
                <p className="text-[11px] text-slate-500">Collect custom information from newly registered students.</p>
              </div>
            </div>

            <div className="space-y-2">
              {customFields.map((field) => (
                <div key={field.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{field.label}</span>
                    <span className="text-slate-400 ml-2 font-mono">({field.type})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Field */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g. Student ID, Guardian Phone..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="text">Text Field</option>
                <option value="phone">Phone Number</option>
                <option value="select">Dropdown Options</option>
              </select>
              <Button size="sm" variant="outline" onClick={handleAddField} leftIcon={<Plus className="w-3 h-3" />}>
                Add Field
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Security */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Security & Authentication Control
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Master Administrator Password
              </label>
              <div className="relative max-w-md">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pr-10 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Two-Factor Authentication (2FA)
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setActive2faMethod('email')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                    active2faMethod === 'email'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email One-Time Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActive2faMethod('sms')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                    active2faMethod === 'sms'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>SMS Mobile Code</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
