import React, { useState } from 'react';
import type { Config } from '@measured/puck';
import {
  Sparkles,
  Award,
  BookOpen,
  CreditCard,
  FileText,
  HelpCircle,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Terminal,
  Radio,
  Clock,
  Star,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { Course, PricingPlan, FormConfig } from '../../types';
import { ThemedFormRenderer } from '../forms/ThemedFormRenderer';

export interface PuckRootProps {
  title?: string;
  themeColor?: string;
}

export type ComponentProps = {
  HeroBlock: {
    badgeText: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    bgGradient: 'emerald' | 'dark_indigo' | 'slate_amber' | 'cyber_dark' | 'sky_navy';
    imageUrl?: string;
    align: 'center' | 'left';
  };
  FeaturesBento: {
    heading: string;
    subheading: string;
    feature1Title: string;
    feature1Desc: string;
    feature1Icon: string;
    feature2Title: string;
    feature2Desc: string;
    feature2Icon: string;
    feature3Title: string;
    feature3Desc: string;
    feature3Icon: string;
  };
  DynamicCurriculum: {
    heading: string;
    subheading: string;
    badgeText: string;
    showEnrollBtn: boolean;
  };
  LivePricingTable: {
    heading: string;
    subheading: string;
    highlightBadge: string;
  };
  CustomFormEmbed: {
    heading: string;
    subheading: string;
    formId: string;
    buttonText: string;
  };
  FAQAccordion: {
    heading: string;
    subheading: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
  };
  Testimonials: {
    heading: string;
    subheading: string;
    quote1: string;
    author1: string;
    role1: string;
    quote2: string;
    author2: string;
    role2: string;
  };
  CTABanner: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    badgeText: string;
  };
  IslamicCalligraphyQuote: {
    arabicText: string;
    translation: string;
    reference: string;
  };
};

