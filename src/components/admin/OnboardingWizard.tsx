import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { TenantNiche } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Palette,
  CreditCard,
  Layout,
  Rocket,
  Upload,
  Globe,
  Check
} from 'lucide-react';

interface OnboardingWizardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onComplete: () => void;
}

const TEMPLATES = [
  {
    id: 'emerald-medina',
    name: 'Emerald Medina Classic',
    niche: 'quran',
    desc: 'Authentic Khatam star patterns, Tajweed viewer hero & verse looper.',
    color: '#059669',
    badge: 'Popular for Quran'
  },
  {
    id: 'tech-bootcamp',
    name: 'Modern CodeCraft Bootcamp',
    niche: 'coding',
    desc: 'Terminal hero, Monaco sandbox showcase, and developer syllabus.',
    color: '#2563eb',
    badge: 'Popular for Coding'
  },
  {
    id: 'royal-sanad',
    name: 'Royal Gold Sanad Institute',
    niche: 'quran',
    desc: 'Wax seal Ijazah badges, Arabesque arches, and luxury gold styling.',
    color: '#d97706',
    badge: 'Ijazah & Sanad'
  },
  {
    id: 'horizon-language',
    name: 'Horizon Language Academy',
    niche: 'general',
    desc: 'Modern minimalist layout with interactive course cards & tutor grid.',
    color: '#7c3aed',
    badge: 'General & Languages'
  }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onAddToast, onComplete }) => {
  const { tenant, updateTenantConfig } = useTenant();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Branding
  const [academyName, setAcademyName] = useState<string>(tenant.name || 'Al-Furqan Academy');
  const [tagline, setTagline] = useState<string>(tenant.tagline || 'Empowering Authentic Quran & Arabic Education');
  const [primaryColor, setPrimaryColor] = useState<string>(tenant.theme?.primaryColor || '#059669');

  // Step 2: Niche
  const [selectedNiche, setSelectedNiche] = useState<TenantNiche>(tenant.niche || 'quran');

  // Step 3: Tuition Plan
  const [planPrice, setPlanPrice] = useState<number>(65);
  const [enableStripe, setEnableStripe] = useState<boolean>(true);
  const [enableMoyasar, setEnableMoyasar] = useState<boolean>(true);

  // Step 4: Template
  const [selectedTemplate, setSelectedTemplate] = useState<string>('emerald-medina');

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save & Complete
      updateTenantConfig({
        name: academyName,
        tagline: tagline,
        niche: selectedNiche,
        theme: {
          ...tenant.theme,
          primaryColor: primaryColor,
          primaryHover: primaryColor,
        },
      });

      onAddToast({
        type: 'success',
        title: 'Academy Setup Completed! 🎉',
        message: `${academyName} is now fully configured and live at ${tenant.subdomain}.hifz.app.`,
      });
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden font-sans my-6">
      {/* Wizard Progress Bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/40">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-display">Academy Quick Setup Wizard</h2>
              <p className="text-xs text-slate-400">Step {currentStep} of 5 • Configure your custom brand, curriculum & live domain</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-700">
            {Math.round((currentStep / 5) * 100)}% Completed
          </span>
        </div>

        {/* 5-Step Indicators */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { num: 1, label: 'Branding' },
            { num: 2, label: 'Track' },
            { num: 3, label: 'Tuition' },
            { num: 4, label: 'Template' },
            { num: 5, label: 'Launch' }
          ].map((s) => (
            <div key={s.num} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentStep >= s.num ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-xs' : 'bg-slate-800'
                }`}
              />
              <span className={`text-[10px] font-bold block truncate ${currentStep >= s.num ? 'text-emerald-300' : 'text-slate-500'}`}>
                {s.num}. {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-10 min-h-[380px] flex flex-col justify-between">
        {/* Step 1: Branding & Identity */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-base font-extrabold text-slate-900 font-display">Academy Branding & Visual Identity</h3>
            <p className="text-xs text-slate-500">Set your official academy title, motto tagline, and custom brand theme color.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Academy Official Name</label>
                <input
                  type="text"
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  placeholder="e.g. Al-Furqan Quran Academy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Motto / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  placeholder="e.g. Preserving Sacred Quranic Knowledge"
                />
              </div>
            </div>

            {/* Brand Color Swatches */}
            <div className="pt-3">
              <label className="block text-xs font-bold text-slate-700 mb-2">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                {['#059669', '#1C1B73', '#2563eb', '#d97706', '#dc2626', '#7c3aed'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(c);
                      document.documentElement.style.setProperty('--primary-color', c);
                    }}
                    className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                      primaryColor === c ? 'scale-125 ring-2 ring-emerald-500 ring-offset-2' : 'hover:scale-110 opacity-80'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <span className="text-xs font-mono font-bold text-slate-600 uppercase ml-2">{primaryColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Niche / Track */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-900">Select Academy Specialty</h3>
            <p className="text-xs text-slate-500">Choose the primary track for your curriculum and student workspace.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setSelectedNiche('quran')}
                className={`p-5 rounded-xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                  selectedNiche === 'quran'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Quran & Islamic Academy</h4>
                  <p className="text-xs text-slate-600 mt-1">Uthmani Mushaf, Tajweed rules, recitation player, and audio recorder.</p>
                </div>
                {selectedNiche === 'quran' && (
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" /> Selected
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedNiche('coding')}
                className={`p-5 rounded-xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                  selectedNiche === 'coding'
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Coding & Tech Academy</h4>
                  <p className="text-xs text-slate-600 mt-1">Code editor, live sandbox execution, and code challenges.</p>
                </div>
                {selectedNiche === 'coding' && (
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
                    <CheckCircle2 className="w-4 h-4" /> Selected
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedNiche('general')}
                className={`p-5 rounded-xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                  selectedNiche === 'general'
                    ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Language & General</h4>
                  <p className="text-xs text-slate-600 mt-1">Interactive course modules, live video classes, and PDF assignments.</p>
                </div>
                {selectedNiche === 'general' && (
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-purple-700">
                    <CheckCircle2 className="w-4 h-4" /> Selected
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tuition & Payment */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-900">Tuition Pricing & Payment Collection</h3>
            <p className="text-xs text-slate-500">Configure monthly student tuition rates and select payment providers.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Monthly Tuition Rate</label>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    value={planPrice}
                    onChange={(e) => setPlanPrice(Number(e.target.value))}
                    className="w-32 px-3 py-2 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Standard rate per enrolled student.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-800">Stripe Connect</h5>
                      <p className="text-[10px] text-slate-400">Credit / Debit cards</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableStripe}
                    onChange={(e) => setEnableStripe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-800">Moyasar Gateway</h5>
                      <p className="text-[10px] text-slate-400">Mada, Apple Pay, STC Pay</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableMoyasar}
                    onChange={(e) => setEnableMoyasar(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: GrapesJS Landing Page Template */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-900">Landing Page Layout</h3>
            <p className="text-xs text-slate-500">Select a base layout. You can customize all sections later in the Page Builder.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTemplate === tpl.id
                      ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: tpl.color }}>
                        {tpl.badge}
                      </span>
                      {selectedTemplate === tpl.id && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-2">{tpl.name}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{tpl.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Launch */}
        {currentStep === 5 && (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Ready to Launch {academyName}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your academy is configured with student admissions, live classrooms, and automated tuition billing.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-xs font-mono font-bold text-slate-800">
              https://{tenant.subdomain}.hifz.app
            </div>
          </div>
        )}

        {/* Bottom Wizard Navigation Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{currentStep === 5 ? 'Launch Academy Now 🚀' : 'Continue'}</span>
            {currentStep < 5 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
