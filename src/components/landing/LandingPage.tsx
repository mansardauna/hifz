import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { Header } from './Header';
import { api } from '../../services/api';
import { ToastMessage } from '../ui/Toast';
import { StudentEnrollmentModal } from '../checkout/StudentEnrollmentModal';
import { PricingPlan } from '../../types';
import {
  Clock,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Send,
  Check,
  ShieldCheck,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAddToast }) => {
  const { tenant, courses, language, direction } = useTenant();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [selectedPlanForEnroll, setSelectedPlanForEnroll] = useState<PricingPlan | null>(null);

  const isAr = language === 'ar';

  // Attach global DOM listeners for custom GrapesJS HTML forms and enrollment triggers
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const enrollBtn = target.closest('[data-hifz-enroll="true"]') || target.closest('a[href="#enroll"]') || target.closest('a[href="#pricing"]');
      if (enrollBtn && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
        const planId = enrollBtn.getAttribute('data-plan-id');
        const matchedPlan = tenant.pricingPlans.find((p) => p.id === planId) || tenant.pricingPlans[0];
        setSelectedPlanForEnroll(matchedPlan);
        setIsEnrollModalOpen(true);
      }
    };

    const handleFormSubmit = async (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form.getAttribute('data-hifz-lead-form') === 'true') {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get('name') as string) || '';
        const email = (data.get('email') as string) || '';
        const phone = (data.get('phone') as string) || '';
        const courseInterest = (data.get('courseInterest') as string) || 'Quran Memorization (Hifz)';

        if (!name || !email) {
          onAddToast({ type: 'error', title: 'Missing Info', message: 'Name and email are required.' });
          return;
        }

        try {
          await api.createLead({
            name,
            email,
            phone,
            country: 'Global Inquiry',
            courseInterest,
            preferredSchedule: 'Flexible',
            priorHifzLevel: '1 - 5 Juz',
            status: 'New',
            paymentStatus: 'Pending',
            notes: 'Submitted via GrapesJS Landing Page Lead Form',
          });

          onAddToast({
            type: 'success',
            title: 'Admissions Inquiry Submitted!',
            message: `Jazakallahu Khairan, ${name}. Our admissions committee will reach out shortly.`,
          });
          form.reset();
        } catch (err) {
          onAddToast({ type: 'error', title: 'Submission Error', message: 'Failed to submit inquiry.' });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('submit', handleFormSubmit);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, [tenant.pricingPlans, onAddToast]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName?.trim()) {
      newErrors.studentName = isAr ? 'الرجاء إدخال اسم الطالب الكامل' : 'Student full name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = isAr ? 'الرجاء إدخال البريد الإلكتروني' : 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isAr ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = isAr ? 'الرجاء إدخال رقم الهاتف' : 'Phone number is required';
    }

    (tenant.customFormFields || []).forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = isAr ? `حقل ${field.labelAr} مطلوب` : `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.createLead({
        name: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country || 'Global',
        courseInterest: formData.courseInterest || 'Quran Memorization (Hifz)',
        preferredSchedule: formData.preferredSchedule || 'Evening',
        priorHifzLevel: formData.priorHifzLevel || '1 - 5 Juz',
        status: 'New',
        paymentStatus: 'Pending',
        notes: `Custom Inquiries: ${JSON.stringify(formData)}`,
      });

      onAddToast({
        type: 'success',
        title: isAr ? 'تم تقديم الطلب بنجاح!' : 'Inquiry Submitted!',
        message: isAr
          ? 'شكراً لتواصلك، سيتواصل معك فريق القبول قريباً.'
          : 'Thank you. Our admissions coordinator will contact you shortly.',
      });
      setFormData({});
    } catch (err) {
      onAddToast({
        type: 'error',
        title: isAr ? 'خطأ في التقديم' : 'Submission Error',
        message: 'Failed to connect to server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEnrollModalWithPlan = (plan: PricingPlan) => {
    setSelectedPlanForEnroll(plan);
    setIsEnrollModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir={direction}>
      {/* Header */}
      <Header />

      {/* If Tenant has customized and published via GrapesJS, render the live GrapesJS HTML */}
      {tenant.customHtml ? (
        <div>
          {tenant.customCss && <style>{tenant.customCss}</style>}
          <div dangerouslySetInnerHTML={{ __html: tenant.customHtml }} />
        </div>
      ) : (
        <>
          {/* Default Dynamic Live Sections */}
          <section className="bg-white py-20 lg:py-28 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <span className="inline-block px-3.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
                  {isAr ? tenant.heroBadgeTextAr : tenant.heroBadgeText}
                </span>

                <h1 className={`text-4xl sm:text-6xl font-bold font-display text-slate-900 leading-tight ${isAr ? 'font-arabic text-5xl sm:text-7xl' : ''}`}>
                  {isAr ? tenant.taglineAr : tenant.tagline}
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                  {isAr ? tenant.aboutTextAr : tenant.aboutText}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                      setIsEnrollModalOpen(true);
                    }}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display text-sm rounded-md shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? 'تقديم طلب الالتحاق' : 'Enroll & Pay Tuition'}</span>
                  </button>

                  <a
                    href="#admissions"
                    className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold font-display text-sm rounded-md shadow-sm transition-all"
                  >
                    {isAr ? 'استفسار القبول' : 'Admissions Inquiry'}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Quran Calligraphy Ayah Banner */}
          <section className="py-14 bg-slate-900 text-white text-center border-b border-slate-800">
            <div className="max-w-4xl mx-auto px-4">
              <p className="font-arabic text-4xl font-bold leading-relaxed mb-2">
                إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
              </p>
              <p className="text-sm text-slate-400 font-sans tracking-wide">
                "Indeed, it is We who sent down the Quran and indeed, We will be its guardian." — Surah Al-Hijr [15:9]
              </p>
            </div>
          </section>

          {/* Featured Courses Grid */}
          <section id="courses" className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className={`text-3xl sm:text-4xl font-bold font-display text-slate-900 ${isAr ? 'font-arabic text-4xl' : ''}`}>
                  {isAr ? 'المناهج والدورات القرآنية المتاحة' : 'Featured Quranic Curriculums'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Structured tracks engineered for progressive mastery, memorization, and Tajweed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-md border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-48 bg-slate-900">
                      <img src={course.imageUrl || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800'} alt={course.title} className="w-full h-full object-cover opacity-80" />
                      <span className="absolute top-3 right-3 bg-white text-slate-900 font-bold text-xs px-3 py-1 rounded-md shadow-sm">
                        {course.level}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.durationWeeks} Weeks</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrolledStudentsCount} Students</span>
                        </div>

                        <h3 className={`text-xl font-bold font-display text-slate-900 mb-2 ${isAr ? 'font-arabic text-2xl' : ''}`}>
                          {isAr ? course.titleAr : course.title}
                        </h3>

                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                          {isAr ? course.descriptionAr : course.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">{isAr ? 'الرسوم الشهرية' : 'Monthly Tuition'}</span>
                          <span className="text-2xl font-extrabold font-display text-emerald-700">${course.price}</span>
                        </div>

                        <button
                          onClick={() => {
                            const matchedPlan = tenant.pricingPlans.find((p) => p.priceMonthly === course.price) || tenant.pricingPlans[0];
                            openEnrollModalWithPlan(matchedPlan);
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display text-xs rounded-md shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isAr ? 'التسجيل والدفع' : 'Enroll Now'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing & Tuition Plans */}
          <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold font-display text-emerald-700 uppercase tracking-widest block">
                  {isAr ? 'الرسوم الدراسية' : 'TUITION PLANS'}
                </span>
                <h2 className={`text-3xl sm:text-4xl font-bold font-display text-slate-900 mt-1 ${isAr ? 'font-arabic text-4xl' : ''}`}>
                  {isAr ? 'خطط الاشتراك والرسوم الشهرية' : 'Tuition & Subscription Plans'}
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Transparent tuition billing directly processed by {tenant.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {tenant.pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-md border p-8 flex flex-col justify-between shadow-md transition-all ${
                      plan.popular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      {plan.popular && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider rounded-md mb-4 inline-block">
                          {isAr ? 'الأكثر طلباً' : 'Most Popular'}
                        </span>
                      )}

                      <h3 className={`text-xl font-bold font-display text-slate-900 ${isAr ? 'font-arabic text-2xl' : ''}`}>
                        {isAr ? plan.nameAr : plan.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2 min-h-[36px]">
                        {isAr ? plan.descriptionAr : plan.description}
                      </p>

                      <div className="my-6 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold font-display text-slate-900 font-mono">
                          ${plan.priceMonthly}
                        </span>
                        <span className="text-xs text-slate-400">/month</span>
                      </div>

                      <div className="w-full h-px bg-slate-100 mb-6" />

                      <ul className="space-y-3 text-xs text-slate-600">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => openEnrollModalWithPlan(plan)}
                      className={`mt-8 w-full py-3.5 font-bold font-display text-xs rounded-md shadow-md transition-all uppercase tracking-wider cursor-pointer ${
                        plan.popular
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isAr ? 'التسجيل في هذه الخطة' : 'Enroll & Pay Tuition'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Direct Admissions Inquiry Lead Form (Configured by Form Builder) */}
          <section id="admissions" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-50 p-8 sm:p-12 rounded-md border border-slate-200 shadow-md">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold font-display text-emerald-700 uppercase tracking-widest block">
                    {isAr ? 'طلب استفسار' : 'ADMISSIONS INQUIRY'}
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1 ${isAr ? 'font-arabic text-3xl' : ''}`}>
                    {tenant.formTitle || (isAr ? 'نموذج طلب الالتحاق والاستفسار' : 'Direct Admissions & Evaluation Inquiry')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">
                    {tenant.formDescription || (isAr ? 'قم بتعبئة بياناتك وسيتواصل معك فريق القبول لتحديد موعد اختبار المستوى.' : 'Submit your contact information for an immediate evaluation by our admissions team.')}
                  </p>
                </div>

                <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
                  {/* Standard Inquiry Fields */}
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/2 px-2 mb-4">
                      <label className="block font-bold text-slate-700 mb-1">
                        {isAr ? 'اسم الطالب الكامل *' : 'Student Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={formData.studentName || ''}
                        onChange={(e) => handleInputChange('studentName', e.target.value)}
                        placeholder="e.g. Mariam Mansoor"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                      {errors.studentName && <p className="text-rose-600 text-[11px] mt-1">{errors.studentName}</p>}
                    </div>

                    <div className="w-full sm:w-1/2 px-2 mb-4">
                      <label className="block font-bold text-slate-700 mb-1">
                        {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="student@example.com"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                      {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
                    </div>

                    <div className="w-full sm:w-1/2 px-2 mb-4">
                      <label className="block font-bold text-slate-700 mb-1">
                        {isAr ? 'رقم الهاتف / الواتساب *' : 'WhatsApp / Phone *'}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+966 50 123 4567"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                      {errors.phone && <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>}
                    </div>

                    <div className="w-full sm:w-1/2 px-2 mb-4">
                      <label className="block font-bold text-slate-700 mb-1">
                        {isAr ? 'المسار الدراسي المطلوب' : 'Course Interest'}
                      </label>
                      <select
                        value={formData.courseInterest || ''}
                        onChange={(e) => handleInputChange('courseInterest', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500"
                      >
                        <option>Quran Memorization (Hifz)</option>
                        <option>Tajweed & Makharij Rules</option>
                        <option>Classical Arabic Grammar</option>
                        <option>Sanad Ijazah Certification</option>
                      </select>
                    </div>

                    {/* Custom Fields Configured in Form Builder with Flex Layout */}
                    {(tenant.customFormFields || []).map((field) => {
                      const widthClass =
                        field.width === 'third'
                          ? 'w-full sm:w-1/3 px-2 mb-4'
                          : field.width === 'half'
                          ? 'w-full sm:w-1/2 px-2 mb-4'
                          : 'w-full px-2 mb-4';

                      return (
                        <div key={field.id} className={widthClass}>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isAr ? field.labelAr : field.label} {field.required && <span className="text-rose-500">*</span>}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full p-2.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="">{isAr ? 'اختر الإجابة...' : 'Select option...'}</option>
                              {(field.options || []).map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full p-2.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500"
                            />
                          ) : (
                            <input
                              type={field.type}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full p-2.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500"
                            />
                          )}
                          {errors[field.id] && <p className="text-rose-600 text-[11px] mt-1">{errors[field.id]}</p>}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-display text-xs uppercase tracking-wider rounded-md shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : isAr ? 'إرسال طلب الاستفسار' : 'Submit Admissions Inquiry'}</span>
                  </button>
                </form>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Dedicated Student Enrollment & Tuition Payment Modal */}
      <StudentEnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        selectedPlan={selectedPlanForEnroll}
        onAddToast={onAddToast}
      />
    </div>
  );
};
