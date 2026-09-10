import React, { useState, useEffect } from 'react';
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
import { Button } from '../ui';

interface TourStep {
  id: number;
  title: string;
  tabTarget: AdminTab;
  badge: string;
  shortDesc: string;
  icon: any;
  actionText: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: 'Academy Overview',
    tabTarget: 'overview',
    badge: '1 of 6',
    shortDesc: 'Track your student admissions funnel, active enrollments, and tuition revenue trends in real time.',
    icon: LayoutDashboard,
    actionText: 'Open Overview',
  },
  {
    id: 2,
    title: 'Visual Page Builder',
    tabTarget: 'page_builder',
    badge: '2 of 6',
    shortDesc: 'Customize landing pages with drag-and-drop Tailwind blocks, calligraphy hero, and live preview.',
    icon: Layers,
    actionText: 'Open Builder',
  },
  {
    id: 3,
    title: 'Admissions Form Builder',
    tabTarget: 'form_builder',
    badge: '3 of 6',
    shortDesc: 'Create intake questionnaires, customize themes, and collect student leads with live test preview.',
    icon: FileCheck,
    actionText: 'Open Form Builder',
  },
  {
    id: 4,
    title: 'Live WebRTC Classroom',
    tabTarget: 'classroom',
    badge: '4 of 6',
    shortDesc: 'Host interactive Halaqah sessions with live multi-party video, audio verse looper, and whiteboard.',
    icon: Video,
    actionText: 'Enter Classroom',
  },
  {
    id: 5,
    title: 'Community Forum',
    tabTarget: 'forum',
    badge: '5 of 6',
    shortDesc: 'Foster student discussions and homework Q&A with instructor badges, replies, and upvoting.',
    icon: MessageSquare,
    actionText: 'Open Forum',
  },
  {
    id: 6,
    title: 'Tuition & Payment Gateways',
    tabTarget: 'pricing',
    badge: '6 of 6',
    shortDesc: 'Set up tuition tiers and connect Stripe, Moyasar (Mada/Apple Pay), or bank transfer gateways.',
    icon: CreditCard,
    actionText: 'Open Gateways',
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

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const StepIcon = currentStep?.icon;

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('techmadrasah_tour_completed', 'true');
    }
    success('Tour Completed! 🎉', `Welcome to ${academyName}! Your academy workspace is ready.`);
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, isLastStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-start justify-center sm:justify-start p-4 sm:p-8 font-sans">
      {/* Chrome-Style Floating Spotlight Tooltip */}
      <div className="pointer-events-auto w-full max-w-sm sm:max-w-md bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-4 sm:p-5 relative animate-in fade-in slide-in-from-bottom-3 duration-200 sm:ml-64 sm:mt-16">
        {/* Pointing Caret Arrow */}
        <div className="hidden sm:block absolute -left-2.5 top-6 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-slate-900/95" />

        {/* Header with Step Counter and Close */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <StepIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Step {currentStep.badge}
              </span>
              <h4 className="text-sm font-bold text-white leading-snug">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss tour"
            title="Dismiss tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Concise Micro-copy */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {currentStep.shortDesc}
        </p>

        {/* Step Progress Dots & Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  onNavigateTab(TOUR_STEPS[idx].tabTarget);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-5 bg-emerald-400'
                    : idx < currentStepIndex
                    ? 'w-2 bg-emerald-600'
                    : 'w-2 bg-slate-700'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer px-2 py-1"
            >
              Skip
            </button>

            {currentStepIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>{isLastStep ? 'Finish' : 'Next'}</span>
              {isLastStep ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
