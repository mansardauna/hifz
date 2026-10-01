import React, { useState } from 'react';
import { FormConfig, FormFieldConfig, FormUiTheme } from '../../types';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Calendar,
  Sparkles,
  Layers,
  Check,
  FileText,
  Star,
  ShieldCheck
} from 'lucide-react';

interface ThemedFormRendererProps {
  form: FormConfig;
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  isSubmitting?: boolean;
  previewMode?: boolean;
  isSubmitted?: boolean;
  onResetSubmitted?: () => void;
  language?: 'en' | 'ar';
}

export const THEME_COLOR_MAP: Record<string, { primary: string; hover: string; ring: string; lightBg: string; text: string; gradient: string }> = {
  emerald: {
    primary: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
    ring: 'focus:ring-emerald-500 focus:border-emerald-600',
    lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    text: 'text-emerald-600',
    gradient: 'from-emerald-600 to-teal-700',
  },
  blue: {
    primary: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    ring: 'focus:ring-blue-500 focus:border-blue-600',
    lightBg: 'bg-blue-50 text-blue-800 border-blue-200',
    text: 'text-blue-600',
    gradient: 'from-blue-600 to-indigo-700',
  },
  purple: {
    primary: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    ring: 'focus:ring-purple-500 focus:border-purple-600',
    lightBg: 'bg-purple-50 text-purple-800 border-purple-200',
    text: 'text-purple-600',
    gradient: 'from-purple-600 to-violet-800',
  },
  amber: {
    primary: 'bg-amber-600',
    hover: 'hover:bg-amber-700',
    ring: 'focus:ring-amber-500 focus:border-amber-600',
    lightBg: 'bg-amber-50 text-amber-900 border-amber-200',
    text: 'text-amber-600',
    gradient: 'from-amber-600 to-orange-700',
  },
  rose: {
    primary: 'bg-rose-600',
    hover: 'hover:bg-rose-700',
    ring: 'focus:ring-rose-500 focus:border-rose-600',
    lightBg: 'bg-rose-50 text-rose-800 border-rose-200',
    text: 'text-rose-600',
    gradient: 'from-rose-600 to-pink-700',
  },
  slate: {
    primary: 'bg-slate-900',
    hover: 'hover:bg-slate-800',
    ring: 'focus:ring-slate-500 focus:border-slate-900',
    lightBg: 'bg-slate-100 text-slate-900 border-slate-300',
    text: 'text-slate-900',
    gradient: 'from-slate-800 to-slate-950',
  },
};

