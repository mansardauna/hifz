import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { TenantNiche } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  Video,
  CreditCard,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Building2,
  GraduationCap,
  ShieldCheck,
  Radio,
  FileCheck2,
  Layers,
  Palette,
  Globe,
  SlidersHorizontal,
  X,
  AlertCircle
} from 'lucide-react';

interface OnboardingWizardProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
  onComplete: () => void;
}

interface StepItem {
  id: number;
  title: string;
  desc: string;
}

const getStepsForNiche = (isQuran: boolean): StepItem[] => [
  { id: 1, title: 'Getting started', desc: 'Kick off your onboarding process' },
  { id: 2, title: 'Academy profile', desc: 'Provide details about your academy' },
  { id: 3, title: 'Specialization tracks', desc: 'Select Madrasat, Code, or School' },
  { id: 4, title: 'Setup curriculum network', desc: 'Configure tracks & syllabus categories' },
  { id: 5, title: isQuran ? 'Virtual halaqahs & SFU' : 'Live Classrooms & SFU', desc: 'Configure WebRTC live classrooms' },
  { id: 6, title: 'Tuition & gateways', desc: 'Configure tuition & Stripe/Moyasar' },
  { id: 7, title: isQuran ? 'Ustadhah allocation' : 'Instructor & Faculty Setup', desc: isQuran ? 'Assign female scholars & mentors' : 'Assign lead faculty & mentors' },
  { id: 8, title: 'Review & launch', desc: 'Final review before going live' },
];

interface CurriculumCategory {
  id: string;
  title: string;
  iconName: string;
  selected: boolean;
}

