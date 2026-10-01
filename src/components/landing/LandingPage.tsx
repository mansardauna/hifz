import React, { useState, useEffect, useMemo } from 'react';
import { Render } from '@measured/puck';
import { createPuckConfig } from '../builder/puckConfig';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from './Header';
import { api } from '../../services/api';
import { ToastMessage } from '../ui/Toast';
import { StudentEnrollmentModal } from '../checkout/StudentEnrollmentModal';
import { PricingPlan, FormConfig } from '../../types';
import { ThemedFormRenderer } from '../forms/ThemedFormRenderer';
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
  LayoutTemplate,
  CreditCard,
  HelpCircle,
  Hammer
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
        const matchedPlan = tenant.pricingPlans?.find((p) => p.id === planId) || tenant.pricingPlans?.[0];
        if (matchedPlan) {
          setSelectedPlanForEnroll(matchedPlan);
          setIsEnrollModalOpen(true);
        }
      }
    };

    const handleFormSubmit = async (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form.getAttribute('data-hifz-lead-form') === 'true') {
        e.preventDefault();
        const data = new FormData(form);
        const formId = form.getAttribute('data-form-id') || 'form-admissions';
        const formTitle = form.getAttribute('data-form-title') || 'Direct Admissions & Evaluation Inquiry';

        const formDataMap: Record<string, any> = {};
        data.forEach((val, key) => {
          if (val && typeof val === 'string' && val.trim()) {
            formDataMap[key] = val.trim();
          }
        });

        const name = (data.get('name') as string) || (data.get('studentName') as string) || (data.get('parentName') as string) || Object.values(formDataMap)[0] || 'Prospective Applicant';
        const email = (data.get('email') as string) || (data.get('contactEmail') as string) || '';
        const phone = (data.get('phone') as string) || '';
        const courseInterest = (data.get('courseInterest') as string) || (isCodingNiche ? 'Full-Stack Software Engineering' : 'Quran Memorization & Tajweed');

        if (!name || !email) {
          onAddToast({ type: 'error', title: 'Missing Info', message: 'Full name and email address are required.' });
          return;
        }

        // 1. Persist directly to Local Storage for Form Responses Table
        if (typeof window !== 'undefined') {
          try {
            const newResponse = {
              id: `resp-${Date.now()}`,
              formId,
              formTitle,
              studentName: name,
              email: email,
              phone: phone || '+1 (555) 000-0000',
              submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              status: 'New' as const,
              data: Object.keys(formDataMap).length > 0 ? formDataMap : { 'Applicant Name': name, 'Email': email, 'Phone': phone },
              notes: 'Submitted via live website form.'
            };

            const existing = JSON.parse(localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`) || '[]');
            localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify([newResponse, ...existing]));
          } catch (e) {
            console.warn('Error saving form response locally:', e);
          }
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
            notes: `Submitted via form "${formTitle}"`,
          });

          onAddToast({
            type: 'success',
            title: isAr ? 'تم إرسال طلب القبول بنجاح!' : 'Admissions Inquiry Submitted!',
            message: isAr
              ? `شكراً لك، ${name}. تم حفظ استمارتك وستتواصل معك إدارة الأكاديمية.`
              : `Thank you, ${name}. Your response has been recorded in the academy admissions queue.`,
          });
          form.reset();
        } catch (err) {
          onAddToast({ type: 'success', title: 'Submission Saved', message: 'Your application has been stored.' });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('submit', handleFormSubmit);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, [tenant.pricingPlans, tenant.subdomain, onAddToast, isCodingNiche, isAr]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName?.trim() && !formData.name?.trim()) {
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

  const handleSubmitAdmissions = async (e: React.FormEvent, customFormId?: string, customFormTitle?: string) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const targetFormId = customFormId || 'form-admissions';
    const targetFormTitle = customFormTitle || tenant.formTitle || 'Direct Admissions & Evaluation Inquiry';
    const studentName = formData.studentName || formData.name || 'Prospective Student';

    try {
      // Persist to Form Responses Table Storage
      if (typeof window !== 'undefined') {
        try {
          const newResponse = {
            id: `resp-${Date.now()}`,
            formId: targetFormId,
            formTitle: targetFormTitle,
            studentName: studentName,
            email: formData.email,
            phone: formData.phone || '+1 (555) 000-0000',
            submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: 'New' as const,
            data: formData,
            notes: `Submitted via ${targetFormTitle}`
          };
          const existing = JSON.parse(localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`) || '[]');
          localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify([newResponse, ...existing]));
        } catch (e) {}
      }

      await api.createLead({
        name: studentName,
        email: formData.email,
        phone: formData.phone || '+1 (555) 000-0000',
        country: formData.country || 'Global Inquiry',
        courseInterest: formData.courseInterest || (isCodingNiche ? 'Full-Stack Software Engineering' : 'Quran Memorization Track'),
        preferredSchedule: formData.preferredSchedule || 'Evening',
        priorHifzLevel: isCodingNiche ? 'Beginner' : (formData.priorHifzLevel || '1 - 5 Juz'),
        status: 'New',
        paymentStatus: 'Pending',
        notes: formData.notes || `Admissions inquiry submitted from ${targetFormTitle}.`,
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

  const handleSubmitAdmissionsData = async (submittedData: Record<string, any>, customFormId?: string, customFormTitle?: string) => {
    setIsSubmitting(true);
    const targetFormId = customFormId || 'form-admissions';
    const targetFormTitle = customFormTitle || tenant.formTitle || 'Direct Admissions Inquiry';
    const studentName = submittedData.studentName || submittedData.name || submittedData.parentName || submittedData.fullName || 'Prospective Student';
    const email = submittedData.email || 'applicant@example.com';
    const phone = submittedData.phone || submittedData.whatsapp || '+1 (555) 000-0000';

    try {
      if (typeof window !== 'undefined') {
        try {
          const newResponse = {
            id: `resp-${Date.now()}`,
            formId: targetFormId,
            formTitle: targetFormTitle,
            studentName,
            email,
            phone,
            submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: 'New' as const,
            data: submittedData,
            notes: `Submitted via ${targetFormTitle}`
          };
          const existing = JSON.parse(localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`) || '[]');
          localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify([newResponse, ...existing]));
        } catch (e) {}
      }

      await api.createLead({
        name: studentName,
        email,
        phone,
        country: 'Global Inquiry',
        courseInterest: isCodingNiche ? 'Full-Stack Software Engineering' : 'Quran Memorization Track',
        preferredSchedule: 'Flexible',
        priorHifzLevel: isCodingNiche ? 'Beginner' : '1 - 5 Juz',
        status: 'New',
        paymentStatus: 'Pending',
        notes: `Submitted from ${targetFormTitle}`,
      });

      onAddToast({
        type: 'success',
        title: isAr ? 'تم استلام طلبك بنجاح!' : 'Application Submitted Successfully!',
        message: isAr
          ? 'شكراً لك، تم حفظ طلبك وسيتواصل معك فريق الأكاديمية.'
          : 'Thank you! Your response has been recorded.',
      });
    } catch (err: any) {
      onAddToast({
        type: 'success',
        title: 'Application Saved',
        message: 'Your response has been stored in academy records.',
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
    url: `https://${tenant.subdomain}.ankabit.app`,
    logo: tenant.logoUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Global',
    },
    offers: (tenant.pricingPlans || []).map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.priceMonthly || (plan as any).price || 65,
      priceCurrency: plan.currency || 'USD',
      availability: 'https://schema.org/InStock',
    })),
  };

  const isDemoTenant = Boolean(
    tenant.subdomain === 'hifz-academy' ||
    tenant.subdomain === 'al-furqan' ||
    tenant.subdomain === 'madrasat-demo' ||
    tenant.subdomain === 'code-academy' ||
    tenant.subdomain === 'school-demo' ||
    tenant.subdomain?.includes('demo')
  );

  const puckConfig = useMemo(
    () =>
      createPuckConfig({
        tenant,
        courses,
        onEnroll: (plan) => {
          setSelectedPlanForEnroll(plan);
          setIsEnrollModalOpen(true);
        },
        onSubmitForm: async (fData, formId, formTitle) => {
          setFormData(fData);
          await handleSubmitAdmissions({ preventDefault: () => {} } as any, formId, formTitle);
        },
        isSubmittingForm: isSubmitting,
      }),
    [tenant, courses, isSubmitting]
  );

  const hasPuckLayout = Boolean(
    tenant.builderLayout?.content &&
    Array.isArray(tenant.builderLayout.content) &&
    tenant.builderLayout.content.length > 0
  );

  const builderSections = tenant.builderLayout?.sections as any[] | undefined;
  const hasPublishedContent = Boolean(
    liveHtml ||
    hasPuckLayout ||
    (builderSections && builderSections.length > 0) ||
    (tenant.pageBlocks && tenant.pageBlocks.length > 0)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900" dir={direction}>
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJsonLd) }}
      />

      {/* Semantic Accessible Header */}
      {(!liveHtml || !liveHtml.includes('<header')) && <Header />}

      {/* Main Landmark */}
      <main id="main-content" role="main">
        {/* 1. If Tenant has customized HTML, render liveHtml */}
        {liveHtml ? (
          <div>
            {liveCss && <style>{liveCss}</style>}
            <div dangerouslySetInnerHTML={{ __html: liveHtml }} />
          </div>
        ) : hasPuckLayout ? (
          /* 2. Visual Canvas Builder (Puck) Render */
          <Render config={puckConfig} data={tenant.builderLayout} />
        ) : builderSections && builderSections.length > 0 ? (
          /* 3. Render Modular Builder Sections */
          <div className="space-y-0">
            {builderSections
              .filter((sec) => sec.enabled)
              .map((sec, index) => {
                // 1. HERO SECTION
                if (sec.type === 'hero') {
                  return (
                    <section
                      key={sec.id || index}
                      className={`relative py-24 sm:py-32 overflow-hidden text-white bg-gradient-to-b ${sec.props?.bgGradient || 'from-slate-950 via-slate-900 to-slate-950'}`}
                    >
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto space-y-6">
                          {sec.props?.badgeText && (
                            <span className="inline-block px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                              {sec.props.badgeText}
                            </span>
                          )}

                          <h1 className={`text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight ${isAr ? 'font-arabic text-5xl sm:text-7xl' : ''}`}>
                            {sec.title}
                          </h1>

                          {sec.subtitle && (
                            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                              {sec.subtitle}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            {sec.props?.ctaText && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                                    setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                                    setIsEnrollModalOpen(true);
                                  }
                                }}
                                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 select-none active:scale-95"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>{sec.props.ctaText}</span>
                              </button>
                            )}

                            {sec.props?.secondaryCtaText && (
                              <a
                                href={sec.props.secondaryCtaLink || '#form'}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl backdrop-blur-sm transition-all shadow-sm"
                              >
                                {sec.props.secondaryCtaText}
                              </a>
                            )}
                          </div>

                          {sec.props?.imageUrl && (
                            <div className="pt-8 max-w-3xl mx-auto">
                              <img
                                src={sec.props.imageUrl}
                                alt="Hero preview"
                                className="rounded-3xl shadow-2xl border border-white/10 w-full object-cover max-h-96"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  );
                }

                // 2. FEATURES BENTO SECTION
                if (sec.type === 'features') {
                  const items = sec.props?.items || [
                    { icon: 'Award', title: 'Authentic Methodology', desc: 'Direct verified instruction from accredited faculty.' },
                    { icon: 'Radio', title: 'Live Interactive Audio/Video', desc: 'HD low-latency virtual classrooms with real-time participation.' },
                    { icon: 'CheckCircle2', title: 'Flexible Global Scheduling', desc: 'Cohorts aligned to your local timezone with continuous feedback.' },
                  ];

                  return (
                    <section key={sec.id || index} className="py-20 bg-white border-b border-slate-200">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 ${isAr ? 'font-arabic text-4xl' : ''}`}>
                            {sec.title}
                          </h2>
                          {sec.subtitle && (
                            <p className="text-slate-500 text-sm sm:text-base">{sec.subtitle}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {items.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <Sparkles className="w-6 h-6 text-emerald-600" />
                              </div>
                              <h3 className="font-extrabold text-lg text-slate-900">{item.title}</h3>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                }

                // 3. CURRICULUM & COURSES SECTION
                if (sec.type === 'curriculum') {
                  return (
                    <section id="curriculum" key={sec.id || index} className="py-20 bg-slate-50 border-b border-slate-200">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 ${isAr ? 'font-arabic text-4xl' : ''}`}>
                            {sec.title}
                          </h2>
                          {sec.subtitle && (
                            <p className="text-slate-500 text-sm sm:text-base">{sec.subtitle}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {courses.map((course) => (
                            <article
                              key={course.id}
                              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                            >
                              <div className="relative h-48 bg-slate-900">
                                <img
                                  src={course.imageUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'}
                                  alt={course.title}
                                  className="w-full h-full object-cover opacity-85"
                                />
                                <span className="absolute top-3 right-3 bg-white text-slate-900 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                                  {course.level}
                                </span>
                              </div>

                              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                  <h3 className={`text-xl font-black text-slate-900 ${isAr ? 'font-arabic text-2xl' : ''}`}>
                                    {isAr ? course.titleAr || course.title : course.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                                    {isAr ? course.descriptionAr || course.description : course.description}
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                  <span className="font-black text-lg text-slate-900 font-mono">
                                    ${course.price} <span className="text-xs font-normal text-slate-500">/ track</span>
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                                        setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                                        setIsEnrollModalOpen(true);
                                      }
                                    }}
                                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
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
                  );
                }

                // 4. DYNAMIC PRICING SECTION
                if (sec.type === 'pricing') {
                  return (
                    <section id="pricing" key={sec.id || index} className="py-20 bg-white border-b border-slate-200">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                          <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 ${isAr ? 'font-arabic text-4xl' : ''}`}>
                            {sec.title}
                          </h2>
                          {sec.subtitle && (
                            <p className="text-slate-500 text-sm sm:text-base">{sec.subtitle}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {tenant.pricingPlans.map((plan) => {
                            const isPopular = plan.popular || (plan as any).isPopular;
                            const price = plan.priceMonthly || (plan as any).price || 65;

                            return (
                              <div
                                key={plan.id}
                                className={`bg-white rounded-3xl p-8 border shadow-sm flex flex-col justify-between transition-all ${
                                  isPopular ? 'border-2 border-emerald-600 shadow-xl relative' : 'border-slate-200'
                                }`}
                              >
                                {isPopular && (
                                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                                    Most Popular
                                  </span>
                                )}

                                <div className="space-y-4">
                                  <h3 className="font-extrabold text-xl text-slate-900">{isAr ? plan.nameAr || plan.name : plan.name}</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">{isAr ? plan.descriptionAr || plan.description : plan.description}</p>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900 font-mono">${price}</span>
                                    <span className="text-xs text-slate-500 font-bold">/mo</span>
                                  </div>

                                  <ul className="space-y-3 pt-6 border-t border-slate-100 text-xs text-slate-700">
                                    {plan.features.map((feat, idx) => (
                                      <li key={idx} className="flex items-center gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{feat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="pt-8 mt-6 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedPlanForEnroll(plan);
                                      setIsEnrollModalOpen(true);
                                    }}
                                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none active:scale-95 ${
                                      isPopular
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
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
                  );
                }

                // 5. DYNAMIC CUSTOM FORM SECTION
                if (sec.type === 'form') {
                  const selectedForm: FormConfig = tenant.forms?.find(
                    (f) => f.id === sec.props?.selectedFormId
                  ) || tenant.forms?.[0] || {
                    id: 'form-admissions',
                    title: sec.title || 'Direct Admissions & Placement Inquiry',
                    description: sec.subtitle || 'Complete your student details below for immediate review by our admissions committee.',
                    fields: tenant.customFormFields && tenant.customFormFields.length > 0
                      ? tenant.customFormFields
                      : [
                          { id: 'studentName', label: 'Student Full Name', labelAr: 'اسم الطالب الكامل', type: 'text' as const, required: true, width: 'full' as const },
                          { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email' as const, required: true, width: 'half' as const },
                          { id: 'phone', label: 'WhatsApp / Phone Number', labelAr: 'رقم الهاتف', type: 'phone' as const, required: true, width: 'half' as const },
                        ],
                    themeStyle: 'material',
                    accentColor: 'emerald',
                    acceptingResponses: true,
                    submitButtonText: 'Submit Application',
                  };

                  const effectiveForm: FormConfig = {
                    ...selectedForm,
                    title: sec.title || selectedForm.title,
                    description: sec.subtitle || selectedForm.description,
                  };

                  return (
                    <section id="form" key={sec.id || index} className="py-20 bg-slate-50 border-b border-slate-200">
                      <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <ThemedFormRenderer
                          form={effectiveForm}
                          onSubmit={(data) => {
                            handleSubmitAdmissionsData(data, effectiveForm.id, effectiveForm.title);
                          }}
                          isSubmitting={isSubmitting}
                          language={language as 'en' | 'ar'}
                        />
                      </div>
                    </section>
                  );
                }

                // 6. FAQ ACCORDION SECTION
                if (sec.type === 'faq') {
                  const questions = sec.props?.questions || [
                    { q: 'How do live sessions work?', a: 'Classes occur via our integrated WebRTC video and audio portal.' },
                    { q: 'Can I change my schedule?', a: 'Yes, cohort transfers can be requested through the student portal.' },
                    { q: 'How do I receive my certificate?', a: 'Upon completing all course modules, verified QR certificates are issued.' },
                  ];

                  return (
                    <section key={sec.id || index} className="py-20 bg-white border-b border-slate-200">
                      <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12 space-y-3">
                          <h2 className="text-3xl font-black text-slate-900">{sec.title}</h2>
                          {sec.subtitle && <p className="text-slate-500 text-sm">{sec.subtitle}</p>}
                        </div>

                        <div className="space-y-4">
                          {questions.map((faqItem: any, fi: number) => {
                            const isOpen = openFaqIndex === fi;
                            return (
                              <div
                                key={fi}
                                className="border border-slate-200 rounded-2xl p-5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                onClick={() => setOpenFaqIndex(isOpen ? null : fi)}
                              >
                                <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                                  <span>{faqItem.q}</span>
                                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </div>
                                {isOpen && (
                                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                                    {faqItem.a}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  );
                }

                return null;
              })}
          </div>
        ) : !isDemoTenant && !hasPublishedContent ? (
          /* Clean Unbuilt / Construction State for Real User Academies */
          <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <Wand2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Portal In Setup
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {tenant.name}
              </h1>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
                Welcome to our institution portal. The custom landing page is currently being crafted by our administration team.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a
                href={`/${tenant.subdomain}/admin`}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Build Landing Page</span>
              </a>
              <a
                href={`/${tenant.subdomain}/login`}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs flex items-center gap-2 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Student / Staff Portal</span>
              </a>
            </div>
          </div>
        ) : (
          /* Default Demo Landing Page */
          <>
            {/* 1. Hero Section */}
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
                        if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                          setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                          setIsEnrollModalOpen(true);
                        }
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

            {/* 2. Featured Courses Grid */}
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
                              if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                                setSelectedPlanForEnroll(tenant.pricingPlans[0]);
                                setIsEnrollModalOpen(true);
                              }
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

            {/* 3. Tuition & Pricing Packages */}
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
            <a href="#form" className="hover:text-white transition-colors">Admissions</a>
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