export const ThemedFormRenderer: React.FC<ThemedFormRendererProps> = ({
  form,
  onSubmit,
  isSubmitting = false,
  previewMode = false,
  isSubmitted = false,
  onResetSubmitted,
  language = 'en',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localSubmitted, setLocalSubmitted] = useState(false);

  const isAr = language === 'ar';
  const themeStyle: FormUiTheme = form.themeStyle || 'material';
  const accentKey = form.accentColor && THEME_COLOR_MAP[form.accentColor] ? form.accentColor : 'emerald';
  const colorTheme = THEME_COLOR_MAP[accentKey];

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    (form.fields || []).forEach((field) => {
      if (field.required) {
        const val = formData[field.id];
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.id] = isAr ? 'هذا الحقل مطلوب' : 'This field is required';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors[field.id] = isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.acceptingResponses === false) {
      alert(isAr ? 'عذراً، هذا النموذج لا يستقبل ردوداً جديدة حالياً.' : 'Sorry, this form is currently closed for new submissions.');
      return;
    }

    if (!validateForm()) return;

    if (onSubmit) {
      onSubmit(formData);
    } else {
      setLocalSubmitted(true);
    }
  };

  const showSuccessState = isSubmitted || localSubmitted;

  if (showSuccessState) {
    return (
      <div className={`p-8 sm:p-12 text-center space-y-5 rounded-3xl animate-in fade-in zoom-in duration-300 ${
        themeStyle === 'cyber_dark' ? 'bg-slate-950 text-white border border-slate-800' :
        themeStyle === 'glassmorphism' ? 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl' :
        themeStyle === 'islamic_heritage' ? 'bg-amber-50/60 border-2 border-emerald-600/30' :
        'bg-white border border-slate-200 shadow-xl'
      }`}>
        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
          themeStyle === 'cyber_dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
          themeStyle === 'islamic_heritage' ? 'bg-emerald-700 text-amber-200' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black">{isAr ? 'تم استلام طلبك بنجاح!' : 'Application Submitted Successfully!'}</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {form.customSuccessMessage || (isAr
            ? 'شكراً لتواصلك معنا. سيقوم فريق القبول بمراجعة بياناتك والتواصل معك قريباً.'
            : 'Thank you for your submission. Our academic admissions committee will review your application and contact you promptly.')}
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setLocalSubmitted(false);
              setFormData({});
              if (onResetSubmitted) onResetSubmitted();
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {isAr ? 'إرسال رد آخر' : 'Submit Another Response'}
          </button>
        </div>
      </div>
    );
  }

  // Render Theme Styles
  return (
    <div
      className={`relative transition-all duration-300 ${
        themeStyle === 'material'
          ? 'bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden'
          : themeStyle === 'glassmorphism'
          ? 'bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-6 sm:p-10'
          : themeStyle === 'minimalist'
          ? 'bg-white rounded-2xl border-2 border-slate-900 shadow-none p-6 sm:p-10 font-mono'
          : themeStyle === 'islamic_heritage'
          ? 'bg-amber-50/40 rounded-3xl border-2 border-emerald-700/40 shadow-xl overflow-hidden p-6 sm:p-10 relative'
          : /* cyber_dark */
            'bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10'
      }`}
    >
      {/* 1. Material UI Style Top Accent Header Strip */}
      {themeStyle === 'material' && (
        <div className={`h-3 w-full ${colorTheme.primary}`} />
      )}

      {/* 2. Islamic Heritage Ornamental Top Header */}
      {themeStyle === 'islamic_heritage' && (
        <div className="text-center pb-6 border-b border-amber-200/80 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</span>
          </div>
        </div>
      )}

      {/* Form Header */}
      <div className={`${themeStyle === 'material' ? 'p-6 sm:p-10 pb-0 sm:pb-0' : 'mb-8'} space-y-2`}>
        {form.headerBannerUrl && (
          <div className="h-36 w-full rounded-2xl overflow-hidden mb-6 shadow-sm">
            <img src={form.headerBannerUrl} alt="Form Header Banner" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
            themeStyle === 'cyber_dark' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
            themeStyle === 'minimalist' ? 'bg-black text-white' :
            colorTheme.lightBg
          }`}>
            {themeStyle === 'material' ? 'Material Form' :
             themeStyle === 'glassmorphism' ? 'Neo-Glass Form' :
             themeStyle === 'minimalist' ? 'Clean Minimal' :
             themeStyle === 'islamic_heritage' ? 'Madrasah Portal' : 'Cyber Studio'}
          </span>

          {form.acceptingResponses === false && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Closed
            </span>
          )}
        </div>

        <h2 className={`text-2xl sm:text-3xl font-black ${
          themeStyle === 'cyber_dark' ? 'text-white' : 'text-slate-900'
        } ${isAr ? 'font-arabic text-3xl' : ''}`}>
          {isAr ? form.titleAr || form.title : form.title}
        </h2>

        {form.description && (
          <p className={`text-xs sm:text-sm leading-relaxed ${
            themeStyle === 'cyber_dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {isAr ? form.descriptionAr || form.description : form.description}
          </p>
        )}
      </div>

      {/* Form Fields Body */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`${themeStyle === 'material' ? 'p-6 sm:p-10 space-y-5' : 'space-y-5'} mt-6`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {(form.fields || []).map((field: FormFieldConfig) => {
            const hasError = Boolean(errors[field.id]);
            const colSpanClass = field.width === 'full' ? 'sm:col-span-2' : 'sm:col-span-1';

            return (
              <div key={field.id} className={`${colSpanClass} space-y-1.5`}>
                <label
                  htmlFor={field.id}
                  className={`block text-xs font-bold ${
                    themeStyle === 'cyber_dark' ? 'text-slate-300 font-mono' :
                    themeStyle === 'minimalist' ? 'text-black uppercase tracking-wider text-[11px]' :
                    themeStyle === 'islamic_heritage' ? 'text-emerald-950' :
                    'text-slate-700'
                  }`}
                >
                  {isAr ? field.labelAr || field.label : field.label}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </label>

                {/* Field Type: Dropdown Select */}
                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={`w-full px-4 py-3 text-xs sm:text-sm transition-all focus:outline-none ${
                      themeStyle === 'cyber_dark'
                        ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                        : themeStyle === 'glassmorphism'
                        ? 'bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/30'
                        : themeStyle === 'minimalist'
                        ? 'bg-white border-2 border-slate-900 rounded-none text-slate-900 focus:bg-slate-50'
                        : themeStyle === 'islamic_heritage'
                        ? 'bg-amber-50/70 border border-amber-300 rounded-xl text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                        : /* Material */
                          `bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                            hasError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-300'
                          } rounded-xl text-slate-900 ${colorTheme.ring}`
                    }`}
                  >
                    <option value="">{isAr ? '-- اختر الإجابة --' : 'Select an option...'}</option>
                    {(field.options || []).map((opt, optIdx) => (
                      <option key={optIdx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    rows={3}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    className={`w-full px-4 py-3 text-xs sm:text-sm transition-all focus:outline-none ${
                      themeStyle === 'cyber_dark'
                        ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                        : themeStyle === 'glassmorphism'
                        ? 'bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/30'
                        : themeStyle === 'minimalist'
                        ? 'bg-white border-2 border-slate-900 rounded-none text-slate-900 focus:bg-slate-50'
                        : themeStyle === 'islamic_heritage'
                        ? 'bg-amber-50/70 border border-amber-300 rounded-xl text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                        : /* Material */
                          `bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                            hasError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-300'
                          } rounded-xl text-slate-900 ${colorTheme.ring}`
                    }`}
                  />
                ) : field.type === 'file' ? (
                  <div
                    className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                      themeStyle === 'cyber_dark'
                        ? 'border-slate-800 bg-slate-900/50 hover:border-cyan-500 text-slate-400'
                        : themeStyle === 'minimalist'
                        ? 'border-slate-900 bg-slate-50 text-black'
                        : 'border-slate-300 bg-slate-50/70 hover:border-emerald-500 text-slate-600'
                    }`}
                  >
                    <UploadCloud className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                    <span className="text-xs font-bold block">
                      {isAr ? 'اضغط لرفع ملف أو تسجيل صوتي' : 'Click or drop file to attach'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, Audio, MP3, PNG (Max 15MB)</span>
                  </div>
                ) : (
                  <input
                    id={field.id}
                    type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'date' ? 'date' : 'text'}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder || ''}
                    className={`w-full px-4 py-3 text-xs sm:text-sm transition-all focus:outline-none ${
                      themeStyle === 'cyber_dark'
                        ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 font-mono'
                        : themeStyle === 'glassmorphism'
                        ? 'bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/30'
                        : themeStyle === 'minimalist'
                        ? 'bg-white border-2 border-slate-900 rounded-none text-slate-900 focus:bg-slate-50'
                        : themeStyle === 'islamic_heritage'
                        ? 'bg-amber-50/70 border border-amber-300 rounded-xl text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                        : /* Material */
                          `bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                            hasError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-300'
                          } rounded-xl text-slate-900 ${colorTheme.ring}`
                    }`}
                  />
                )}

                {hasError && (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[field.id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || form.acceptingResponses === false}
            className={`w-full py-4 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              themeStyle === 'cyber_dark'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-950 rounded-xl font-mono shadow-lg shadow-cyan-500/20'
                : themeStyle === 'glassmorphism'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white rounded-2xl shadow-xl shadow-teal-600/30'
                : themeStyle === 'minimalist'
                ? 'bg-black hover:bg-slate-800 text-white rounded-none border-2 border-black tracking-wider uppercase'
                : themeStyle === 'islamic_heritage'
                ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-amber-100 rounded-2xl shadow-md border border-amber-300/40'
                : /* Material */
                  `${colorTheme.primary} ${colorTheme.hover} text-white rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98]`
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmitting
                ? isAr
                  ? 'جاري الإرسال...'
                  : 'Submitting Application...'
                : isAr
                ? form.submitButtonTextAr || form.submitButtonText || 'إرسال الطلب'
                : form.submitButtonText || 'Submit Application'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
