import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
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
  Palette
} from 'lucide-react';

interface ModernAcademySettingsProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const PRESET_BRAND_COLORS = [
  '#059669', // Emerald Green (Default)
  '#d97706', // Amber Gold
  '#dc2626', // Crimson Red
  '#2563eb', // Royal Blue
  '#7c3aed', // Vibrant Purple
  '#0f172a', // Slate Dark
  '#1C1B73', // Navy Indigo (from reference UI)
  '#0d9488', // Teal
];

export const ModernAcademySettings: React.FC<ModernAcademySettingsProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig } = useTenant();

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

  // Brand Color State
  const [brandColor, setBrandColor] = useState<string>(tenant.theme?.primaryColor || '#1C1B73');
  const [customHex, setCustomHex] = useState<string>(tenant.theme?.primaryColor || '#1C1B73');
  const [logoUrl, setLogoUrl] = useState<string>(tenant.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState<string>(tenant.faviconUrl || '');

  // Security / Password State
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [active2faMethod, setActive2faMethod] = useState<string | null>('email');

  // Tab navigation within settings (General vs Security)
  const [settingsSection, setSettingsSection] = useState<'general' | 'security'>('general');

  const handleBrandColorChange = (newColor: string) => {
    setBrandColor(newColor);
    setCustomHex(newColor);
    // Apply immediate CSS variable live preview
    document.documentElement.style.setProperty('--primary-color', newColor);
  };

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantConfig({
      name: companyName,
      contactPhone: phoneNumber,
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Home</span>
            <span>&rsaquo;</span>
            <span>Setup</span>
            <span>&rsaquo;</span>
            <span className="text-slate-800 font-semibold capitalize">{settingsSection}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 font-display">
            {settingsSection === 'general' ? 'Company Informations & Branding' : 'Two-Step Authentication & Security'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setSettingsSection('general')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settingsSection === 'general'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Company Info
            </button>
            <button
              onClick={() => setSettingsSection('security')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settingsSection === 'security'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security & 2FA
            </button>
          </div>

          {settingsSection === 'general' && (
            <button
              onClick={handleSaveCompanyInfo}
              className="px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: brandColor }}
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Form Body */}
      {settingsSection === 'general' ? (
        <form onSubmit={handleSaveCompanyInfo} className="p-6 sm:p-8 space-y-6">
          {/* Row 1: Company Name & Company ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                placeholder="Academy Name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Company ID</label>
              <input
                type="text"
                value={companyId}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Row 2: Phone Number & Business Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                placeholder="(480) 555-0103"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Address</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                placeholder="2464 Royal Ln. Mesa"
              />
            </div>
          </div>

          {/* Row 3: City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="Arizona">Arizona</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="New York">New York</option>
                <option value="Makkah">Makkah Region</option>
                <option value="Riyadh">Riyadh Province</option>
                <option value="Dubai">Dubai</option>
                <option value="London">London</option>
              </select>
            </div>
          </div>

          {/* Row 4: Zip & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Zip</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                placeholder="45463"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="United States of America">United States of America</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Egypt">Egypt</option>
                <option value="Malaysia">Malaysia</option>
              </select>
            </div>
          </div>

          {/* Row 5: Timezone & Subdomain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Time Zone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="UTC -5:00 Central">UTC -5:00 Central</option>
                <option value="UTC +3:00 Arabia Standard Time">UTC +3:00 Arabia Standard Time (Makkah)</option>
                <option value="UTC +0:00 London (GMT)">UTC +0:00 London (GMT)</option>
                <option value="UTC -8:00 Pacific">UTC -8:00 Pacific</option>
                <option value="UTC +4:00 Gulf Standard Time">UTC +4:00 Gulf Standard Time (Dubai)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>ⓘ</span> Timezone is updated automatically to match your computer timezone
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subdomain</label>
              <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden bg-white">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                  placeholder="myname"
                />
                <span className="px-3 bg-slate-100 text-slate-500 text-xs font-mono border-l border-slate-200 py-2.5">
                  .hifz.app
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>ⓘ</span> Your subdomain is your account&apos;s unique address (e.g., {subdomain}.hifz.app)
              </p>
            </div>
          </div>

          {/* Business Logo Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Logo</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                <span className="font-bold text-indigo-600 hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>

          {/* Fav Icon Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Fav Icon</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                <span className="font-bold text-indigo-600 hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-400">Square 32x32px or 64x64px ICO/PNG</p>
            </div>
          </div>

          {/* Brand Colour Box (Replicated exactly from reference design) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Brand Colour</label>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              {/* Preset Swatches */}
              <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-4 gap-2.5">
                  {PRESET_BRAND_COLORS.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleBrandColorChange(c)}
                      className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                        brandColor === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : 'hover:scale-110 opacity-90'
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
                        brandColor === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : 'hover:scale-110 opacity-90'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mt-1">
                  <span>More Colours</span>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-blue-500 cursor-pointer" />
                </div>
              </div>

              {/* Custom Colour Hex Input */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Custom Colour:</span>
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
                    className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 text-center uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-slate-300 transition-transform"
                    style={{ backgroundColor: brandColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Security & 2-Step Authentication View (Replicated from reference design 1) */
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Protect Your Account by Enabling Two-Step Authentication
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Choose how you want to receive your authentication codes
            </p>

            <div className="mt-5 space-y-3">
              {/* Option 1: Authenticator App */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Set up using Authenticator App</h4>
                    <p className="text-[11px] text-slate-400">Use an authenticator app (Google Authenticator or Authy) to get authentication code</p>
                  </div>
                </div>
                <button
                  onClick={() => handle2faSetup('authenticator')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Set Up
                </button>
              </div>

              {/* Option 2: Email */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Set up using Email</h4>
                    <p className="text-[11px] text-slate-400">An Email text containing the code will be sent to admin@academy.com</p>
                  </div>
                </div>
                <button
                  onClick={() => handle2faSetup('email')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Set Up
                </button>
              </div>

              {/* Option 3: SMS */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Set up using SMS</h4>
                    <p className="text-[11px] text-slate-400">An SMS text containing the code will be sent to (480) 555-0103</p>
                  </div>
                </div>
                <button
                  onClick={() => handle2faSetup('sms')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Set Up
                </button>
              </div>
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 font-display">Password</h3>
            <div className="mt-4 p-5 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 max-w-sm">
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 pr-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  onAddToast({
                    type: 'success',
                    title: 'Password Updated',
                    message: 'Your account password was securely updated.',
                  })
                }
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
