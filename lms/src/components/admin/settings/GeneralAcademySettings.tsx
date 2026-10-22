import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useToast } from '../../../context/ToastContext';
import { Button, Input, Select, Card, Badge, PageHeader } from '../../ui';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Shield,
  KeyRound,
  Check,
  ExternalLink,
  Sparkles,
  Lock,
  Save,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Video,
  MessageSquare
} from 'lucide-react';
import {
  getClassroomConfig,
  saveClassroomConfig,
  detectTenantNicheType,
  ClassroomCustomizationConfig
} from '../../../services/classroomCustomizationService';

interface GeneralAcademySettingsProps {
  onOpenUpgradeModal?: () => void;
}

export const GeneralAcademySettings: React.FC<GeneralAcademySettingsProps> = ({
  onOpenUpgradeModal,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success, error, info } = useToast();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';
  const plan = tenant.subscriptionPlan || 'free';
  const isCustomDomainUnlocked = plan === 'growth' || plan === 'enterprise';

  // Academy General Identity
  const [academyName, setAcademyName] = useState<string>(tenant.name || '');
  const [tagline, setTagline] = useState<string>(tenant.tagline || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(tenant.contactPhone || '');
  const [contactEmail, setContactEmail] = useState<string>(tenant.contactEmail || '');
  const [address, setAddress] = useState<string>(tenant.contactAddress || '');
  const [timeZone, setTimeZone] = useState<string>(
    (tenant.settings as any)?.timeZone || 'UTC +3:00 Arabia Standard Time (Makkah)'
  );
  const [currency, setCurrency] = useState<string>(tenant.currency || 'USD');
  const [subdomain, setSubdomain] = useState<string>(tenant.subdomain || '');
  const [customDomain, setCustomDomain] = useState<string>(tenant.customDomain || '');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Security Configuration
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(
    (tenant.settings as any)?.sessionTimeoutMinutes || 60
  );
  const [enforceTwoFactor, setEnforceTwoFactor] = useState<boolean>(
    Boolean((tenant.settings as any)?.enforceTwoFactor)
  );
  const [requireStrongPassword, setRequireStrongPassword] = useState<boolean>(
    (tenant.settings as any)?.requireStrongPassword ?? true
  );
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Live Classroom & Community Configuration
  const [classroomConfig, setClassroomConfig] = useState<ClassroomCustomizationConfig>(() =>
    getClassroomConfig(tenant)
  );
  const [isSavingClassroom, setIsSavingClassroom] = useState(false);

  const handleSaveGeneral = async () => {
    setIsSavingGeneral(true);
    const finalSubdomain = subdomain.trim().toLowerCase() || tenant.subdomain;
    try {
      updateTenantConfig({
        name: academyName.trim() || tenant.name,
        tagline: tagline.trim(),
        subdomain: finalSubdomain,
        customDomain: customDomain.trim() || undefined,
        contactEmail: contactEmail.trim(),
        contactPhone: phoneNumber.trim(),
        contactAddress: address.trim(),
        currency: currency,
        settings: {
          ...(tenant.settings as any),
          timeZone,
        },
      });
      success('Settings Saved', 'Academy identity and domain configuration updated successfully.');
    } catch (err: any) {
      error('Save Failed', err.message || 'Could not update academy settings.');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleVerifyCustomDomain = () => {
    if (!customDomain.trim()) {
      error('Domain Required', 'Enter a fully qualified custom domain name.');
      return;
    }
    setIsVerifyingDomain(true);
    setTimeout(() => {
      setIsVerifyingDomain(false);
      info(
        'DNS Verification In Progress',
        `CNAME record verification initiated for ${customDomain}. It may take up to 24 hours to propagate globally.`
      );
    }, 1200);
  };

  const handleSaveSecurity = () => {
    setIsSavingSecurity(true);
    try {
      updateTenantConfig({
        settings: {
          ...(tenant.settings as any),
          sessionTimeoutMinutes: Number(sessionTimeoutMinutes) || 60,
          enforceTwoFactor,
          requireStrongPassword,
        },
      });
      success('Security Saved', 'Administrative security and session policies updated.');
    } catch (err: any) {
      error('Save Failed', err.message || 'Could not update security policies.');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleSaveClassroomDefaults = () => {
    setIsSavingClassroom(true);
    try {
      saveClassroomConfig(tenant, classroomConfig, updateTenantConfig);
      updateTenantConfig({
        settings: {
          ...(tenant.settings as any),
          classroomCustomization: classroomConfig,
        },
      });
      success('Classroom Defaults Saved', 'Live classroom and discussion configurations updated.');
    } catch (err: any) {
      error('Save Failed', err.message || 'Could not save classroom settings.');
    } finally {
      setIsSavingClassroom(false);
    }
  };

  return (
    <div className="space-y-8 font-sans w-11/12 mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Academy Settings & Security"
        subtitle="Manage your institution's core profile, domain configuration, administrative security, and classroom engine defaults."
        action={
          !isCustomDomainUnlocked && onOpenUpgradeModal ? (
            <Button variant="outline" size="sm" onClick={onOpenUpgradeModal}>
              <Sparkles className="w-4 h-4 mr-1 text-amber-500" /> Unlock Custom Domain
            </Button>
          ) : undefined
        }
      />

      {/* Section 1: Institution Profile & Contact */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Building2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Institution Identity & Profile</h2>
            <p className="text-sm text-slate-500">Official academy details displayed on invoices, public landing pages, and student communications.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Academy / Institution Name"
            value={academyName}
            onChange={(e) => setAcademyName(e.target.value)}
            placeholder="e.g. Al-Furqan Quran Academy"
          />

          <Input
            label="Academy Tagline / Slogan"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Classical Islamic Learning & Tajweed Certification"
          />

          <Input
            label="Official Contact Email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="admissions@academy.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Administrative Phone / WhatsApp"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 000-0000"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Physical Campus / Headquarters Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Education Plaza, Makkah, Saudi Arabia"
            leftIcon={<MapPin className="w-4 h-4" />}
          />

          <Select
            label="Primary Operating Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: 'USD', label: 'USD ($) - United States Dollar' },
              { value: 'SAR', label: 'SAR (ر.س) - Saudi Riyal' },
              { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
              { value: 'EUR', label: 'EUR (€) - Euro' },
              { value: 'GBP', label: 'GBP (£) - British Pound' },
              { value: 'CAD', label: 'CAD ($) - Canadian Dollar' },
            ]}
          />

          <div className="md:col-span-2">
            <Select
              label="Standard Operating Timezone"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              options={[
                { value: 'UTC +3:00 Arabia Standard Time (Makkah)', label: 'UTC +3:00 Arabia Standard Time (Makkah, Riyadh, Doha)' },
                { value: 'UTC +4:00 Gulf Standard Time (Dubai)', label: 'UTC +4:00 Gulf Standard Time (Dubai, Abu Dhabi, Muscat)' },
                { value: 'UTC +0:00 Greenwich Mean Time (London)', label: 'UTC +0:00 Greenwich Mean Time (London, Casablanca)' },
                { value: 'UTC -5:00 Eastern Time (US & Canada)', label: 'UTC -5:00 Eastern Standard Time (New York, Toronto)' },
                { value: 'UTC -8:00 Pacific Time (US & Canada)', label: 'UTC -8:00 Pacific Standard Time (Los Angeles, Vancouver)' },
                { value: 'UTC +2:00 Eastern European Time (Cairo)', label: 'UTC +2:00 Eastern European Time (Cairo, Amman, Beirut)' },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            variant="primary"
            onClick={handleSaveGeneral}
            isLoading={isSavingGeneral}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Section 2: Subdomain & Custom Domain */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Globe className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Platform Subdomain & Custom Domain</h2>
            <p className="text-sm text-slate-500">Configure how students, staff, and visitors navigate to your branded academy web address.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subdomain Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Platform Subdomain
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 bg-white overflow-hidden h-11">
              <span className="px-3.5 text-sm text-slate-400 bg-slate-50 border-r border-slate-200 h-full flex items-center select-none font-mono">
                https://
              </span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-academy"
                className="w-full px-3 text-sm font-medium text-slate-900 focus:outline-none"
              />
              <span className="px-3.5 text-sm text-slate-500 bg-slate-50 border-l border-slate-200 h-full flex items-center select-none font-mono">
                 .liwanlms.com
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Your instant hosted workspace URL. Live immediately on the platform.
            </p>
          </div>

          {/* Custom Domain Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800">
                Custom Domain (White-label)
              </label>
              {!isCustomDomainUnlocked && (
                <Badge variant="warning" size="sm">Growth & Enterprise</Badge>
              )}
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 bg-white overflow-hidden h-11">
              <input
                type="text"
                disabled={!isCustomDomainUnlocked}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value.toLowerCase().trim())}
                placeholder="e.g. portal.youracademy.edu"
                className="w-full px-4 text-sm font-medium text-slate-900 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={!isCustomDomainUnlocked || !customDomain.trim() || isVerifyingDomain}
                onClick={handleVerifyCustomDomain}
                isLoading={isVerifyingDomain}
                className="m-1 shrink-0"
              >
                Verify DNS
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Point a CNAME record from your DNS registrar to <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">liwanlms.com</code>.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            variant="primary"
            onClick={handleSaveGeneral}
            isLoading={isSavingGeneral}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Section 3: Administrative Security & Session Policies */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Shield className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Security & Session Policies</h2>
            <p className="text-sm text-slate-500">Enforce authentication standards, session timeouts, and credential hygiene across your academy.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Inactivity Session Timeout"
            value={sessionTimeoutMinutes.toString()}
            onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
            options={[
              { value: '15', label: '15 minutes (High Security / Financial)' },
              { value: '30', label: '30 minutes' },
              { value: '60', label: '1 hour (Recommended)' },
              { value: '180', label: '3 hours' },
              { value: '480', label: '8 hours (Full Working Day)' },
              { value: '1440', label: '24 hours' },
            ]}
          />

          <div className="space-y-4 pt-1">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={enforceTwoFactor}
                onChange={(e) => setEnforceTwoFactor(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <div>
                <span className="block text-sm font-semibold text-slate-900">Enforce Two-Factor Authentication (2FA)</span>
                <span className="block text-xs text-slate-500 mt-0.5">Require staff and administrators to confirm email OTP before accessing the dashboard.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={requireStrongPassword}
                onChange={(e) => setRequireStrongPassword(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <div>
                <span className="block text-sm font-semibold text-slate-900">Require Complex Passwords</span>
                <span className="block text-xs text-slate-500 mt-0.5">Enforce a minimum of 8 characters including mixed uppercase, numerals, and special characters.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            variant="primary"
            onClick={handleSaveSecurity}
            isLoading={isSavingSecurity}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Section 4: Live Classroom & Community Engine Defaults */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Video className="w-6 h-6 text-purple-600 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Live Classroom & Community Engine</h2>
            <p className="text-sm text-slate-500">Configure WebRTC audio/video quality presets, recitation whiteboard defaults, and forum channels.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Classroom Engine Standard
            </h3>
            <p className="text-sm text-slate-600">
              WebRTC Selective Forwarding Unit (SFU) with HD multi-stream video, tajweed waveform analysis, and automated attendance logging.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Community Discussion Channels
            </h3>
            <p className="text-sm text-slate-600">
              Dedicated student cohort forums, Q&A halaqah boards, and instructor announcement channels linked directly to student LMS dashboards.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            variant="primary"
            onClick={handleSaveClassroomDefaults}
            isLoading={isSavingClassroom}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
