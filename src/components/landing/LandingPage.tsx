import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
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
  Sparkles,
  Code2,
  Terminal,
  Award,
  Radio,
  Star,
  Globe,
  Layers,
  Wand2,
  FileText,
  Settings,
  LayoutTemplate
} from 'lucide-react';

interface LandingPageProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAddToast }) => {
  const { tenant, courses, language, direction } = useTenant();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [selectedPlanForEnroll, setSelectedPlanForEnroll] = useState<PricingPlan | null>(null);

  // Live published HTML/CSS state synced with localStorage and tenant config
  const [liveHtml, setLiveHtml] = useState<string>(tenant.customHtml || '');
  const [liveCss, setLiveCss] = useState<string>(tenant.customCss || '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`tenant_customHtml_${tenant.subdomain}`);
      const cachedCss = localStorage.getItem(`tenant_customCss_${tenant.subdomain}`);
      if (cached) {
        setLiveHtml(cached);
      } else if (tenant.customHtml) {
        setLiveHtml(tenant.customHtml);
      } else {
        setLiveHtml('');
      }

      if (cachedCss) {
        setLiveCss(cachedCss);
      } else if (tenant.customCss) {
        setLiveCss(tenant.customCss);
      }
    }
  }, [tenant.customHtml, tenant.customCss, tenant.subdomain]);

  const isAr = language === 'ar';
  const isCodingNiche = tenant.niche === 'coding' || tenant.subdomain.includes('code');

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
        const name = (data.get('name') as string) || (data.get('studentName') as string) || '';
        const email = (data.get('email') as string) || '';
        const phone = (data.get('phone') as string) || '';
        const courseInterest = (data.get('courseInterest') as string) || (isCodingNiche ? 'Full-Stack Software Engineering' : 'Quran Memorization & Tajweed');

        if (!name || !email) {
          onAddToast({ type: 'error', title: 'Missing Info', message: 'Full name and email address are required.' });
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
            priorHifzLevel: isCodingNiche ? 'Beginner' : '1 - 5 Juz',
            status: 'New',
            paymentStatus: 'Pending',
            notes: 'Submitted via Landing Page Lead Inquiry Form',
          });

          onAddToast({
            type: 'success',
            title: isAr ? 'تم إرسال طلب القبول بنجاح!' : 'Admissions Inquiry Submitted!',
            message: isAr
              ? `شكراً لك، ${name}. ستتواصل معك لجنة القبول والتسجيل في أقرب وقت.`
              : `Thank you, ${name}. Our admissions committee will reach out shortly.`,
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
  }, [tenant.pricingPlans, onAddToast, isCodingNiche, isAr]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAdmissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.createLead({
        name: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country || 'Global Inquiry',
        courseInterest: formData.courseInterest || (isCodingNiche ? 'Full-Stack Software Engineering' : 'Quran Memorization Track'),
        preferredSchedule: formData.preferredSchedule || 'Evening',
        priorHifzLevel: isCodingNiche ? 'Beginner' : (formData.priorHifzLevel || '1 - 5 Juz'),
        status: 'New',
        paymentStatus: 'Pending',
        notes: formData.notes || `Admissions inquiry submitted from main landing page.`,
      });

      onAddToast({
        type: 'success',
        title: isAr ? 'تم استلام طلب القبول بنجاح!' : 'Application Submitted Successfully!',
        message: isAr
          ? 'شكراً لك، تم تسجيل طلبك وسيتواصل معك فريق التسجيل لجدولة موعد المقابلة.'
          : 'Thank you! Your inquiry has been routed to admissions. We will contact you soon.',
      });

      setFormData({});
    } catch (err: any) {
      onAddToast({
        type: 'error',
        title: isAr ? 'حدث خطأ أثناء الإرسال' : 'Submission Failed',
        message: isAr ? 'يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.' : 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Schema.org Structured Data for SEO Rich Snippets
  const schemaOrgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: tenant.name,
    description: tenant.tagline || tenant.aboutText,
    url: `https://${tenant.subdomain}.techmadrasah.app`,
    logo: tenant.logoUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Global',
    },
    offers: tenant.pricingPlans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.priceMonthly || (plan as any).price || 65,
      priceCurrency: plan.currency || 'USD',
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900" dir={direction}>
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJsonLd) }}
      />

      {/* Semantic Accessible Header (Only when not already inside custom HTML) */}
      {(!liveHtml || !liveHtml.includes('<header')) && <Header />}

      {/* Main Landmark */}
      <main id="main-content" role="main">
        {/* If Tenant has customized and published via Page Builder / AI, render the live HTML */}
        {liveHtml ? (
          <div>
            {liveCss && <style>{liveCss}</style>}
            <div dangerouslySetInnerHTML={{ __html: liveHtml }} />
          </div>
        ) : (
          <>
            {/* 1. Accessible Hero Section */}
            <section aria-labelledby="hero-heading" className="bg-white py-20 lg:py-28 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto space-y-6">
                  <span className={`inline-block px-3.5 py-1 text-xs font-bold rounded-full ${
                    isCodingNiche
                      ? 'text-blue-700 bg-blue-50 border border-blue-200'
                      : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                  }`}>
                    {isAr ? tenant.heroBadgeTextAr : tenant.heroBadgeText}
                  </span>

                  <h1
                    id="hero-heading"
                    className={`text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight ${
                      isAr ? 'font-arabic text-5xl sm:text-7xl' : ''
                    }`}
                  >
                    {isAr ? tenant.taglineAr : tenant.tagline}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                    {isAr ? tenant.aboutTextAr : tenant.aboutText}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                        setIsEnrollModalOpen(true);
                      }}
                      className={`px-8 py-3.5 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 select-none active:scale-95 ${
                        isCodingNiche
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAr ? 'تقديم طلب الالتحاق' : 'Enroll in Academy'}</span>
                    </button>

                    <a
                      href="#admissions"
                      className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl shadow-xs transition-all"
                    >
                      {isAr ? 'استفسار القبول' : 'Admissions Inquiry'}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Distinctive Niche Banner */}
            {!isCodingNiche ? (
              <section aria-label="Sacred Quranic Quote" className="py-14 bg-slate-950 text-white text-center border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4">
                  <p className="font-arabic text-4xl font-bold leading-relaxed mb-2 text-amber-400">
                    إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans tracking-wide">
                    "Indeed, it is We who sent down the Quran and indeed, We will be its guardian." — Surah Al-Hijr [15:9]
                  </p>
                </div>
              </section>
            ) : (
              <section aria-label="Software Engineering Highlight" className="py-12 bg-slate-950 text-white border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-8 h-8 text-blue-400 shrink-0" />
                    <div>
                      <h2 className="text-base font-extrabold text-white">Full-Stack Cloud & Software Apprenticeship</h2>
                      <p className="text-xs text-slate-400">Pair programming, daily coding sandboxes, algorithmic audits & CI/CD deployment.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-emerald-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live SFU Terminal Cluster: 100% Online</span>
                  </div>
                </div>
              </section>
            )}

            {/* 3. Featured Courses Grid */}
            <section id="courses" aria-labelledby="courses-heading" className="py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2
                    id="courses-heading"
                    className={`text-3xl sm:text-4xl font-extrabold text-slate-900 ${
                      isAr ? 'font-arabic text-4xl' : ''
                    }`}
                  >
                    {isCodingNiche
                      ? (isAr ? 'المسارات البرمجية المتاحة' : 'Featured Software Curriculums')
                      : (isAr ? 'المناهج والدورات القرآنية المتاحة' : 'Featured Quranic Curriculums')}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {isCodingNiche
                      ? 'Structured tracks engineered for full-stack engineering, algorithms, and microservices.'
                      : 'Structured tracks engineered for progressive mastery, memorization, and Tajweed.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {courses.map((course) => (
                    <article
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-slate-900">
                        <img
                          src={course.imageUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'}
                          alt={course.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <span className="absolute top-3 right-3 bg-white text-slate-900 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                          {course.level}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className={`text-xl font-bold text-slate-900 ${isAr ? 'font-arabic text-2xl' : ''}`}>
                            {isAr ? course.titleAr || course.title : course.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {isAr ? course.descriptionAr || course.description : course.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-extrabold text-lg text-slate-900 font-mono">
                            ${course.price} <span className="text-xs font-normal text-slate-500">/ track</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                              setIsEnrollModalOpen(true);
                            }}
                            className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                              isCodingNiche ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            Enroll in Track &rarr;
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Tuition & Pricing Packages */}
            <section id="pricing" aria-labelledby="pricing-heading" className="py-20 bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2
                    id="pricing-heading"
                    className={`text-3xl sm:text-4xl font-extrabold text-slate-900 ${isAr ? 'font-arabic text-4xl' : ''}`}
                  >
                    {isAr ? 'باقات الاشتراك والرسوم الدراسية' : 'Tuition & Subscription Plans'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {isAr ? 'خطط مرنة تناسب جميع الطلاب والمستويات' : 'Transparent pricing with dedicated mentor support and live classes.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {tenant.pricingPlans.map((plan) => {
                    const isPopular = plan.popular || (plan as any).isPopular;
                    const price = plan.priceMonthly || (plan as any).price || 65;

                    return (
                      <div
                        key={plan.id}
                        className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between transition-all ${
                          isPopular ? 'border-2 border-blue-600 shadow-xl relative' : 'border-slate-200'
                        }`}
                      >
                        {isPopular && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                            Most Popular
                          </span>
                        )}

                        <div className="space-y-4">
                          <h3 className="font-extrabold text-lg text-slate-900">{isAr ? plan.nameAr || plan.name : plan.name}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{isAr ? plan.descriptionAr || plan.description : plan.description}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-slate-900 font-mono">${price}</span>
                            <span className="text-xs text-slate-500 font-bold">/mo</span>
                          </div>

                          <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                            {plan.features.map((feat, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlanForEnroll(plan);
                              setIsEnrollModalOpen(true);
                            }}
                            className={`w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer select-none active:scale-95 ${
                              isPopular
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            Select {isAr ? plan.nameAr || plan.name : plan.name}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 5. Accessible Admissions & Inquiry Form */}
            <section id="admissions" aria-labelledby="admissions-heading" className="py-20 bg-white">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      {isAr ? 'بوابة التسجيل والقبول' : 'Direct Admissions Portal'}
                    </span>
                    <h2
                      id="admissions-heading"
                      className={`text-2xl sm:text-3xl font-extrabold text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}
                    >
                      {tenant.formTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">
                      {tenant.formDescription}
                    </p>
                  </div>

                  <form onSubmit={handleSubmitAdmissions} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="studentName" className="block text-xs font-bold text-slate-700 mb-1">
                        {isAr ? 'اسم الطالب الكامل' : 'Student Full Name'} <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="studentName"
                        type="text"
                        required
                        aria-required="true"
                        aria-invalid={!!errors.studentName}
                        value={formData.studentName || ''}
                        onChange={(e) => handleInputChange('studentName', e.target.value)}
                        placeholder={isAr ? 'مثال: محمد عبد الله' : 'e.g. Alex Mercer'}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                      {errors.studentName && (
                        <p className="text-xs text-red-600 mt-1 font-semibold" role="alert">{errors.studentName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                          {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="student@example.com"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-600 mt-1 font-semibold" role="alert">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
                          {isAr ? 'رقم الهاتف / واتساب' : 'WhatsApp / Phone'} <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.phone}
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-600 mt-1 font-semibold" role="alert">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="courseInterest" className="block text-xs font-bold text-slate-700 mb-1">
                        {isAr ? 'المسار الدراسي المطلوب' : 'Program of Interest'}
                      </label>
                      <select
                        id="courseInterest"
                        value={formData.courseInterest || ''}
                        onChange={(e) => handleInputChange('courseInterest', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      >
                        {isCodingNiche ? (
                          <>
                            <option value="Full-Stack TypeScript & React 19 Mastery">Full-Stack TypeScript & React 19 Mastery</option>
                            <option value="Python Algorithms & System Design">Python Algorithms & System Design</option>
                            <option value="Cloud Architecture & Docker Containers">Cloud Architecture & Docker Containers</option>
                          </>
                        ) : (
                          <>
                            <option value="Foundations of Tajweed & Recitation">Foundations of Tajweed & Recitation</option>
                            <option value="Intensive Hifz Memorization Track">Intensive Hifz Memorization Track</option>
                            <option value="Qira'at & Ijazah Sanad Certification">Qira'at & Ijazah Sanad Certification</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 select-none active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Submitting Application...') : (isAr ? 'إرسال طلب الالتحاق' : 'Submit Admissions Application')}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Semantic Accessible Footer */}
      <footer role="contentinfo" className="bg-slate-950 text-white py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-extrabold text-sm text-white">{tenant.name}</p>
            <p className="text-xs text-slate-400">{tenant.tagline}</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#admissions" className="hover:text-white transition-colors">Admissions</a>
            <a href={`/${tenant.subdomain}/login`} className="text-blue-400 font-bold hover:underline">Student Portal</a>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} {tenant.name}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Student Enrollment Modal */}
      {selectedPlanForEnroll && (
        <StudentEnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          selectedPlan={selectedPlanForEnroll}
          onAddToast={onAddToast}
        />
      )}

      {/* Floating Academy Owner Quick Action Bar */}
      {user?.role === 'admin' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 sm:gap-3 font-sans text-xs animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-[11px] text-slate-300 hidden sm:inline">Owner Mode</span>
          </div>

          <a
            href={`/${tenant.subdomain}/admin`}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Edit Page</span>
          </a>

          <a
            href={`/${tenant.subdomain}/admin`}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Forms</span>
          </a>

          <a
            href={`/${tenant.subdomain}/admin`}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </a>
        </div>
      )}
    </div>
  );
};