const FAQAccordionBlock: React.FC<{
  heading: string;
  subheading: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
}> = ({ heading, subheading, q1, a1, q2, a2, q3, a3 }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const items = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-black text-slate-900">{heading}</h2>
          {subheading && <p className="text-slate-500 text-sm">{subheading}</p>}
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl p-5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/60 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const createPuckConfig = (context: {
  tenant: any;
  courses: Course[];
  onEnroll: (plan: PricingPlan) => void;
  onSubmitForm: (formData: Record<string, any>, formId: string, formTitle: string) => Promise<void>;
  isSubmittingForm?: boolean;
}): Config<ComponentProps, PuckRootProps> => {
  const { tenant, courses, onEnroll, onSubmitForm, isSubmittingForm } = context;

  return {
    root: {
      render: ({ children }) => (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-950">
          {children}
        </div>
      ),
    },
    components: {
      HeroBlock: {
        fields: {
          badgeText: { type: 'text', label: 'Top Badge' },
          headline: { type: 'text', label: 'Main Headline' },
          subheadline: { type: 'textarea', label: 'Subheadline / Paragraph' },
          ctaText: { type: 'text', label: 'Primary CTA Button' },
          ctaLink: { type: 'text', label: 'Primary CTA Link (e.g. #pricing)' },
          secondaryCtaText: { type: 'text', label: 'Secondary Button' },
          secondaryCtaLink: { type: 'text', label: 'Secondary Link (e.g. #form)' },
          bgGradient: {
            type: 'select',
            label: 'Background Gradient',
            options: [
              { label: 'Emerald & Deep Teal', value: 'emerald' },
              { label: 'Dark Indigo & Violet', value: 'dark_indigo' },
              { label: 'Slate & Amber Gold', value: 'slate_amber' },
              { label: 'Cyber Dark Midnight', value: 'cyber_dark' },
              { label: 'Sky Navy Blue', value: 'sky_navy' },
            ],
          },
          imageUrl: { type: 'text', label: 'Hero Image URL' },
          align: {
            type: 'radio',
            label: 'Text Alignment',
            options: [
              { label: 'Center', value: 'center' },
              { label: 'Left', value: 'left' },
            ],
          },
        },
        defaultProps: {
          badgeText: 'Verified Ijazah & Sanad Programs',
          headline: 'Master Sacred Recitation & Knowledge with Global Scholars',
          subheadline: 'Live interactive 1-on-1 halaqat and modern digital tracks tailored to your schedule.',
          ctaText: 'Enroll in Academy',
          ctaLink: '#pricing',
          secondaryCtaText: 'Admissions Inquiry',
          secondaryCtaLink: '#form',
          bgGradient: 'emerald',
          imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
          align: 'center',
        },
        render: ({ badgeText, headline, subheadline, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, bgGradient, imageUrl, align }) => {
          const gradientClasses: Record<string, string> = {
            emerald: 'from-emerald-950 via-teal-900 to-slate-950',
            dark_indigo: 'from-slate-950 via-indigo-950 to-slate-950',
            slate_amber: 'from-slate-950 via-slate-900 to-amber-950',
            cyber_dark: 'from-slate-950 via-blue-950 to-slate-950',
            sky_navy: 'from-slate-950 via-blue-900 to-slate-950',
          };

          return (
            <section className={`relative py-20 sm:py-32 overflow-hidden text-white bg-gradient-to-b ${gradientClasses[bgGradient] || gradientClasses.emerald}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`max-w-4xl space-y-6 ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                  {badgeText && (
                    <span className="inline-block px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                      {badgeText}
                    </span>
                  )}

                  <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                    {headline}
                  </h1>

                  {subheadline && (
                    <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
                      {subheadline}
                    </p>
                  )}

                  <div className={`flex flex-wrap items-center gap-4 pt-4 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    {ctaText && (
                      <button
                        type="button"
                        onClick={() => {
                          if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                            onEnroll(tenant.pricingPlans[0]);
                          }
                        }}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 select-none active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{ctaText}</span>
                      </button>
                    )}

                    {secondaryCtaText && (
                      <a
                        href={secondaryCtaLink || '#form'}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl backdrop-blur-sm transition-all shadow-sm"
                      >
                        {secondaryCtaText}
                      </a>
                    )}
                  </div>

                  {imageUrl && (
                    <div className="pt-8 max-w-3xl mx-auto">
                      <img
                        src={imageUrl}
                        alt="Hero showcase"
                        className="rounded-3xl shadow-2xl border border-white/10 w-full object-cover max-h-96"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        },
      },

      FeaturesBento: {
        fields: {
          heading: { type: 'text', label: 'Section Heading' },
          subheading: { type: 'textarea', label: 'Section Subheading' },
          feature1Title: { type: 'text', label: 'Feature 1 Title' },
          feature1Desc: { type: 'textarea', label: 'Feature 1 Description' },
          feature1Icon: { type: 'text', label: 'Feature 1 Badge / Icon' },
          feature2Title: { type: 'text', label: 'Feature 2 Title' },
          feature2Desc: { type: 'textarea', label: 'Feature 2 Description' },
          feature2Icon: { type: 'text', label: 'Feature 2 Badge / Icon' },
          feature3Title: { type: 'text', label: 'Feature 3 Title' },
          feature3Desc: { type: 'textarea', label: 'Feature 3 Description' },
          feature3Icon: { type: 'text', label: 'Feature 3 Badge / Icon' },
        },
        defaultProps: {
          heading: 'Why Study with Our Academy',
          subheading: 'Combining classical pedagogy with modern interactive technology for unprecedented student retention.',
          feature1Title: 'Authentic Sanad Verification',
          feature1Desc: 'Direct unbroken recitation chains and certification registered with recognized scholars.',
          feature1Icon: 'Award',
          feature2Title: 'Live Interactive WebRTC Classrooms',
          feature2Desc: 'Crystal-clear audio-first virtual classrooms with audio looper and instant correction.',
          feature2Icon: 'Radio',
          feature3Title: 'Flexible Global Cohorts',
          feature3Desc: 'Tailored time slots across all time zones with 24/7 student portal access.',
          feature3Icon: 'Clock',
        },
        render: ({ heading, subheading, feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc }) => (
          <section className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{heading}</h2>
                {subheading && <p className="text-slate-500 text-sm sm:text-base">{subheading}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: feature1Title, desc: feature1Desc },
                  { title: feature2Title, desc: feature2Desc },
                  { title: feature3Title, desc: feature3Desc },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      DynamicCurriculum: {
        fields: {
          heading: { type: 'text', label: 'Section Heading' },
          subheading: { type: 'textarea', label: 'Section Subheading' },
          badgeText: { type: 'text', label: 'Top Badge' },
          showEnrollBtn: {
            type: 'radio',
            label: 'Show Enroll Button',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ],
          },
        },
        defaultProps: {
          heading: 'Structured Learning Tracks',
          subheading: 'Progressive tracks from foundational levels to complete mastery and certified graduation.',
          badgeText: 'Curriculum Tracks',
          showEnrollBtn: true,
        },
        render: ({ heading, subheading, badgeText, showEnrollBtn }) => (
          <section id="curriculum" className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                {badgeText && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
                    {badgeText}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{heading}</h2>
                {subheading && <p className="text-slate-500 text-sm sm:text-base">{subheading}</p>}
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
                        <h3 className="text-xl font-black text-slate-900">{course.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{course.description}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-lg text-slate-900 font-mono">
                          ${course.price} <span className="text-xs font-normal text-slate-500">/ track</span>
                        </span>

                        {showEnrollBtn && (
                          <button
                            type="button"
                            onClick={() => {
                              if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                                onEnroll(tenant.pricingPlans[0]);
                              }
                            }}
                            className="px-5 py-2.5 rounded-xl text-white text-xs font-bold bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                          >
                            Enroll in Track &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      LivePricingTable: {
        fields: {
          heading: { type: 'text', label: 'Section Heading' },
          subheading: { type: 'textarea', label: 'Section Subheading' },
          highlightBadge: { type: 'text', label: 'Badge Text' },
        },
        defaultProps: {
          heading: 'Tuition & Subscription Plans',
          subheading: 'Transparent pricing with dedicated mentor support, weekly live halaqat, and full LMS access.',
          highlightBadge: 'Transparent Pricing',
        },
        render: ({ heading, subheading, highlightBadge }) => (
          <section id="pricing" className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                {highlightBadge && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-black uppercase tracking-wider">
                    {highlightBadge}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{heading}</h2>
                {subheading && <p className="text-slate-500 text-sm sm:text-base">{subheading}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(tenant.pricingPlans || []).map((plan: PricingPlan) => {
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
                        <h3 className="font-extrabold text-xl text-slate-900">{plan.name}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
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
                          onClick={() => onEnroll(plan)}
                          className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none active:scale-95 ${
                            isPopular
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          Select {plan.name}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ),
      },

      CustomFormEmbed: {
        fields: {
          heading: { type: 'text', label: 'Section Heading' },
          subheading: { type: 'textarea', label: 'Section Subheading' },
          formId: {
            type: 'select',
            label: 'Select Academy Form',
            options: (tenant.forms && tenant.forms.length > 0)
              ? tenant.forms.map((f: FormConfig) => ({ label: f.title, value: f.id }))
              : [{ label: 'Direct Admissions Form', value: 'form-admissions' }],
          },
          buttonText: { type: 'text', label: 'Submit Button Label' },
        },
        defaultProps: {
          heading: 'Direct Admissions & Placement Inquiry',
          subheading: 'Submit your details for immediate review and assessment by our academic admissions committee.',
          formId: 'form-admissions',
          buttonText: 'Submit Application',
        },
        render: ({ heading, subheading, formId, buttonText }) => {
          const selectedForm: FormConfig = tenant.forms?.find((f: FormConfig) => f.id === formId) || tenant.forms?.[0] || {
            id: formId || 'form-admissions',
            title: heading || 'Direct Admissions & Placement Inquiry',
            description: subheading || 'Submit your details for immediate review.',
            fields: tenant.customFormFields && tenant.customFormFields.length > 0
              ? tenant.customFormFields
              : [
                  { id: 'studentName', label: 'Student Full Name', labelAr: 'اسم الطالب الكامل', type: 'text' as const, required: true, width: 'full' as const },
                  { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email' as const, required: true, width: 'half' as const },
                  { id: 'phone', label: 'Phone Number', labelAr: 'رقم الهاتف', type: 'phone' as const, required: true, width: 'half' as const },
                ],
            themeStyle: 'material',
            accentColor: 'emerald',
            acceptingResponses: true,
            submitButtonText: buttonText || 'Submit Application',
          };

          const effectiveForm: FormConfig = {
            ...selectedForm,
            title: heading || selectedForm.title,
            description: subheading || selectedForm.description,
            submitButtonText: buttonText || selectedForm.submitButtonText || 'Submit Application',
          };

          return (
            <section id="form" className="py-20 bg-slate-50 border-b border-slate-200">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <ThemedFormRenderer
                  form={effectiveForm}
                  onSubmit={(data) => {
                    onSubmitForm(data, effectiveForm.id, effectiveForm.title);
                  }}
                  isSubmitting={isSubmittingForm}
                />
              </div>
            </section>
          );
        },
      },

      FAQAccordion: {
        fields: {
          heading: { type: 'text', label: 'Heading' },
          subheading: { type: 'textarea', label: 'Subheading' },
          q1: { type: 'text', label: 'Question 1' },
          a1: { type: 'textarea', label: 'Answer 1' },
          q2: { type: 'text', label: 'Question 2' },
          a2: { type: 'textarea', label: 'Answer 2' },
          q3: { type: 'text', label: 'Question 3' },
          a3: { type: 'textarea', label: 'Answer 3' },
        },
        defaultProps: {
          heading: 'Frequently Asked Questions',
          subheading: 'Clear answers to common questions regarding admissions, schedules, and verified certifications.',
          q1: 'How do live virtual halaqat and classrooms work?',
          a1: 'Classes occur via our built-in low-latency WebRTC video and audio engine, with interactive repetition loopers.',
          q2: 'Can I change cohorts or schedule transfers?',
          a2: 'Yes, cohort transfers and timing adjustments can be easily managed inside your student portal dashboard.',
          q3: 'How are graduation certificates verified?',
          a3: 'Graduation certificates feature tamper-proof public QR verification codes linked directly to our registry database.',
        },
        render: (props) => <FAQAccordionBlock {...props} />,
      },

      Testimonials: {
        fields: {
          heading: { type: 'text', label: 'Heading' },
          subheading: { type: 'textarea', label: 'Subheading' },
          quote1: { type: 'textarea', label: 'Quote 1' },
          author1: { type: 'text', label: 'Author 1' },
          role1: { type: 'text', label: 'Role 1' },
          quote2: { type: 'textarea', label: 'Quote 2' },
          author2: { type: 'text', label: 'Author 2' },
          role2: { type: 'text', label: 'Role 2' },
        },
        defaultProps: {
          heading: 'Trusted by Students Worldwide',
          subheading: 'Real reviews from verified students across our global academic cohorts.',
          quote1: 'The 1-on-1 recitation feedback and looper player completely transformed my Tajweed pronunciation in under 3 months.',
          author1: 'Zaid Al-Harithi',
          role1: 'Sanad Hafs Cohort Graduate',
          quote2: 'The structured workshops and live coding sandboxes helped me land my dream software engineering role.',
          author2: 'Amina Khatun',
          role2: 'Full-Stack Track Mentee',
        },
        render: ({ heading, subheading, quote1, author1, role1, quote2, author2, role2 }) => (
          <section className="py-20 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{heading}</h2>
                {subheading && <p className="text-slate-500 text-sm">{subheading}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { quote: quote1, author: author1, role: role1 },
                  { quote: quote2, author: author2, role: role2 },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">"{item.quote}"</p>
                    <div className="pt-2 border-t border-slate-100">
                      <div className="font-extrabold text-xs text-slate-900">{item.author}</div>
                      <div className="text-[11px] text-slate-400">{item.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      IslamicCalligraphyQuote: {
        fields: {
          arabicText: { type: 'textarea', label: 'Arabic Verse / Text' },
          translation: { type: 'textarea', label: 'English Translation' },
          reference: { type: 'text', label: 'Surah / Source Reference' },
        },
        defaultProps: {
          arabicText: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
          translation: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.',
          reference: 'Surah Al-Hijr [15:9]',
        },
        render: ({ arabicText, translation, reference }) => (
          <section className="py-14 bg-slate-950 text-white text-center border-b border-slate-800">
            <div className="max-w-4xl mx-auto px-4 space-y-2">
              <p className="font-arabic text-3xl sm:text-4xl font-bold leading-relaxed text-amber-400">
                {arabicText}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-sans tracking-wide">
                "{translation}"
              </p>
              {reference && (
                <p className="text-[11px] text-slate-500 font-mono">
                  — {reference}
                </p>
              )}
            </div>
          </section>
        ),
      },

      CTABanner: {
        fields: {
          headline: { type: 'text', label: 'Headline' },
          subheadline: { type: 'textarea', label: 'Subheadline' },
          ctaText: { type: 'text', label: 'Button Text' },
          ctaLink: { type: 'text', label: 'Button Link' },
          badgeText: { type: 'text', label: 'Badge' },
        },
        defaultProps: {
          headline: 'Ready to Begin Your Educational Journey?',
          subheadline: 'Join hundreds of dedicated learners and certified scholars today.',
          ctaText: 'Enroll in Free Assessment',
          ctaLink: '#pricing',
          badgeText: 'Limited Cohort Spots',
        },
        render: ({ headline, subheadline, ctaText, ctaLink, badgeText }) => (
          <section className="py-20 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white text-center">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
              {badgeText && (
                <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {badgeText}
                </span>
              )}
              <h2 className="text-3xl sm:text-5xl font-black">{headline}</h2>
              {subheadline && <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">{subheadline}</p>}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (tenant.pricingPlans && tenant.pricingPlans.length > 0) {
                      onEnroll(tenant.pricingPlans[0]);
                    }
                  }}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{ctaText}</span>
                </button>
              </div>
            </div>
          </section>
        ),
      },
    },
  };
};