const getCategoriesForNiche = (niche: string): CurriculumCategory[] => {
  if (niche === 'madrasat' || niche === 'quran') {
    return [
      { id: 'hifz', title: 'Quran Hifz & Retention', iconName: 'BookOpen', selected: true },
      { id: 'tajweed', title: 'Tajweed Phonetics', iconName: 'Award', selected: true },
      { id: 'nahw', title: 'Classical Arabic (Nahw)', iconName: 'Layers', selected: true },
      { id: 'fiqh', title: 'Fiqh & Hadith Studies', iconName: 'ShieldCheck', selected: true },
      { id: 'seerah', title: 'Islamic History & Seerah', iconName: 'Sparkles', selected: true },
      { id: 'tafsir', title: 'Tafsir Al-Quran Circle', iconName: 'BookOpen', selected: true },
      { id: 'noorani', title: 'Noorani Qaidah Basics', iconName: 'Award', selected: true },
      { id: 'sanad', title: 'Sanad & Ijazah Studio', iconName: 'CheckCircle2', selected: true },
      { id: 'looper', title: 'Audio Reciter Looper', iconName: 'Radio', selected: true },
    ];
  }
  if (niche === 'code_academy' || niche === 'coding') {
    return [
      { id: 'web', title: 'Full-Stack Web Engineering', iconName: 'Layers', selected: true },
      { id: 'react', title: 'React 19 & Modern Next.js', iconName: 'Sparkles', selected: true },
      { id: 'dsa', title: 'Data Structures & Algorithms', iconName: 'Award', selected: true },
      { id: 'cloud', title: 'Cloud DevOps & Containerization', iconName: 'ShieldCheck', selected: true },
      { id: 'api', title: 'RESTful & GraphQL API Design', iconName: 'Layers', selected: true },
      { id: 'db', title: 'Database & SQL Architecture', iconName: 'BookOpen', selected: true },
      { id: 'system_design', title: 'Distributed Systems Architecture', iconName: 'CheckCircle2', selected: true },
      { id: 'git', title: 'Git Workflows & CI/CD Pipelines', iconName: 'Radio', selected: true },
    ];
  }
  if (niche === 'school') {
    return [
      { id: 'math', title: 'Mathematics & AP Calculus', iconName: 'Award', selected: true },
      { id: 'sciences', title: 'Biology & Chemistry Lab', iconName: 'ShieldCheck', selected: true },
      { id: 'literature', title: 'Literature & Rhetorical Analysis', iconName: 'BookOpen', selected: true },
      { id: 'history', title: 'World History & Social Sciences', iconName: 'Layers', selected: true },
      { id: 'physics', title: 'Physics & Experimental Derivations', iconName: 'Sparkles', selected: true },
      { id: 'languages', title: 'Foreign Language Acquisition', iconName: 'BookOpen', selected: true },
      { id: 'capstone', title: 'Senior Honors Capstone Defense', iconName: 'CheckCircle2', selected: true },
      { id: 'stem', title: 'STEM & Robotics Lab', iconName: 'Radio', selected: true },
    ];
  }
  return [
    { id: 'fundamentals', title: 'Core Foundations & Principles', iconName: 'BookOpen', selected: true },
    { id: 'practical', title: 'Applied Practical Methods', iconName: 'Layers', selected: true },
    { id: 'quality', title: 'Quality Assurance & Standards', iconName: 'ShieldCheck', selected: true },
    { id: 'strategy', title: 'Strategic Analysis & Planning', iconName: 'Sparkles', selected: true },
    { id: 'case_studies', title: 'Case Studies & Diagnostic Reviews', iconName: 'Award', selected: true },
    { id: 'communication', title: 'Communication & Leadership', iconName: 'Radio', selected: true },
    { id: 'capstone', title: 'Applied Capstone Project', iconName: 'CheckCircle2', selected: true },
  ];
};

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'BookOpen': return BookOpen;
    case 'Award': return Award;
    case 'Layers': return Layers;
    case 'ShieldCheck': return ShieldCheck;
    case 'Sparkles': return Sparkles;
    case 'Radio': return Radio;
    default: return CheckCircle2;
  }
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onAddToast, onComplete }) => {
  const { tenant, updateTenantConfig, direction } = useTenant();
  const draftKey = `onboarding_draft_${tenant.subdomain}`;

  const initialNiche = tenant.niche || 'madrasat';
  const isInitialQuran = initialNiche === 'madrasat' || initialNiche === 'quran';

  // Read saved draft on mount
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  // Academy Setup State
  const [subdomain, setSubdomain] = useState<string>(tenant.subdomain || 'academy');
  const [isSubdomainCustomized, setIsSubdomainCustomized] = useState<boolean>(false);
  const [academyName, setAcademyName] = useState<string>(tenant.name || (isInitialQuran ? 'Madrasat Al-Furqan Academy' : 'Nexus Global Academy'));
  const [tagline, setTagline] = useState<string>(
    tenant.tagline ||
      (isInitialQuran
        ? 'Sacred Quranic Memorization & Tajweed with Verified Sanad Ustadhahs'
        : 'Excellence in Professional Education, Hands-on Mentorship & Certification')
  );
  const [primaryColor, setPrimaryColor] = useState<string>(tenant.theme?.primaryColor || (tenant as any).brandColor || '#059669');
  const [selectedNiche, setSelectedNiche] = useState<TenantNiche>(tenant.niche || 'madrasat');

  const isQuranNiche = selectedNiche === 'madrasat' || selectedNiche === 'quran';
  const steps = getStepsForNiche(isQuranNiche);

  // Step 4: Curriculum Categories
  const [categories, setCategories] = useState<CurriculumCategory[]>(() => getCategoriesForNiche(initialNiche));

  // Step 5: Virtual Classrooms
  const [enableWebRTC, setEnableWebRTC] = useState(true);
  const [recordingConsent, setRecordingConsent] = useState(true);

  // Step 6: Tuition Plans
  const [planPrice, setPlanPrice] = useState<number>(65);
  const [enableStripe, setEnableStripe] = useState<boolean>(true);
  const [enableMoyasar, setEnableMoyasar] = useState<boolean>(true);

  // Step 7: Ustadhah / Faculty Mentor
  const [leadTeacherName, setLeadTeacherName] = useState(
    isInitialQuran ? 'Ustadhah Zainab Al-Fayez' : 'Dr. Sarah Jenkins'
  );
  const [leadTeacherTitle, setLeadTeacherTitle] = useState(
    isInitialQuran ? 'Senior Qariyah & Sanad Holder' : 'Lead Faculty Director & Senior Instructor'
  );

  // Reserved subdomains to protect system routing
  const reservedSubdomains = [
    'super-admin',
    'platform',
    'demo',
    'api',
    'admin',
    'mail',
    'auth',
    'login',
    'register',
    'root',
  ];

  // Real-time Subdomain Validation & Availability Check
  const subdomainCheck = React.useMemo(() => {
    const trimmed = subdomain.toLowerCase().trim();
    if (!trimmed) {
      return { status: 'empty', message: 'Subdomain URL cannot be empty.' };
    }
    if (trimmed.length < 3) {
      return { status: 'invalid', message: 'Subdomain must be at least 3 characters long.' };
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(trimmed)) {
      return { status: 'invalid', message: 'Use only lowercase letters, numbers, and hyphens (cannot start or end with a hyphen).' };
    }
    if (reservedSubdomains.includes(trimmed)) {
      return { status: 'taken', message: `"${trimmed}" is a reserved system route. Please choose another.` };
    }
    if (trimmed === tenant.subdomain) {
      return { status: 'available', message: `Active academy address: https://${trimmed}.ankabit.app` };
    }
    if (typeof window !== 'undefined') {
      const exists = localStorage.getItem(`tenant_config_${trimmed}`);
      if (exists) {
        return { status: 'taken', message: `Subdomain "${trimmed}" is already taken by another academy.` };
      }
    }
    return { status: 'available', message: `https://${trimmed}.ankabit.app is ready & available!` };
  }, [subdomain, tenant.subdomain]);

  // Load draft from localStorage on initial render
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.currentStep) setCurrentStep(draft.currentStep);
        if (draft.completedSteps) setCompletedSteps(draft.completedSteps);
        if (draft.subdomain) {
          setSubdomain(draft.subdomain);
          setIsSubdomainCustomized(true);
        }
        if (draft.academyName) setAcademyName(draft.academyName);
        if (draft.tagline) setTagline(draft.tagline);
        if (draft.primaryColor) setPrimaryColor(draft.primaryColor);
        if (draft.selectedNiche) setSelectedNiche(draft.selectedNiche);
        if (draft.categories && Array.isArray(draft.categories)) setCategories(draft.categories);
        if (typeof draft.enableWebRTC === 'boolean') setEnableWebRTC(draft.enableWebRTC);
        if (typeof draft.recordingConsent === 'boolean') setRecordingConsent(draft.recordingConsent);
        if (draft.planPrice) setPlanPrice(draft.planPrice);
        if (typeof draft.enableStripe === 'boolean') setEnableStripe(draft.enableStripe);
        if (typeof draft.enableMoyasar === 'boolean') setEnableMoyasar(draft.enableMoyasar);
        if (draft.leadTeacherName) setLeadTeacherName(draft.leadTeacherName);
        if (draft.leadTeacherTitle) setLeadTeacherTitle(draft.leadTeacherTitle);
      }
    } catch (e) {
      console.warn('Failed to parse onboarding draft:', e);
    }
  }, [draftKey]);

  // Save draft whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const draftData = {
        currentStep,
        completedSteps,
        subdomain,
        academyName,
        tagline,
        primaryColor,
        selectedNiche,
        categories,
        enableWebRTC,
        recordingConsent,
        planPrice,
        enableStripe,
        enableMoyasar,
        leadTeacherName,
        leadTeacherTitle,
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      if (subdomain && subdomain !== tenant.subdomain) {
        localStorage.setItem(`onboarding_draft_${subdomain}`, JSON.stringify(draftData));
      }
    } catch (e) {
      console.warn('Failed to save onboarding draft:', e);
    }
  }, [
    draftKey,
    currentStep,
    completedSteps,
    subdomain,
    academyName,
    tagline,
    primaryColor,
    selectedNiche,
    categories,
    enableWebRTC,
    recordingConsent,
    planPrice,
    enableStripe,
    enableMoyasar,
    leadTeacherName,
    leadTeacherTitle,
  ]);

  const brandHex = primaryColor || tenant.theme?.primaryColor || (tenant as any).brandColor || '#059669';

  // Master toggle: are all categories selected?
  const allCategoriesSelected = categories.every((c) => c.selected);

  const toggleAllCategories = () => {
    const nextState = !allCategoriesSelected;
    setCategories((prev) => prev.map((c) => ({ ...c, selected: nextState })));
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (subdomainCheck.status !== 'available') {
        onAddToast({
          type: 'error',
          title: 'Valid Subdomain Required',
          message: subdomainCheck.message || 'Please specify a valid, unique subdomain for your academy.',
        });
        return;
      }
    }

    setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save & Complete
      const finalSubdomain = subdomain.trim().toLowerCase() || tenant.subdomain;
      updateTenantConfig({
        subdomain: finalSubdomain,
        name: academyName,
        tagline: tagline,
        niche: selectedNiche,
        theme: {
          ...tenant.theme,
          primaryColor: brandHex,
          primaryHover: brandHex,
        },
        settings: {
          ...(tenant.settings as any),
          onboardingCompleted: true,
        },
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(`setup_completed_${finalSubdomain}`, 'true');
        localStorage.setItem(`setup_completed_${tenant.subdomain}`, 'true');
        localStorage.removeItem(draftKey);
        localStorage.removeItem(`onboarding_draft_${finalSubdomain}`);

        // Update browser URL if subdomain was changed during onboarding
        if (finalSubdomain !== tenant.subdomain && window.location.pathname.includes(`/${tenant.subdomain}/`)) {
          const newPath = window.location.pathname.replace(`/${tenant.subdomain}/`, `/${finalSubdomain}/`);
          window.history.replaceState(null, '', newPath);
        }
      }

      onAddToast({
        type: 'success',
        title: 'Academy Setup Completed!',
        message: `${academyName} is now fully configured and live at ${finalSubdomain}.ankabit.app.`,
      });
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercentage = Math.min(100, Math.round((completedSteps.length / steps.length) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto my-4 font-sans text-slate-900" dir={direction}>
      {/* 2-COLUMN MODAL SHELL */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        
        {/* LEFT COLUMN: Vertical Stepper Sidebar */}
        <aside className="w-full md:w-72 bg-[#F8F9FD] border-b md:border-b-0 md:border-r border-slate-200/70 p-6 sm:p-7 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-slate-950 font-display">
                ANKABIT
              </span>
              <span
                style={{ backgroundColor: `${brandHex}15`, color: brandHex }}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              >
                LMS WIZARD
              </span>
            </div>

            {/* Stepper Checklist */}
            <nav className="space-y-3.5">
              {steps.map((step) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className="w-full flex items-start gap-3 text-left transition-all cursor-pointer group"
                  >
                    {/* Status Badge */}
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div
                          style={{ backgroundColor: brandHex }}
                          className="w-6 h-6 rounded-lg text-white flex items-center justify-center shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div
                          style={{ borderColor: brandHex, color: brandHex }}
                          className="w-6 h-6 rounded-lg border-2 bg-white flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          <span style={{ backgroundColor: brandHex }} className="w-2 h-2 rounded-full" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-lg border border-slate-300 bg-white text-slate-400 flex items-center justify-center font-bold text-[10px]">
                          {step.id}
                        </div>
                      )}
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="min-w-0">
                      <div
                        style={isCurrent ? { color: brandHex } : undefined}
                        className={`text-xs font-bold transition-colors ${
                          isCurrent
                            ? 'font-black'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {step.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Progress Indicator */}
          <div className="pt-6 border-t border-slate-200/80 mt-6">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
              <span>Setup Progress</span>
              <span style={{ color: brandHex }} className="font-mono font-bold">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercentage}%`, backgroundColor: brandHex }}
                className="h-full rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Step Canvas & Action Controls */}
        <section className="flex-1 p-6 sm:p-10 flex flex-col justify-between bg-white min-w-0">
          
          {/* Top Bar: Step Indicator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span style={{ color: brandHex }} className="text-xs font-bold uppercase tracking-wider">
                Step {currentStep} of {steps.length}
              </span>

              {/* Staff / Teammate Button */}
              <button
                type="button"
                onClick={() =>
                  onAddToast({
                    type: 'info',
                    title: isQuranNiche ? 'Invite Staff / Ustadhah' : 'Invite Staff / Faculty',
                    message: 'Invite link copied to clipboard. Share with co-instructors.',
                  })
                }
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Invite Teammate</span>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-300">
                  <img
                    src={isQuranNiche ? "/images/muslim_teacher_woman.jpg" : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                    alt="Staff"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            </div>

            {/* Step Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-display tracking-tight">
                {currentStep === 1 && 'Welcome to Ankabit LMS'}
                {currentStep === 2 && 'Academy Profile & Identity'}
                {currentStep === 3 && 'Choose Specialization Track'}
                {currentStep === 4 && 'Setup Curriculum Network'}
                {currentStep === 5 && (isQuranNiche ? 'Live Interactive Halaqahs' : 'Live Interactive Classrooms')}
                {currentStep === 6 && 'Tuition & Payment Gateways'}
                {currentStep === 7 && (isQuranNiche ? 'Ustadhah & Mentor Allocation' : 'Faculty & Mentor Allocation')}
                {currentStep === 8 && 'Review & Launch Academy'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {currentStep === 1 && 'Configure your academy workspace, domain name, and learning management features in minutes.'}
                {currentStep === 2 && 'Customize your academy title, mission tagline, and theme palette for students and parents.'}
                {currentStep === 3 && 'Select your academy model to provision the appropriate pedagogical modules and grading rubrics.'}
                {currentStep === 4 && 'Complete your learning tracks with direct syllabus modules. Select specific categories or activate all.'}
                {currentStep === 5 && (isQuranNiche
                  ? 'Configure real-time audio and video halaqah settings, interactive studio features, and parent notifications.'
                  : 'Configure real-time audio and video classroom settings, interactive studio features, and student notifications.')}
                {currentStep === 6 && 'Set monthly student tuition and enable seamless processing via Stripe and Moyasar.'}
                {currentStep === 7 && (isQuranNiche
                  ? 'Assign verified female scholars to lead halaqahs, review oral recitations, and award Sanads.'
                  : 'Assign verified faculty & instructors to lead cohorts, review coursework, and award certifications.')}
                {currentStep === 8 && 'Verify all academy configuration parameters before publishing your live academy portal.'}
              </p>
            </div>
          </div>

          {/* STEP CONTENT BODY */}
          <div className="my-6 flex-1 min-h-[300px] flex flex-col justify-center">
            
            {/* STEP 1: Getting Started */}
            {currentStep === 1 && (
              <div className="space-y-4 max-w-xl">
                <div
                  style={{ backgroundColor: `${brandHex}0d`, borderColor: `${brandHex}30` }}
                  className="p-4 rounded-2xl border flex items-start gap-3"
                >
                  <Sparkles style={{ color: brandHex }} className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-900 leading-relaxed">
                    <span className="font-bold block text-sm mb-1">Welcome to Your Academy Platform</span>
                    {isQuranNiche
                      ? 'Ankabit provides your institution with Medina Mushaf recitation grading, live interactive halaqahs, Sanad certificate verification, and automated student billing.'
                      : 'Ankabit provides your institution with interactive student portals, live virtual classrooms, certificate builders, and automated tuition processing.'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Subdomain Access URL</label>
                    <span className="text-[11px] text-slate-500 font-medium">Unique academy web address</span>
                  </div>

                  <div
                    className={`flex items-center rounded-xl border overflow-hidden bg-white text-xs font-mono transition-all ${
                      subdomainCheck.status === 'invalid' || subdomainCheck.status === 'taken' || subdomainCheck.status === 'empty'
                        ? 'border-rose-400 ring-2 ring-rose-100'
                        : 'border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100'
                    }`}
                  >
                    <span className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 font-bold select-none">
                      https://
                    </span>
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => {
                        setIsSubdomainCustomized(true);
                        const cleanVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32);
                        setSubdomain(cleanVal);
                      }}
                      placeholder="e.g. madrasat-al-furqan"
                      className="flex-1 py-2.5 px-3 bg-white text-slate-900 font-bold focus:outline-none tracking-wide"
                    />
                    <span className="px-3.5 py-2.5 bg-slate-50 border-l border-slate-200 text-slate-500 font-bold select-none">
                      .ankabit.app
                    </span>
                  </div>

                  {/* Subdomain status and auto-generate helper */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    {subdomainCheck.status === 'available' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {subdomainCheck.message}
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        {subdomainCheck.message}
                      </span>
                    )}

                    {academyName && (
                      <button
                        type="button"
                        onClick={() => {
                          const slug = academyName
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '')
                            .slice(0, 24);
                          if (slug) {
                            setIsSubdomainCustomized(true);
                            setSubdomain(slug);
                          }
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-900 underline decoration-dotted transition-colors cursor-pointer"
                      >
                        Auto-sync from Academy Name
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Academy Profile */}
            {currentStep === 2 && (
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Academy Name</label>
                  <input
                    type="text"
                    value={academyName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setAcademyName(newName);
                      if (!isSubdomainCustomized && (!subdomain || subdomain === 'academy')) {
                        const slug = newName
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '')
                          .slice(0, 24);
                        if (slug) setSubdomain(slug);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2"
                    placeholder="e.g. Madrasat Al-Furqan Academy"
                  />
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span>Portal URL:</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      https://{subdomain || 'academy'}.ankabit.app
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      (Edit Subdomain)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Academy Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2"
                    placeholder={
                      isQuranNiche
                        ? "e.g. Mastering Sacred Quranic Memorization & Tajweed"
                        : "e.g. Empowering Next-Generation Leaders through World-Class Education"
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Brand Color Accent</label>
                  <div className="flex items-center gap-3">
                    {['#059669', '#2563eb', '#7c3aed', '#d97706', '#0f172a'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPrimaryColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          primaryColor === c ? 'scale-110 ring-2 ring-slate-400 border-white' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Specialization Track */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl">
                {[
                  {
                    id: 'madrasat',
                    title: 'Madrasat Quran & Tajweed',
                    desc: 'Medina Mushaf reader, recitation audio grading, Tajweed token highlight, Sanad studio.',
                    icon: BookOpen,
                  },
                  {
                    id: 'code_academy',
                    title: 'Code Academy Bootcamp',
                    desc: 'Monaco coding sandbox, algorithmic unit test runner, terminal labs & Git PR reviews.',
                    icon: Layers,
                  },
                  {
                    id: 'school',
                    title: 'International School',
                    desc: 'AP Honors gradebook, attendance roster, report card generation, university advising.',
                    icon: Building2,
                  },
                ].map((n) => {
                  const Icon = n.icon;
                  const isSelected = selectedNiche === n.id;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        const newNiche = n.id as TenantNiche;
                        setSelectedNiche(newNiche);
                        setCategories(getCategoriesForNiche(newNiche));
                        const isNewQuran = newNiche === 'madrasat';
                        if (!isSubdomainCustomized && academyName.includes('Madrasat')) {
                          setAcademyName(isNewQuran ? 'Madrasat Al-Furqan Academy' : newNiche === 'code_academy' ? 'Code Horizon Academy' : 'Horizon Preparatory School');
                        }
                        setLeadTeacherName(isNewQuran ? 'Ustadhah Zainab Al-Fayez' : 'Dr. Sarah Jenkins');
                        setLeadTeacherTitle(isNewQuran ? 'Senior Qariyah & Sanad Holder' : 'Lead Faculty Director & Senior Instructor');
                      }}
                      style={isSelected ? { borderColor: brandHex, backgroundColor: `${brandHex}0d` } : undefined}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon style={isSelected ? { color: brandHex } : undefined} className="w-5 h-5 text-slate-500" />
                        {isSelected && <CheckCircle2 style={{ color: brandHex }} className="w-4 h-4" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 4: Setup Curriculum Network */}
            {currentStep === 4 && (
              <div className="space-y-4 max-w-2xl">
                {/* Master Toggle Card */}
                <div
                  onClick={toggleAllCategories}
                  className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/90 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
                      <BookOpen style={{ color: brandHex }} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 font-display">
                        All Academy Categories
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Get access to our complete curriculum network
                      </p>
                    </div>
                  </div>

                  {/* Master Checkbox */}
                  <div
                    style={allCategoriesSelected ? { backgroundColor: brandHex, borderColor: brandHex } : undefined}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      allCategoriesSelected
                        ? 'text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {allCategoriesSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    OR CHOOSE SPECIFIC SPECIALIZATIONS
                  </span>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = getCategoryIcon(cat.iconName);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        style={cat.selected ? { borderColor: brandHex, backgroundColor: `${brandHex}08` } : undefined}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          cat.selected
                            ? 'shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon style={cat.selected ? { color: brandHex } : undefined} className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className={`text-xs truncate ${cat.selected ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                            {cat.title}
                          </span>
                        </div>
                        <div
                          style={cat.selected ? { backgroundColor: brandHex, borderColor: brandHex } : undefined}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-1.5 transition-colors ${
                            cat.selected
                              ? 'text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {cat.selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Virtual Classrooms */}
            {currentStep === 5 && (
              <div className="space-y-4 max-w-xl">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Real-Time Video & Audio Classrooms</h4>
                      <p className="text-[11px] text-slate-500">
                        {isQuranNiche
                          ? 'Enable bidirectional live audio/video halaqahs & interactive studio'
                          : 'Enable bidirectional live audio/video classrooms & live streaming'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableWebRTC}
                      onChange={(e) => setEnableWebRTC(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Parent Recording Consent Compliance</h4>
                      <p className="text-[11px] text-slate-500">
                        {isQuranNiche
                          ? 'Require consent banner before joining live video halaqah'
                          : 'Require consent banner before joining live video session'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={recordingConsent}
                      onChange={(e) => setRecordingConsent(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Tuition Plans */}
            {currentStep === 6 && (
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Monthly Tuition Price ($ USD)</label>
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-white text-xs font-mono">
                    <span className="px-3.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(Number(e.target.value))}
                      className="flex-1 py-2.5 px-1 bg-transparent text-slate-900 font-bold focus:outline-none"
                    />
                    <span className="px-3 text-slate-400 font-bold">/ month</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => setEnableStripe(!enableStripe)}
                    style={enableStripe ? { borderColor: brandHex, backgroundColor: `${brandHex}0d` } : undefined}
                    className="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Stripe Billing</span>
                      <span className="text-[10px] text-slate-400">Cards & Apple Pay</span>
                    </div>
                    <CreditCard style={enableStripe ? { color: brandHex } : undefined} className="w-4 h-4 text-slate-400" />
                  </div>

                  <div
                    onClick={() => setEnableMoyasar(!enableMoyasar)}
                    style={enableMoyasar ? { borderColor: brandHex, backgroundColor: `${brandHex}0d` } : undefined}
                    className="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Moyasar (GCC)</span>
                      <span className="text-[10px] text-slate-400">Mada & STC Pay</span>
                    </div>
                    <CreditCard style={enableMoyasar ? { color: brandHex } : undefined} className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Ustadhah / Faculty Mentor Allocation */}
            {currentStep === 7 && (
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isQuranNiche ? 'Lead Instructor / Ustadhah Full Name' : 'Lead Instructor / Faculty Director Full Name'}
                  </label>
                  <input
                    type="text"
                    value={leadTeacherName}
                    onChange={(e) => setLeadTeacherName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Title & Accreditation</label>
                  <input
                    type="text"
                    value={leadTeacherTitle}
                    onChange={(e) => setLeadTeacherTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 8: Review & Launch */}
            {currentStep === 8 && (
              <div className="space-y-4 max-w-xl">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Academy Name:</span>
                    <span className="font-bold text-slate-900">{academyName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Subdomain Address:</span>
                    <span className="font-bold text-slate-900 font-mono">https://{subdomain || 'academy'}.ankabit.app</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Curriculum Tracks:</span>
                    <span className="font-bold text-slate-900">
                      {categories.filter((c) => c.selected).length} Categories Active
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Lead Faculty:</span>
                    <span className="font-bold text-slate-900">{leadTeacherName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Monthly Tuition:</span>
                    <span className="font-bold text-emerald-700 font-mono">${planPrice}.00 / month</span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Ready to deploy! Your custom academy portal will go live instantly.</span>
                </div>
              </div>
            )}

          </div>

          {/* FOOTER CONTROLS */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {/* Left: Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`text-xs font-bold transition-colors cursor-pointer ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &lt; Previous
            </button>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onComplete}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                I'll do this later
              </button>

              <button
                type="button"
                onClick={handleNext}
                style={{ backgroundColor: brandHex }}
                className="hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentStep === steps.length ? 'Launch Academy' : 'Continue Setup'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
