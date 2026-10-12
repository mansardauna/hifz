import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useToast } from '../../../context/ToastContext';
import { Button, Input, Select, Card, Badge, PageHeader, AppPreloader } from '../../ui';
import { FormFieldConfig } from '../../../types';
import { detectTenantNicheType } from '../../../services/classroomCustomizationService';
import {
  Palette,
  Layout,
  Upload,
  Sparkles,
  Eye,
  Check,
  Plus,
  Trash2,
  Code,
  Type,
  Sliders,
  Save,
  Layers,
  Copy,
  ExternalLink
} from 'lucide-react';

const PRESET_BRAND_COLORS = [
  { name: 'Emerald Green', value: '#059669' },
  { name: 'Amber Gold', value: '#d97706' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Vibrant Purple', value: '#7c3aed' },
  { name: 'Slate Dark', value: '#0f172a' },
  { name: 'Navy Indigo', value: '#1C1B73' },
  { name: 'Teal Ocean', value: '#0d9488' },
];

const PRESET_SIDEBAR_COLORS = [
  { label: 'Dark Slate (Standard)', value: '#0f172a' },
  { label: 'Deep Midnight', value: '#020617' },
  { label: 'Deep Forest', value: '#064e3b' },
  { label: 'Deep Indigo', value: '#1e1b4b' },
  { label: 'Royal Plum', value: '#2e1065' },
  { label: 'Charcoal Minimal', value: '#18181b' },
];

interface BrandingWhiteLabelingProps {
  onOpenUpgradeModal?: () => void;
}

export const BrandingWhiteLabeling: React.FC<BrandingWhiteLabelingProps> = ({
  onOpenUpgradeModal,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success, error, info } = useToast();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';
  const plan = tenant.subscriptionPlan || 'free';

  // Assets & Colors
  const [logoUrl, setLogoUrl] = useState<string>(tenant.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState<string>(tenant.faviconUrl || '/icons/icon.svg');
  const [primaryColor, setPrimaryColor] = useState<string>(tenant.theme?.primaryColor || '#059669');
  const [secondaryColor, setSecondaryColor] = useState<string>(tenant.theme?.secondaryColor || '#d97706');
  const [sidebarBgColor, setSidebarBgColor] = useState<string>(tenant.theme?.sidebarBgColor || '#0f172a');
  const [fontFamily, setFontFamily] = useState<string>(tenant.theme?.fontFamily || 'Poppins');
  const [borderRadius, setBorderRadius] = useState<string>(tenant.theme?.borderRadius || '0.75rem');
  const [customCss, setCustomCss] = useState<string>(tenant.customCss || '');

  // Preloader Customization
  const [preloaderText, setPreloaderText] = useState<string>(
    tenant.preloaderCustomization?.customText || 'Loading academy...'
  );
  const [preloaderTextAr, setPreloaderTextAr] = useState<string>(
    tenant.preloaderCustomization?.customTextAr || 'جارٍ تحميل المنصة...'
  );
  const [preloaderShowLogo, setPreloaderShowLogo] = useState<boolean>(
    tenant.preloaderCustomization?.showLogo ?? true
  );
  const [isPreviewingPreloader, setIsPreviewingPreloader] = useState<boolean>(false);

  // Auth Layout Customization
  const [authLayout, setAuthLayout] = useState<'split' | 'centered_glass' | 'minimal_card' | 'heritage_frame'>(
    (tenant.authCustomization?.layout as any) || 'split'
  );
  const [welcomeHeading, setWelcomeHeading] = useState<string>(
    tenant.authCustomization?.welcomeHeading || 'Welcome to Your Academy Workspace'
  );
  const [welcomeSubtitle, setWelcomeSubtitle] = useState<string>(
    tenant.authCustomization?.welcomeSubtitle ||
      'Enter your account credentials to access your courses, classroom huddles, and student records.'
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
    tenant.authCustomization?.backgroundImageUrl || ''
  );
  const [calligraphyText, setCalligraphyText] = useState<string>(
    tenant.authCustomization?.calligraphyText ||
      (isQuran ? 'وَقُل رَّبِّ زِدْنِي عِلْمًا' : 'Inspiring Excellence Through Learning')
  );
  const [calligraphyTranslation, setCalligraphyTranslation] = useState<string>(
    tenant.authCustomization?.calligraphyTranslation ||
      (isQuran
        ? '“And say: My Lord, increase me in knowledge” • Surah Taha: 114'
        : 'Dedicated to lifelong education and professional development')
  );

  // Custom Fields for Student Registration
  const [customFields, setCustomFields] = useState<FormFieldConfig[]>(
    tenant.customFormFields ||
      (isQuran
        ? [
            {
              id: 'parentName',
              label: 'Parent / Guardian Name',
              labelAr: 'اسم ولي الأمر',
              type: 'text',
              required: false,
              width: 'half',
            },
            {
              id: 'memorizedJuz',
              label: 'Current Juz Memorized (0-30)',
              labelAr: 'عدد الأجزاء المحفوظة',
              type: 'select',
              required: true,
              width: 'half',
            },
          ]
        : [
            {
              id: 'parentName',
              label: 'Parent / Guardian Name',
              labelAr: 'اسم ولي الأمر',
              type: 'text',
              required: false,
              width: 'half',
            },
            {
              id: 'experienceLevel',
              label: 'Prior Academic Experience',
              labelAr: 'الخبرة السابقة',
              type: 'select',
              required: true,
              width: 'half',
            },
          ])
  );
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'select' | 'phone'>('text');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'theme' | 'auth' | 'preloader' | 'fields' | 'css'>('theme');

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
    setCustomFields(customFields.filter((f) => f.id !== id));
    info('Field Removed', 'Registration field removed.');
  };

  const handleSaveBranding = () => {
    setIsSaving(true);
    try {
      updateTenantConfig({
        logoUrl: logoUrl.trim() || undefined,
        faviconUrl: faviconUrl.trim() || undefined,
        theme: {
          ...tenant.theme,
          primaryColor,
          secondaryColor,
          sidebarBgColor,
          fontFamily,
          borderRadius,
        },
        preloaderCustomization: {
          customText: preloaderText,
          customTextAr: preloaderTextAr,
          showLogo: preloaderShowLogo,
        },
        authCustomization: {
          layout: authLayout,
          welcomeHeading,
          welcomeSubtitle,
          backgroundImageUrl,
          calligraphyText,
          calligraphyTranslation,
        },
        customFormFields: customFields,
        customCss: customCss.trim(),
      });
      success('Settings Saved', 'Branding configurations and theme tokens updated successfully.');
    } catch (err: any) {
      error('Save Failed', err.message || 'Could not update branding configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Branding & White-label"
        subtitle="Transform the entire portal experience to match your institution's brand identity, custom logo, theme tokens, preloader, and registration forms."
        actions={
          <Button
            variant="primary"
            onClick={handleSaveBranding}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'theme'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Brand & Palette</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auth')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'auth'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Sign-In Portal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preloader')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'preloader'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Preloader Screen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fields')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'fields'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Registration Fields</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'css'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Custom CSS</span>
        </button>
      </div>

      {/* TAB 1: Theme & Brand Palette */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          {/* Section 1: Brand Assets (Logo & Favicon) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Layers className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Brand Assets & Logos</h2>
                <p className="text-xs text-slate-500">Official icons and logos displayed across navigation headers, login cards, and student reports.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo URL */}
              <div className="space-y-3">
                <Input
                  label="Primary Logo URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  helperText="Recommended format: SVG or transparent PNG (min 400x120px)."
                />

                {/* Live Logo Preview Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Logo Live Preview:</span>
                  <div className="h-12 max-w-[200px] px-3 py-1 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 italic">No custom logo set</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Favicon URL */}
              <div className="space-y-3">
                <Input
                  label="Browser Favicon URL"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="/icons/icon.svg"
                  helperText="Displayed in browser tabs and bookmarks (32x32px or SVG)."
                />

                {/* Favicon Preview */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Favicon Tab Preview:</span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <img
                      src={faviconUrl || '/icons/icon.svg'}
                      alt="Favicon"
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.target as any).src = '/icons/icon.svg';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Color Palette & Navigation Themes */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Palette className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Color Palette & Theme Tokens</h2>
                <p className="text-xs text-slate-500">Pick signature accent colors applied to buttons, badges, links, and the administrative sidebar.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Primary Accent Color Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">
                    Primary Brand Accent Color
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {primaryColor}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {PRESET_BRAND_COLORS.map((color) => {
                    const isSelected = primaryColor.toLowerCase() === color.value.toLowerCase();
                    return (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setPrimaryColor(color.value)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-xs scale-102 bg-white'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full shadow-2xs flex items-center justify-center text-white"
                          style={{ backgroundColor: color.value }}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate w-full">{color.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Picker */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#059669"
                    className="font-mono max-w-[200px]"
                  />
                  <span className="text-xs text-slate-500">Pick any custom HEX color code</span>
                </div>
              </div>

              {/* Sidebar Navigation Background */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-800">
                  Admin & Student Sidebar Navigation Theme
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {PRESET_SIDEBAR_COLORS.map((theme) => {
                    const isSelected = sidebarBgColor.toLowerCase() === theme.value.toLowerCase();
                    return (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => setSidebarBgColor(theme.value)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-xs bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg shadow-2xs flex items-center justify-end px-2 text-white"
                          style={{ backgroundColor: theme.value }}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family & Border Radius */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                <Select
                  label="Primary Typography Font Family"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  options={[
                    { value: 'Poppins', label: 'Poppins (Modern Clean Geometric)' },
                    { value: 'Inter', label: 'Inter (Professional Crisp UI)' },
                    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Contemporary Tech)' },
                    { value: 'Amiri', label: 'Amiri (Classical Arabic Calligraphic)' },
                    { value: 'Cairo', label: 'Cairo (Modern Arabic & Latin Hybrid)' },
                  ]}
                />

                <Select
                  label="Component Border Curvature (Radius)"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  options={[
                    { value: '0.75rem', label: 'Rounded-XL (12px - Modern Standard)' },
                    { value: '1rem', label: 'Rounded-2XL (16px - Soft & Friendly)' },
                    { value: '0.5rem', label: 'Rounded-LG (8px - Compact Enterprise)' },
                    { value: '0.25rem', label: 'Rounded-SM (4px - Sharp Minimal)' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sign-In Experience */}
      {activeTab === 'auth' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Layout className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Login Layout & Experience</h2>
              <p className="text-xs text-slate-500">Configure the authentication screen layout, hero typography, and branding photography.</p>
            </div>
          </div>

          {/* Layout Mode Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800">
              Authentication Page Layout Style
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'split',
                  title: 'Split Hero Image',
                  desc: 'Two-column layout with high-impact hero photography on left and crisp credentials card on right.',
                },
                {
                  id: 'centered_glass',
                  title: 'Centered Glass Card',
                  desc: 'Full-bleed atmospheric background with frosted glass authentication container.',
                },
                {
                  id: 'minimal_card',
                  title: 'Minimalist Clean',
                  desc: 'Focused single-column clean card with high contrast and instant form access.',
                },
              ].map((layout) => {
                const isSelected = authLayout === layout.id;
                return (
                  <div
                    key={layout.id}
                    onClick={() => setAuthLayout(layout.id as any)}
                    className={`p-4.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">{layout.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{layout.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Welcome Headings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
            <Input
              label="Welcome Screen Heading"
              value={welcomeHeading}
              onChange={(e) => setWelcomeHeading(e.target.value)}
              placeholder="Welcome to Your Academy Workspace"
            />

            <Input
              label="Background Image URL (Optional)"
              value={backgroundImageUrl}
              onChange={(e) => setBackgroundImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />

            <div className="md:col-span-2">
              <Input
                label="Welcome Screen Subtitle / Description"
                value={welcomeSubtitle}
                onChange={(e) => setWelcomeSubtitle(e.target.value)}
                placeholder="Enter your account credentials to access your courses, classroom huddles, and student records."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Preloader Screen */}
      {activeTab === 'preloader' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Preloader & Splash Screen</h2>
                <p className="text-xs text-slate-500">Customize the loading screen animated spinner and welcome text shown during application boot.</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsPreviewingPreloader(true);
                setTimeout(() => setIsPreviewingPreloader(false), 2500);
              }}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Live Preloader Preview
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Preloader Text (English)"
              value={preloaderText}
              onChange={(e) => setPreloaderText(e.target.value)}
              placeholder="Loading academy..."
            />

            <Input
              label="Preloader Text (Arabic)"
              value={preloaderTextAr}
              onChange={(e) => setPreloaderTextAr(e.target.value)}
              placeholder="جارٍ تحميل المنصة..."
            />

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={preloaderShowLogo}
                  onChange={(e) => setPreloaderShowLogo(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">Show Brand Logo in Preloader</span>
                  <span className="block text-xs text-slate-500">Renders your uploaded academy logo with smooth pulsing animation.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Live Splash Preview Modal Overlay */}
          {isPreviewingPreloader && (
            <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center backdrop-blur-md">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg animate-pulse">
                  {tenant.name?.slice(0, 2).toUpperCase() || 'AG'}
                </div>
                <p className="text-white font-bold text-lg">{preloaderText}</p>
                <p className="text-emerald-400 font-arabic text-sm">{preloaderTextAr}</p>
                <p className="text-xs text-slate-400">Preview will auto-dismiss in 2 seconds</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Registration Fields */}
      {activeTab === 'fields' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Layers className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Custom Student Registration Fields</h2>
              <p className="text-xs text-slate-500">Collect specific intake details during public student registration (Guardian Name, Prior Memorization, etc.).</p>
            </div>
          </div>

          {/* Current Fields List */}
          <div className="space-y-2.5">
            {customFields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="neutral">{field.type.toUpperCase()}</Badge>
                  <span className="font-bold text-sm text-slate-800">{field.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveField(field.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Field Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="e.g. WhatsApp Emergency Contact"
              className="flex-1"
            />
            <Select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as any)}
              options={[
                { value: 'text', label: 'Text Field' },
                { value: 'select', label: 'Dropdown Select' },
                { value: 'phone', label: 'Phone Number' },
              ]}
              className="sm:w-48"
            />
            <Button variant="outline" onClick={handleAddField} leftIcon={<Plus className="w-4 h-4" />}>
              Add Field
            </Button>
          </div>
        </div>
      )}

      {/* TAB 5: Custom CSS */}
      {activeTab === 'css' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Code className="w-6 h-6 text-slate-700 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Custom CSS Overrides</h2>
              <p className="text-xs text-slate-500">Inject tailored CSS stylesheet rules to override colors, fonts, or component spacing.</p>
            </div>
          </div>

          <textarea
            rows={8}
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder="/* Custom CSS Rules */&#10;.custom-hero-banner { border-radius: 1.5rem; }&#10;.student-badge { text-transform: uppercase; }"
            className="w-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          onClick={handleSaveBranding}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
