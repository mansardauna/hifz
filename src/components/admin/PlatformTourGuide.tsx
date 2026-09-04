import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { AdminTab } from '../layout/Sidebar';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Layers,
  FileCheck,
  Video,
  MessageSquare,
  CreditCard,
  LayoutDashboard,
  Rocket,
  Compass,
  Check,
} from 'lucide-react';
import { Button, Badge } from '../ui';

interface TourStep {
  id: number;
  title: string;
  tabTarget: AdminTab;
  badge: string;
  description: string;
  tips: string[];
  icon: any;
  actionText: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: 'Academy Overview & Metrics',
    tabTarget: 'overview',
    badge: 'Step 1 of 6',
    description:
      'Monitor your student admissions funnel, active enrolled learners, tuition payments collected, and high-level KPI trends in real-time.',
    tips: [
      'Track monthly tuition revenue and pending applications',
      'Filter admissions by recent submissions and status',
      'Inspect quick health indicators across all courses',
    ],
    icon: LayoutDashboard,
    actionText: 'View Metrics Workspace',
  },
  {
    id: 2,
    title: 'Visual Drag-and-Drop Page Builder',
    tabTarget: 'page_builder',
    badge: 'Step 2 of 6',
    description:
      'Customize your public academy landing page with modern Tailwind CSS blocks, khatam star patterns, hero calligraphy, and live responsive preview.',
    tips: [
      'Use GrapesJS visual canvas to rearrange sections',
      'Toggle desktop, tablet, and mobile device viewports',
      'Save instantly to local storage and your cloud database',
    ],
    icon: Layers,
    actionText: 'Open Page Builder',
  },
  {
    id: 3,
    title: 'Admissions Form Builder & Submissions',
    tabTarget: 'form_builder',
    badge: 'Step 3 of 6',
    description:
      'Create custom student registration forms with Arabic/English questions, file uploads, and inspect incoming responses in isolated sortable tables.',
    tips: [
      'Drag and reorder form input fields',
      'View individual responses with sortable columns and dynamic charts',
      'Export lead submissions to CSV anytime',
    ],
    icon: FileCheck,
    actionText: 'Build Admission Form',
  },
  {
    id: 4,
    title: 'Live WebRTC Classroom & Whiteboard',
    tabTarget: 'classroom',
    badge: 'Step 4 of 6',
    description:
      'Host interactive Halaqah sessions with live multi-party video, integrated audio Quran verse looper, screen sharing, and collaborative whiteboard.',
    tips: [
      'Low-latency WebRTC powered by LiveKit Cloud',
      'Draw Tajweed annotations and highlight verses live',
      'Students can raise hands and record recitations',
    ],
    icon: Video,
    actionText: 'Enter Live Classroom',
  },
  {
    id: 5,
    title: 'Community Forum & Student Huddle',
    tabTarget: 'forum',
    badge: 'Step 5 of 6',
    description:
      'Foster student discussion and peer learning with dedicated channels, verified instructor badges, markdown replies, and upvoting.',
    tips: [
      'Create topic channels for Tajweed Q&A, Memorization Tips, and Announcements',
      'Instructors can pin important homework threads',
      'Real-time replies with rich text support',
    ],
    icon: MessageSquare,
    actionText: 'Explore Community Forum',
  },
  {
    id: 6,
    title: 'Tuition Packages & Merchant Gateways',
    tabTarget: 'pricing',
    badge: 'Step 6 of 6',
    description:
      'Set up student tuition subscription plans and connect Stripe, Moyasar (Mada/Apple Pay), or bank transfer gateways.',
    tips: [
      'Offer monthly and yearly tuition packages',
      'Automate invoice generation and receipts',
      'Upgrade your academy tier for custom domains & enterprise features',
    ],
    icon: CreditCard,
    actionText: 'Configure Pricing & Gateways',
  },
];

interface PlatformTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: AdminTab) => void;
  academyName: string;
}

export const PlatformTourGuide: React.FC<PlatformTourGuideProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  academyName,
}) => {
  const { success } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (isLastStep) {
      handleCompleteTour();
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigateTab(TOUR_STEPS[nextIdx].tabTarget);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateTab(TOUR_STEPS[prevIdx].tabTarget);
    }
  };

  const handleCompleteTour = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('techmadrasah_tour_completed', 'true');
    }
    success('Tour Completed! 🎉', `Welcome aboard to ${academyName}! Your academy is ready for students.`);
    onClose();
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    onNavigateTab(TOUR_STEPS[index].tabTarget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col relative transform transition-all">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-6 text-white relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <Compass className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-200 block">
                Interactive Platform Tour
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Welcome to {academyName}!
              </h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-100 mb-1.5">
              <span>{currentStep.badge}</span>
              <span>{Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-emerald-950/40 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-emerald-300 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Navigation Dots Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleJumpToStep(idx)}
                className={`w-7 h-7 rounded-full text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                    : idx < currentStepIndex
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}
                title={step.title}
              >
                {idx < currentStepIndex ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Click any step to jump
          </span>
        </div>

        {/* Step Content Body */}
        <div className="p-6 sm:p-8 space-y-5 text-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{currentStep.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Key Tips Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Pro-Tips & Highlights
            </span>
            {currentStep.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* Jump to Workspace CTA */}
          <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-xs font-bold text-emerald-900">
              Ready to explore this tool right now?
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onNavigateTab(currentStep.tabTarget);
                onClose();
              }}
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-100 font-bold text-xs"
            >
              {currentStep.actionText}
            </Button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span>Don't show automatically on next login</span>
          </label>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevious}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={isLastStep ? <Rocket className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              {isLastStep ? 'Finish & Start Building' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
