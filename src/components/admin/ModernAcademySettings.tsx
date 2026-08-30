import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Button, Input, Card, Badge } from '../ui';
import { LockedFeatureCard } from './LockedFeatureCard';
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
  ShieldCheck
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

  // Company Information State
  const [companyName, setCompanyName] = useState<string>(tenant.name || 'Zarah Academy');
  const [companyId, setCompanyId] = useState<string>(tenant.id || 'ACAD-2F2467890');
  const [phoneNumber, setPhoneNumber] = useState<string>(tenant.contactPhone || '(480) 555-0103');
  const [businessAddress, setBusinessAddress] = useState<string>('2464 Royal Ln. Mesa');
  const [city, setCity] = useState<string>('Mesa');
  const [state, setState] = useState<string>('Arizona');
  const [zip, setZip] = useState<string>('45463');
  const [country, setCountry] = useState<string>('United States of America');
  const [timeZone, setTimeZone] = useState<string>('UTC -5:00 Central');
  const [subdomain, setSubdomain] = useState<string>(tenant.subdomain || 'zarah');
  const [customDomain, setCustomDomain] = useState<string>(tenant.customDomain || '');

  // Brand Color State
  const [brandColor, setBrandColor] = useState<string>(tenant.theme?.primaryColor || '#059669');
  const [customHex, setCustomHex] = useState<string>(tenant.theme?.primaryColor || '#059669');

  // Security / Password State
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [active2faMethod, setActive2faMethod] = useState<string | null>('email');

  // Tab navigation within settings (General vs Security)
  const [settingsSection, setSettingsSection] = useState<'general' | 'security'>('general');

  const handleBrandColorChange = (newColor: string) => {
    setBrandColor(newColor);
    setCustomHex(newColor);
    document.documentElement.style.setProperty('--primary-color', newColor);
  };

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantConfig({
      name: companyName,
      contactPhone: phoneNumber,
      subdomain,
      customDomain: isCustomDomainUnlocked ? customDomain : undefined,
      theme: {
        ...tenant.theme,
        primaryColor: brandColor,
        primaryHover: brandColor,
      },
    });

    onAddToast({
      type: 'success',
      title: 'Settings Saved Successfully',
      message: 'Academy details and brand colors have been updated across your live domain.',
    });
  };

  const handle2faSetup = (method: string) => {
    setActive2faMethod(method);
    onAddToast({
      type: 'success',
      title: '2-Step Authentication Configured',
      message: `Verification code will now be sent via ${method.toUpperCase()}.`,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Dashboard</span>
            <span>&rsaquo;</span>
            <span>Academy Settings</span>
            <span>&rsaquo;</span>
            <span className="text-slate-800 font-semibold capitalize">{settingsSection}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {settingsSection === 'general' ? 'Academy Profile, Domain & Branding' : 'Authentication & Account Security'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSettingsSection('general')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                settingsSection === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General & Domain
            </button>
            <button
              type="button"
              onClick={() => setSettingsSection('security')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                settingsSection === 'security' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security & 2FA
            </button>
          </div>
        </div>
      </div>

      {settingsSection === 'general' ? (
        <form onSubmit={handleSaveCompanyInfo} className="p-6 sm:p-8 space-y-6">
          {/* Row 1: Academy Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Academy Name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Al-Furqan Quran Academy"
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <Input
              label="Account ID"
              type="text"
              disabled
              value={companyId}
              helperText="Managed by platform multi-tenant registry"
            />
          </div>

          {/* Row 2: Phone Number & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Contact Phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Campus Address"
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>

          {/* Row 3: City, State, Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="State / Province" value={state} onChange={(e) => setState(e.target.value)} />
            <Input label="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>

          {/* Row 4: Subdomain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Free Platform Subdomain</label>
              <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden bg-white">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                  placeholder="myname"
                />
                <span className="px-3 bg-slate-100 text-slate-500 text-xs font-mono border-l border-slate-200 py-2">
                  .hifz.app
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="UTC -5:00 Central">UTC -5:00 Central</option>
                <option value="UTC +3:00 Arabia Standard Time">UTC +3:00 Arabia Standard Time (Makkah)</option>
                <option value="UTC +0:00 London (GMT)">UTC +0:00 London (GMT)</option>
                <option value="UTC -8:00 Pacific">UTC -8:00 Pacific</option>
                <option value="UTC +4:00 Gulf Standard Time">UTC +4:00 Gulf Standard Time (Dubai)</option>
              </select>
            </div>
          </div>

          {/* Custom Domain Section (Gated on Free / Qari Tiers) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">Custom Domain Mapping (SSL)</label>
            {isCustomDomainUnlocked ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Input
                    label="Primary Domain"
                    placeholder="e.g. quranacademy.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1"
                    leftIcon={<Globe className="w-4 h-4" />}
                  />
                  <div className="sm:pt-5">
                    <Badge variant="success">SSL Active & Secured</Badge>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Point your DNS CNAME record to <code className="font-mono text-slate-800 bg-slate-200/80 px-1 py-0.5 rounded">cname.vercel-dns.com</code>. SSL certificates are provisioned automatically.
                </p>
              </div>
            ) : (
              <LockedFeatureCard
                title="Custom Domain & Wildcard SSL Mapping"
                description="Connect your own custom domain (e.g. academy.com) with automated Cloudflare SSL certificates. Requires Growth or Enterprise plan."
                requiredPlan="growth"
                onUpgrade={() => onOpenUpgradeModal?.()}
              />
            )}
          </div>

          {/* Brand Colour Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Theme Brand Colour</label>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-4 gap-2.5">
                  {PRESET_BRAND_COLORS.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleBrandColorChange(c)}
                      className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                        brandColor === c ? 'scale-125 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110 opacity-90'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {PRESET_BRAND_COLORS.slice(4, 8).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleBrandColorChange(c)}
                      className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                        brandColor === c ? 'scale-125 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110 opacity-90'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Hex Code:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        handleBrandColorChange(e.target.value);
                      }
                    }}
                    className="w-24 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 text-center uppercase focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <div
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-300"
                    style={{ backgroundColor: brandColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary">
              Save Academy Changes
            </Button>
          </div>
        </form>
      ) : (
        /* Security & 2FA View */
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Two-Step Authentication Security
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure administrative access with multi-factor authentication methods.
            </p>

            <div className="mt-4 space-y-3">
              {/* Option 1: Authenticator App */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Authenticator App</h4>
                    <p className="text-[11px] text-slate-400">Use Google Authenticator or Authy for 6-digit TOTP codes</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handle2faSetup('authenticator')}
                >
                  Set Up
                </Button>
              </div>

              {/* Option 2: Email */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Email Verification</h4>
                    <p className="text-[11px] text-slate-400">Verification OTP codes sent to administrator email</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handle2faSetup('email')}
                >
                  Set Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
