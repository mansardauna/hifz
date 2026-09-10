import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Badge } from '../ui';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { TenantSubscriptionPlan } from '../../types';
import { ToastMessage } from '../ui/Toast';
import { getStoredPlatformPlans } from '../../services/platformPlans';
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  onAddToast,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [plans, setPlans] = useState(getStoredPlatformPlans());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const activePlan: string = tenant.subscriptionPlan || 'free';

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPlans(getStoredPlatformPlans());
      // Slight delay to check initial scroll dimensions
      setTimeout(checkScrollBounds, 100);
    }
  }, [isOpen]);

  const checkScrollBounds = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active card index based on scroll position
    const cardWidth = clientWidth / 2.5;
    if (cardWidth > 0) {
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, idx), plans.length - 1));
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    // Scroll by approx one card width + gap
    const scrollAmount = container.clientWidth * 0.42;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToCard = (index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cardElements = container.children;
    if (cardElements[index]) {
      (cardElements[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const handleUpgrade = async (planId: string, planName: string, studentCapacity: number) => {
    setIsProcessing(planId);

    // Simulate payment gateway redirect & tokenization
    setTimeout(() => {
      updateTenantConfig({
        subscriptionPlan: planId as TenantSubscriptionPlan,
        studentCapacity: studentCapacity,
      });

      setIsProcessing(null);
      onClose();

      const message = `Your institution has successfully switched to the ${planName} plan with active capacity for ${studentCapacity >= 99999 ? 'Unlimited' : studentCapacity} students.`;

      if (onAddToast) {
        onAddToast({
          type: 'success',
          title: 'Plan Upgraded! 🚀',
          message,
        });
      } else {
        success('Plan Upgraded! 🚀', message);
      }
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Your Academy Subscription Tier"
      size="6xl"
    >
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="primary" className="px-2.5 py-0.5 text-xs font-bold">
                Multi-Tenant Scale & Growth
              </Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Instant Auto-Activation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Scale Your Academy with Powerful Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
              Unlock custom domains, high-capacity live WebRTC classrooms, Sanad certificate generation, and dedicated teacher seats.
            </p>
          </div>

          {/* Billing Cycle Toggle + Slider Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Monthly / Yearly Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yearly</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  -20%
                </span>
              </button>
            </div>

            {/* Slider Arrow Buttons (Shown when > 2 plans) */}
            {plans.length > 2 && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all cursor-pointer"
                  title="Previous Plans"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all cursor-pointer"
                  title="Next Plans"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2.5 Cards Visible Carousel Container */}
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={checkScrollBounds}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-4 pb-4 px-1 no-scrollbar"
          >
            {plans.map((p, idx) => {
              const isCurrent = activePlan === p.id;
              const displayPrice =
                billingCycle === 'yearly'
                  ? p.priceYearly > 0
                    ? Math.round(p.priceYearly / 12)
                    : 0
                  : p.priceMonthly;

              return (
                <div
                  key={p.id}
                  className={`snap-start shrink-0 flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 relative
                    w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc((100%-24px)/2.2)] lg:w-[calc((100%-32px)/2.5)] min-w-[280px] max-w-[420px]
                    ${
                      p.isPopular
                        ? 'border-emerald-600 bg-emerald-50/20 shadow-lg ring-1 ring-emerald-500/20'
                        : isCurrent
                        ? 'border-slate-800 bg-slate-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                >
                  {/* Popular Floating Tag */}
                  {p.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{p.badge || 'Most Popular'}</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-black text-slate-900 text-base">{p.name}</h3>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded-full">
                          Current
                        </span>
                      ) : p.badge && !p.isPopular ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                          {p.badge}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
                      {p.description}
                    </p>

                    {/* Pricing Box */}
                    <div className="my-4 py-3 px-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          ${displayPrice}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {displayPrice === 0 ? 'forever' : '/ month'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-1">
                        {billingCycle === 'yearly' && p.priceYearly > 0
                          ? `$${p.priceYearly}/yr billed annually (2 months free)`
                          : `$${p.priceYearly}/yr billed annually`}
                      </div>
                    </div>

                    {/* Quota Limits Bar */}
                    <div className="space-y-2 mb-4 pb-3 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Student Limit:</span>
                        </span>
                        <span className="text-emerald-700 font-extrabold">
                          {p.studentCapacity >= 99999
                            ? 'Unlimited Students'
                            : `${p.studentCapacity} Active Students`}
                        </span>
                      </div>
                      {p.teacherSeats && (
                        <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-slate-400" />
                            <span>Teacher Seats:</span>
                          </span>
                          <span className="text-slate-700">
                            {p.teacherSeats >= 999 ? 'Unlimited' : `${p.teacherSeats} Seats`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-xs text-slate-600">
                      {p.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Upgrade Button */}
                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <Button
                      variant={p.isPopular ? 'primary' : isCurrent ? 'secondary' : 'outline'}
                      size="sm"
                      className="w-full font-bold text-xs py-2.5 shadow-xs"
                      disabled={isCurrent || isProcessing === p.id}
                      onClick={() => handleUpgrade(p.id, p.name, p.studentCapacity)}
                    >
                      {isProcessing === p.id ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Upgrading...</span>
                        </span>
                      ) : isCurrent ? (
                        'Active Plan'
                      ) : p.priceMonthly === 0 ? (
                        'Downgrade to Free'
                      ) : (
                        'Upgrade Plan'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Indicators / Slide Dots */}
          {plans.length > 2 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {plans.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => scrollToCard(dotIdx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === dotIdx ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Security & Money Back Guarantee */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                14-Day Money-Back Guarantee & Cancel Anytime
              </h4>
              <p className="text-[11px] text-slate-500">
                Secure checkout via Stripe / Moyasar with instant plan activation.
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-700 font-bold shrink-0">Encrypted 256-bit SSL</span>
        </div>
      </div>
    </Modal>
  );
};
