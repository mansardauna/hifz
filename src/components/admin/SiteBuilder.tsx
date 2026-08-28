import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Palette, Globe, Layout, Mail, Phone, Sparkles, Save, CheckCircle2, RefreshCw } from 'lucide-react';

interface SiteBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const SiteBuilder: React.FC<SiteBuilderProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig, language, direction } = useTenant();
  const [formData, setFormData] = useState({
    name: tenant.name,
    nameAr: tenant.nameAr,
    tagline: tenant.tagline,
    taglineAr: tenant.taglineAr,
    heroBadgeText: tenant.heroBadgeText,
    heroBadgeTextAr: tenant.heroBadgeTextAr,
    aboutText: tenant.aboutText,
    aboutTextAr: tenant.aboutTextAr,
    contactEmail: tenant.contactEmail,
    contactPhone: tenant.contactPhone,
    logoUrl: tenant.logoUrl,
    faviconUrl: tenant.faviconUrl,
    primaryColor: tenant.theme.primaryColor,
    secondaryColor: tenant.theme.secondaryColor,
    accentColor: tenant.theme.accentColor,
  });

  const isAr = language === 'ar';

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantConfig({
      name: formData.name,
      nameAr: formData.nameAr,
      tagline: formData.tagline,
      taglineAr: formData.taglineAr,
      heroBadgeText: formData.heroBadgeText,
      heroBadgeTextAr: formData.heroBadgeTextAr,
      aboutText: formData.aboutText,
      aboutTextAr: formData.aboutTextAr,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      logoUrl: formData.logoUrl,
      faviconUrl: formData.faviconUrl,
      theme: {
        ...tenant.theme,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
      },
    });

    onAddToast({
      type: 'success',
      title: isAr ? 'تم تحديث موقع المعهد بنجاح!' : 'Site Branding Saved!',
      message: isAr ? 'تم تطبيق الألوان والنصوص الجديدة مباشرة على الصفحة الرئيسية' : 'Your live landing page theme and hero copy have been updated.',
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className={`text-2xl font-bold text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
            {isAr ? 'محرر الموقع والتهيئة البصرية' : 'Live Landing Page & Site Builder'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'تعديل شعار المعهد، الألوان، نصوص الهيرو، ومعلومات التواصل مع المعاينة الفورية' : 'Customize your branded academy identity, theme colors, hero copy, and contact details.'}
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isAr ? 'حفظ ونشر التعديلات' : 'Save Live Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branding & Colors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Palette className="w-4 h-4 text-teal-600" />
            <span>{isAr ? 'الهوية البصرية والألوان' : 'Branding & Theme Colors'}</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Color (اللون الرئيسي)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="flex-1 p-2 rounded-lg border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Color (اللون الثانوي)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="flex-1 p-2 rounded-lg border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Logo Image URL</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Favicon Emoji / Icon</label>
            <input
              type="text"
              value={formData.faviconUrl}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-center text-lg"
            />
          </div>
        </div>

        {/* Hero & About Copy Editor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layout className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'محتوى الهيرو والتعريف' : 'Hero & About Section Copy'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academy Name (English)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المعهد (بالعربية)</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => handleChange('nameAr', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-arabic text-base"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Tagline (English)</label>
              <textarea
                rows={2}
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الرئيسي الهيرو (بالعربية)</label>
              <textarea
                rows={2}
                value={formData.taglineAr}
                onChange={(e) => handleChange('taglineAr', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-arabic text-base"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
